import { fabric } from "fabric"
import { IScene, ILayer } from "@layerhub-pro/types"
import ObjectImporter from "./object-importer-render"
import { base64ImageToFile } from "./parser"
import { LayerType } from "../common/constants"

class Renderer {
  public async render(template: IScene, params: Record<string, string>): Promise<string> {
    return await this.toDataURL(template, params)
  }

  public async toDataURL(template: IScene, params: Record<string, any>): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const staticCanvas = new fabric.StaticCanvas(null)
      await this.loadTemplate(staticCanvas, template, params)
      const data = staticCanvas.toDataURL({
        top: 0,
        left: 0,
        height: staticCanvas.getHeight(),
        width: staticCanvas.getWidth(),
      })
      resolve(data)
    })
  }

  public renderLayer = (layer: Required<ILayer>, params: {}) => {
    return new Promise(async (resolve, reject) => {
      const staticCanvas = new fabric.StaticCanvas(null)
      await this.loadTemplate(
        staticCanvas,
        {
          id: layer.id,
          metadata: {},
          layers: [{ ...layer, top: 0, left: 0 }],
          frame: {
            width: layer.width * layer.scaleX,
            height: layer.height * layer.scaleY,
            id: "",
            dpi: 300,
            unit: "px",
          },
        },
        params
      )
      const data = staticCanvas.toDataURL({
        top: 0,
        left: 0,
        height: staticCanvas.getHeight(),
        width: staticCanvas.getWidth(),
      })
      resolve(data)
    })
  }

  /**
   * Export Canvas objects to be loaded as resources by PIXI loader
   * @returns
   */
  public exportLayers = async (template: IScene) => {
    let elements: any[] = []
    for (const [index, layer] of template.layers.entries()) {
      // @ts-ignore
      const preview = await this.renderLayer(layer, {})
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

  private async loadTemplate(staticCanvas: fabric.StaticCanvas, template: IScene, params: Record<string, string>) {
    const { frame } = template
    this.setDimensions(staticCanvas, frame)
    const objectImporter = new ObjectImporter()

    const updatedLayers = template.layers.filter((layer) => layer.type !== LayerType.BACKGROUND_CONTAINER)
    for (const layer of updatedLayers) {
      const element = await objectImporter.import(layer, params)
      if (element) {
        staticCanvas.add(element)
      } else {
        console.warn("UNABLE TO LOAD LAYER: ", layer)
      }
    }
  }

  private setDimensions(staticCanvas: fabric.StaticCanvas, { width, height }: { width: number; height: number }) {
    staticCanvas.setWidth(width).setHeight(height)
  }
}

// export const renderer = new Renderer()
export default Renderer
