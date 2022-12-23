import { fabric } from "fabric"
import { nanoid } from "nanoid"
import { IConfig, IFrame, ILayer, IScene } from "@layerhub-pro/types"
import { LayerType } from "../common/constants"
import { CanvasJSON, FabricCanvas, GradientOptions, IState } from "../common/interfaces"
import { type Editor } from "../editor/editor"
import ObjectImporter from "./objects-importer"
import Renderer from "../utils/renderer"
import History from "./history"
import ObjectExporter from "./objects-exporter"
import ObjectsManager from "./objects"
import _ from "lodash"
import setObjectGradient from "../utils/fabric"
import { getFitRatio } from "../utils/zoom"
import { base64ImageToFile } from "../utils/parser"

interface SceneOptions {
  scene: IScene
  canvas: FabricCanvas
  config: IConfig
  editor: Editor
  state: IState
}
class Scene {
  public id: string
  public objects: ObjectsManager
  private layers: fabric.Object[]
  private scene: IScene
  public canvas: FabricCanvas
  public frame: fabric.Frame
  public config: IConfig
  public editor: Editor
  private renderer: Renderer
  public preview: string
  public name: string
  public state: IState
  public history: History

  constructor(options: SceneOptions) {
    this.id = nanoid()
    this.layers = []
    this.config = options.config
    this.editor = options.editor

    this.canvas = options.canvas
    this.state = options.state

    // this.setScene(options.scene)
    this.scene = options.scene

    this.history = new History(this)
    this.renderer = new Renderer()
    this.objects = new ObjectsManager(this)
  }

  public async setScene(scene: IScene) {
    this.scene = scene
    await this.prerender()
    await this.setPreviewDefault()
    this.renderObjects()
    this.history.save()
  }

  public updateLoadedObjects() {
    const [frame, ...objects] = this.canvas.getObjects()
    this.frame = frame as fabric.Frame
    this.layers = objects
  }

  public async render() {
    this.loadFrame()
    this.updateLayers()
    await this.preloadObjects()
  }

  private removeCanvasObjects() {
    this.canvas.remove(...this.canvas.getObjects())
  }

  public async prerender() {
    // REMOVE PREVIOUS OBJECTS, OTTHERWISE YOU GET DUPLICATED FRAME
    this.removeCanvasObjects()

    this.loadFrame()
    this.updateLayers()
    await this.preloadObjects()
  }

  /**
   * Generates and sets local preview with current scene json
   */
  public async setPreviewDefault() {
    const preview = await this.renderer.render(this.scene, {})
    this.preview = preview
  }

  public async setPreview() {
    this.scene = this.toJSON()
    const preview = await this.toDataURL()
    this.preview = preview
  }

  public toJSONNative() {
    return this.canvas.toJSON(this.config.properties) as unknown as CanvasJSON
  }

  // Apply clipping if enabled
  public setClipping() {
    const [frame, ...objects] = this.canvas.getObjects()
    this.frame = frame as fabric.Frame

    if (!this.config.outsideVisible) {
      objects.forEach((object) => {
        object.clipPath = frame
      })
    }
  }

  public toJSON() {
    let animated = false

    const frameObject = this.frame

    const frame = _.pick(frameObject, "id", "dpi", "width", "height", "unit") as IFrame

    const template: IScene = {
      id: this.id ? this.id : nanoid(),
      name: this.name ? this.name : "Untitled design",
      layers: [],
      frame: frame,
      metadata: {
        animated,
      },
    }
    const objects = this.layers.map((layer) => layer.toJSON(this.config.properties))
    const layers = objects.filter((object: any) => object.type !== LayerType.FRAME)

    const objectExporter = new ObjectExporter()

    layers.forEach((layer: ILayer) => {
      // @ts-ignore
      const exportedObject = objectExporter.export(layer, frameObject)
      template.layers = template.layers.concat(exportedObject)
    })

    template.metadata = {
      ...template.metadata,
      animated,
    }
    return template
  }

  public async toDataURL(): Promise<string> {
    const data = await this.renderer.render(this.scene, {})
    return data
  }

  public updateLayers() {
    const currentLayers = [...this.scene.layers]
    const backgroundContainer = {
      ...currentLayers[0],
      type: "BackgroundContainer",
    }

    const updatedLayers = [...currentLayers].map((layer) => {
      if (layer.type === LayerType.BACKGROUND) {
        return {
          ...layer,
          shadow: this.config.background.shadow,
          top: 0,
          left: 0,
          width: this.frame.width,
          height: this.frame.height,
        }
      }
      return layer
    }) as ILayer[]
    this.scene.layers = [backgroundContainer, ...updatedLayers]
  }

  public loadFrame() {
    this.frame = new fabric.Frame({
      id: nanoid(),
      name: "Frame",
      ...this.scene.frame,
    })
    this.canvas.add(this.frame)
    this.frame.center()
  }

  public async preloadObjects() {
    const objectimporter = new ObjectImporter()
    const promiseObjects: Promise<fabric.Object>[] = []
    for (const layer of this.scene.layers) {
      const importedObject = objectimporter.import({
        item: layer as Required<ILayer>,
        isInGroup: false,
        options: this.frame as any,
      })
      promiseObjects.push(importedObject as any)
    }
    const loadedObjects = await Promise.all(promiseObjects)
    for (const loadedObject of loadedObjects) {
      if (!this.config.outsideVisible) {
        loadedObject.clipPath = this.frame
      }
    }
    this.layers = loadedObjects
  }

  public renderObjects() {
    this.removeCanvasObjects()

    this.canvas.add(this.frame, ...this.layers)
    this.canvas.requestRenderAll()
    this.history.setCurrent()
  }

  public async loadObjects() {
    const objectimporter = new ObjectImporter()
    const promiseObjects: Promise<fabric.Object>[] = []
    for (const layer of this.scene.layers) {
      const importedObject = objectimporter.import({
        item: layer as Required<ILayer>,
        isInGroup: false,
        options: this.frame as any,
      })
      promiseObjects.push(importedObject as any)
    }
    const loadedObjects = await Promise.all(promiseObjects)
    for (const loadedObject of loadedObjects) {
      if (!this.config.outsideVisible) {
        loadedObject.clipPath = this.frame
      }
    }
    this.canvas.add(...loadedObjects)
    this.canvas.requestRenderAll()
  }

  /**
   * Export Canvas objects to be loaded as resources by PIXI loader
   * @returns
   */
  public exportLayers = async (template: IScene) => {
    let elements: any[] = []
    for (const [index, layer] of template.layers.entries()) {
      // @ts-ignore
      const preview = await this.renderer.renderLayer(layer, {})
      if (layer.type === "StaticVideo") {
        elements = elements.concat({
          id: layer.id,
          type: "StaticVideo",
          // @ts-ignore
          url: layer.src,
          duration: layer.duration,
          display: {
            from: 0,
            to: layer.duration,
          },
          cut: layer.cut
            ? layer.cut
            : {
                from: 0,
                to: layer.duration,
              },
          position: {
            x: layer.left,
            y: layer.top,
            zIndex: index,
            width: layer.width,
            height: layer.height,
            scaleX: layer.scaleX,
            scaleY: layer.scaleY,
          },
          objectId: layer.id,
        })
      } else {
        const objectURL = base64ImageToFile(preview)
        elements = elements.concat({
          id: layer.id,
          type: "StaticImage",
          url: objectURL,
          duration: 5000,
          display: {
            from: 0,
            to: 5000,
          },
          cut: {
            from: 0,
            to: 0,
          },
          position: {
            x: layer.left,
            y: layer.top,
            zIndex: index,
            width: layer.width,
            height: layer.height,
            scaleX: layer.scaleX,
            scaleY: layer.scaleY,
          },
          objectId: layer.id,
        })
      }
    }
    return elements
  }

  get background() {
    return this.canvas
      .getObjects()
      .find((object) => object.type === LayerType.BACKGROUND) as Required<fabric.Background>
  }

  public updateBackground = (props: Record<string, any>) => {
    const background = this.background
    if (background) {
      background.set(props)
      this.state.setBackground({ ...background.toJSON(), ...props })
      this.canvas.requestRenderAll()
      this.history.save()
    }
  }

  public setBackgroundGradient = ({ angle, colors }: GradientOptions) => {
    const background = this.background
    if (background) {
      setObjectGradient(background, angle, colors)
      this.state.setBackground({ ...background.toJSON(), gradient: { angle, colors } })
      this.canvas.requestRenderAll()
      this.history.save()
    }
  }
  public getFitRatio = () => {
    return getFitRatio(this.frame, this.canvas, this.config)
  }
}

export default Scene
