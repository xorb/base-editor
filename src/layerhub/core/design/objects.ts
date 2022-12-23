import { fabric } from "fabric"
import type Scene from "./scene"
import ObjectImporter from "./objects-importer"
import { ILayer, ILayerOptions } from "@layerhub-pro/types"
import { LayerType } from "../common/constants"
import { nanoid } from "nanoid"
import { Direction, GradientOptions, ScaleType, ShadowOptions } from "../common/interfaces"
import { isArray } from "lodash"
import ObjectExporter from "./objects-exporter"
import setObjectGradient, { setObjectShadow } from "../utils/fabric"
import { loadImageFromURL } from "../utils/image-loader"

class Objects {
  public clipboard: any
  public isCut: any
  constructor(public scene: Scene) {}

  public async add(item: Partial<ILayer>) {
    const frame = this.scene.frame
    const objectImporter = new ObjectImporter()
    const object: fabric.Object = await objectImporter.import({
      isInGroup: false,
      item: item as ILayer,
      options: frame as unknown as Required<ILayer>,
    })

    if (!this.scene.config.outsideVisible) {
      object.clipPath = frame
    }

    this.addObject(object)
    this.scene.canvas.setActiveObject(object)
    this.scene.state.setActiveObject(object)

    this.updateContextObjects()
    this.scene.history.save()
  }

  private async addObject(object: any) {
    const frame = this.scene.frame
    const canvas = this.scene.canvas
    const isBackgroundImage = object.type === LayerType.BACKGROUND_IMAGE
    let currentBackgrounImage: any
    if (isBackgroundImage) {
      currentBackgrounImage = await this.partialUnsetBackgroundImage()
    }

    if (isBackgroundImage) {
      canvas.add(object)
      object.moveTo(2)
      this.scale("fill", object.id)
      object.set({
        hasControls: true,
        lockMovementY: false,
        lockMovementX: false,
        hasBorders: true,
      })
      if (currentBackgrounImage) {
        canvas.add(currentBackgrounImage)
        this.sendToBack(currentBackgrounImage.id)
      }
    } else {
      canvas.add(object)
      if (object.width! > frame.width!) {
        this.scale("fit", object.id)
      } else {
        object.center()
      }
    }
  }

  /**
   *
   * @param options object properties to be updated
   * @param id if provided, will update the update by id
   */
  public update = (options: Partial<ILayerOptions>, id?: string) => {
    const frame = this.scene.frame
    const canvas = this.scene.canvas

    let refObject = canvas.getActiveObject()
    if (id) {
      refObject = this.findOneById(id)
    }
    if (refObject) {
      for (const property in options) {
        if (property === "angle" || property === "top" || property === "left") {
          if (property === "angle") {
            // @ts-ignore
            refObject.rotate(options["angle"])
            canvas.requestRenderAll()
          } else {
            // @ts-ignore
            refObject.set(property as "top" | "left", options[property])
            canvas.requestRenderAll()
          }
        } else if (property === "clipToFrame") {
          if (options["clipToFrame"]) {
            refObject.set("clipPath", frame)
          } else {
            refObject.set("clipPath", null)
          }
        } else {
          if (refObject.type === LayerType.ACTIVE_SELECTION && refObject._objects) {
            refObject._objects.forEach((object) => {
              if (property === "metadata") {
                object.set("metadata", {
                  ...object.metadata,
                  ...options["metadata"],
                })
              } else {
                // @ts-ignore
                object.set(property, options[property])
              }
              object.setCoords()
            })
          } else {
            if (property === "metadata") {
              refObject.set("metadata", {
                ...refObject.metadata,
                ...options[property],
              })
            } else {
              // @ts-ignore
              refObject.set(property, options[property])
            }
            refObject.setCoords()
          }
        }
        // @ts-ignore
        refObject.set(property as keyof fabric.Object, options[property])
        canvas.requestRenderAll()
      }
      this.scene.history.save()
    }
  }

  public scale(type: ScaleType, id?: string) {
    const canvas = this.scene.canvas
    const frame = this.scene.frame

    let refObject = canvas.getActiveObject() as Required<fabric.Object>
    const { width, height } = frame
    if (id) {
      refObject = this.findOneById(id)
    }
    if (refObject) {
      if (type === "fit") {
        refObject.set({
          scaleX: width! / refObject.width,
          scaleY: height! / refObject.height,
        })
      }
      if (type === "fill") {
        const proportion = height! / refObject.height
        refObject.set({
          scaleY: height! / refObject.height,
          scaleX: (refObject.width * proportion) / refObject.width,
        })
      }
      refObject.center()
    }
  }

  private partialUnsetBackgroundImage(): Promise<fabric.StaticImage | null> {
    const canvas = this.scene.canvas
    return new Promise(async (resolve) => {
      const objects = canvas.getObjects()
      const currentBackgroundImage = objects.find((o) => o.type === LayerType.BACKGROUND_IMAGE)
      let nextImage: fabric.StaticImage
      if (currentBackgroundImage) {
        const currentBackgroundImageJSON = currentBackgroundImage.toJSON(this.scene.config.properties)
        delete currentBackgroundImageJSON.clipPath
        const nextImageElement = await loadImageFromURL(currentBackgroundImageJSON.src)
        nextImage = new fabric.StaticImage(nextImageElement, {
          ...currentBackgroundImageJSON,
          id: nanoid(),
        })
        // @ts-ignore
        canvas.remove(currentBackgroundImage)
        resolve(nextImage)
      } else {
        resolve(null)
      }
    })
  }

  public async replaceImage(src: string) {
    const frame = this.scene.frame
    const canvas = this.scene.canvas
    const activeObject = canvas.getActiveObject() as fabric.Object
    const index = canvas.getObjects().findIndex((o) => o.id === activeObject.id)
    const objectExporter = new ObjectExporter()
    // @ts-ignore
    const exportedObject = objectExporter.export(activeObject, frame)
    const objectImporter = new ObjectImporter()
    const updatedObject = await objectImporter.import({
      item: { ...exportedObject, src },
      isInGroup: false,
      options: frame as unknown as Required<ILayer>,
    })
    canvas.insertAt(updatedObject, index, true)
    canvas.setActiveObject(updatedObject)
    this.scene.state.setActiveObject(updatedObject)
    this.updateContextObjects()
  }

  public unsetBackgroundImage(): Promise<fabric.StaticImage | null> {
    return new Promise(async (resolve) => {
      const frame = this.scene.frame
      const canvas = this.scene.canvas
      const objects = canvas.getObjects()
      const currentBackgroundImage = objects.find((o) => o.type === LayerType.BACKGROUND_IMAGE)
      let nextImage: fabric.StaticImage
      if (currentBackgroundImage) {
        const currentBackgroundImageJSON = currentBackgroundImage.toJSON(this.scene.config.properties)
        delete currentBackgroundImageJSON.clipPath
        const nextImageElement = await loadImageFromURL(currentBackgroundImageJSON.src)
        nextImage = new fabric.StaticImage(nextImageElement, {
          ...currentBackgroundImageJSON,
          id: nanoid(),
        })
        // @ts-ignore
        nextImage.clipPath = frame
        canvas.remove(currentBackgroundImage)
        canvas.add(nextImage as unknown as fabric.Object)
        nextImage.moveTo(2)
        this.scene.state.setActiveObject(nextImage)
        canvas.setActiveObject(nextImage as unknown as fabric.Object)
        // resolve(nextImage)
      } else {
        resolve(null)
      }
    })
  }

  public async setAsBackgroundImage(id?: string) {
    const canvas = this.scene.canvas
    const frame = this.scene.frame
    let refObject = canvas.getActiveObject() as fabric.Object
    if (id) {
      refObject = this.findOneById(id)
    }

    if (refObject && refObject.type === LayerType.STATIC_IMAGE) {
      let nextImage = await this.partialUnsetBackgroundImage()
      if (nextImage) {
        // @ts-ignore
        canvas.add(nextImage)
      }
      const objectJSON = refObject.toJSON(this.scene.config.properties)

      delete objectJSON.clipPath
      const image = await loadImageFromURL(objectJSON.src)
      const backgroundImage = new fabric.BackgroundImage(image, {
        ...objectJSON,
        id: nanoid(),
      })
      // @ts-ignore
      canvas.add(backgroundImage)
      backgroundImage.clipPath = frame
      canvas.remove(refObject)

      canvas.requestRenderAll()
      this.scale("fill", backgroundImage.id)
      backgroundImage.moveTo(2)
      if (nextImage) {
        this.sendToBack(nextImage.id)
      }
    }
  }

  /**
   * Set object shadow
   * @param options ShadowOptions
   */
  public setShadow = (options: ShadowOptions) => {
    const canvas = this.scene.canvas
    const activeObject = canvas.getActiveObject()
    if (activeObject instanceof fabric.Group && activeObject.type !== LayerType.STATIC_VECTOR) {
      // @ts-ignore
      activeObject._objects.forEach((object) => {
        setObjectShadow(object, options)
      })
    } else {
      setObjectShadow(activeObject, options)
    }
    canvas.requestRenderAll()
    this.scene.history.save()
  }

  /**
   * Set object fill as gradient
   * @param param GradientOptions
   */
  public setGradient = ({ angle, colors }: GradientOptions) => {
    const canvas = this.scene.canvas
    const activeObject = canvas.getActiveObject()
    if (activeObject instanceof fabric.Group) {
      // @ts-ignore
      activeObject._objects.forEach((object) => {
        setObjectGradient(object, angle, colors)
      })
    } else if (activeObject) {
      setObjectGradient(activeObject, angle, colors)
    }
    canvas.requestRenderAll()
    this.scene.history.save()
  }

  // Text exclusive hooks
  public toUppercase(id?: string) {
    const canvas = this.scene.canvas

    let refObject = canvas.getActiveObject() as fabric.StaticText
    if (id) {
      refObject = this.findOneById(id)
    }
    if (refObject && refObject.type === LayerType.STATIC_TEXT) {
      if (refObject.isEditing) {
        refObject.hiddenTextarea!.value = refObject.hiddenTextarea!.value.toUpperCase()
        refObject.updateFromTextArea()
        canvas.requestRenderAll()
        return
      }

      const text = refObject.text
      refObject.text = text!.toUpperCase()
      canvas.requestRenderAll()
    }
  }

  // Text exclusive hooks
  public toLowerCase(id?: string) {
    const canvas = this.scene.canvas

    let refObject = canvas.getActiveObject() as fabric.StaticText
    if (id) {
      refObject = this.findOneById(id)
    }
    if (refObject && refObject.type === LayerType.STATIC_TEXT) {
      if (refObject.isEditing) {
        refObject.hiddenTextarea!.value = refObject.hiddenTextarea!.value.toLowerCase()
        refObject.updateFromTextArea()
        canvas.requestRenderAll()
        return
      }

      const text = refObject.text
      refObject.text = text!.toLowerCase()
      canvas.requestRenderAll()
    }
  }

  /**
   * Lock object movement and disable controls
   */
  public lock = (id?: string) => {
    const canvas = this.scene.canvas
    let refObject = canvas.getActiveObject() as fabric.Object | fabric.ActiveSelection
    if (id) {
      refObject = this.findOneById(id)
    }
    if (refObject) {
      if (refObject._objects) {
        refObject._objects.forEach((object) => {
          object.set({
            hasControls: false,
            lockMovementY: true,
            lockMovementX: true,
            locked: true,
          })
        })
        // @ts-ignore
        refObject.set({
          hasControls: false,
          lockMovementY: true,
          lockMovementX: true,
          locked: true,
        })
      } else {
        // @ts-ignore
        refObject.set({
          hasControls: false,
          lockMovementY: true,
          lockMovementX: true,
          locked: true,
        })
      }
      canvas.requestRenderAll()
      this.scene.history.save()
    }
  }

  /**
   * Unlock active object
   */
  public unlock = (id?: string) => {
    const canvas = this.scene.canvas

    let refObject = canvas.getActiveObject() as fabric.Object | fabric.ActiveSelection
    if (id) {
      refObject = this.findOneById(id)
    }
    if (refObject) {
      if (refObject?._objects) {
        refObject._objects.forEach((object) => {
          object.set({
            hasControls: true,
            lockMovementY: false,
            lockMovementX: false,
            locked: false,
          })
        })
        // @ts-ignore
        refObject.set({
          hasControls: true,
          lockMovementY: false,
          lockMovementX: false,
          locked: false,
        })
      } else {
        // @ts-ignore
        refObject.set({
          hasControls: true,
          lockMovementY: false,
          lockMovementX: false,
          locked: false,
        })
      }
      canvas.requestRenderAll()
      this.scene.history.save()
    }
  }

  /**
   * Moves an object to the top of the frame. If multiple objects are selected,
   * will move all objects to the top of the selection.
   */
  public alignTop = (id?: string) => {
    const frame = this.scene.frame
    const canvas = this.scene.canvas

    let refObject = canvas.getActiveObject()
    if (id) {
      refObject = this.findOneById(id)
    }

    if (refObject) {
      if (refObject.type === LayerType.ACTIVE_SELECTION) {
        const selectedObjects = refObject._objects as fabric.Object[]
        const refTop = refObject.top
        canvas.discardActiveObject()
        selectedObjects.forEach((object) => {
          const currentObject = object
          currentObject.set({
            top: refTop,
          })
        })
        const selection = new fabric.ActiveSelection(selectedObjects, {
          canvas: canvas,
        }) as fabric.Object
        canvas.setActiveObject(selection)
        this.scene.state.setActiveObject(selection)
      } else {
        const currentObject = refObject
        currentObject.set({
          top: frame.top,
        })
      }
      canvas.requestRenderAll()
    }
  }
  /**
   * Moves an object to the middle of the frame. If multiple objects are selected,
   * will move all objects to the middle of the selection.
   */
  public alignMiddle = (id?: string) => {
    const frame = this.scene.frame
    const canvas = this.scene.canvas
    let refObject = canvas.getActiveObject() as Required<fabric.Object>
    if (id) {
      refObject = this.findOneById(id)
    }

    if (refObject) {
      if (refObject.type === LayerType.ACTIVE_SELECTION) {
        const selectedObjects = refObject._objects as fabric.Object[]
        const refTop = refObject.top
        const refHeight = refObject.height
        canvas.discardActiveObject()
        selectedObjects.forEach((object) => {
          const currentObject = object
          const currentObjectHeight = currentObject.getScaledHeight()
          currentObject.set({
            top: refTop + refHeight / 2 - currentObjectHeight / 2,
          })
        })
        const selection = new fabric.ActiveSelection(selectedObjects, {
          canvas: canvas,
        }) as fabric.Object
        canvas.setActiveObject(selection)
        this.scene.state.setActiveObject(selection)
      } else {
        const currentObject = refObject
        const currentObjectHeight = currentObject.getScaledHeight()
        currentObject.set({
          top: frame.top! + frame.height! / 2 - currentObjectHeight / 2,
        })
      }
      canvas.requestRenderAll()
    }
  }

  /**
   * Moves an object to the bottom of the frame. If multiple objects are selected,
   * will move all objects to the bottom of the selection.
   */
  public alignBottom = (id?: string) => {
    const frame = this.scene.frame
    const canvas = this.scene.canvas
    let refObject = canvas.getActiveObject() as Required<fabric.Object>
    if (id) {
      refObject = this.findOneById(id)
    }

    if (refObject) {
      if (refObject.type === LayerType.ACTIVE_SELECTION) {
        const selectedObjects = refObject._objects as fabric.Object[]
        const refTop = refObject.top
        const refHeight = refObject.height
        canvas.discardActiveObject()
        selectedObjects.forEach((object) => {
          const currentObject = object
          const currentObjectHeight = currentObject.getScaledHeight()
          currentObject.set({
            top: refTop + refHeight - currentObjectHeight,
          })
        })
        const selection = new fabric.ActiveSelection(selectedObjects, {
          canvas: canvas,
        }) as fabric.Object
        canvas.setActiveObject(selection)
        this.scene.state.setActiveObject(selection)
      } else {
        const currentObject = refObject
        const currentObjectHeight = currentObject.getScaledHeight()
        currentObject.set({
          top: frame.top! + frame.height! - currentObjectHeight,
        })
      }
      canvas.requestRenderAll()
    }
  }

  /**
   * Moves an object to the left of the frame. If multiple objects are selected,
   * will move all objects to the left of the selection.
   */
  public alignLeft = (id?: string) => {
    const frame = this.scene.frame
    const canvas = this.scene.canvas
    let refObject = canvas.getActiveObject()
    if (id) {
      refObject = this.findOneById(id)
    }

    if (refObject) {
      if (refObject.type === LayerType.ACTIVE_SELECTION) {
        const selectedObjects = refObject._objects as fabric.Object[]
        const refLeft = refObject.left
        canvas.discardActiveObject()
        selectedObjects.forEach((object) => {
          const currentObject = object
          currentObject.set({
            left: refLeft,
          })
        })
        const selection = new fabric.ActiveSelection(selectedObjects, {
          canvas: canvas,
        }) as fabric.Object
        canvas.setActiveObject(selection)
        this.scene.state.setActiveObject(selection)
      } else {
        const currentObject = refObject
        currentObject.set({
          left: frame.left,
        })
      }
      canvas.requestRenderAll()
    }
  }

  /**
   * Moves an object to the center of the frame. If multiple objects are selected,
   * will move all objects to the center of the selection.
   */
  public alignCenter = (id?: string) => {
    const frame = this.scene.frame
    const canvas = this.scene.canvas
    let refObject = canvas.getActiveObject() as Required<fabric.Object>
    if (id) {
      refObject = this.findOneById(id)
    }

    if (refObject) {
      if (refObject.type === LayerType.ACTIVE_SELECTION) {
        const selectedObjects = refObject._objects
        const refLeft = refObject.left
        const refWidth = refObject.width
        canvas.discardActiveObject()
        selectedObjects.forEach((object) => {
          const currentObject = object
          const currentObjectWidth = currentObject.getScaledWidth()
          currentObject.set({
            left: refLeft + refWidth / 2 - currentObjectWidth / 2,
          })
        })
        const selection = new fabric.ActiveSelection(selectedObjects, {
          canvas: canvas,
        }) as fabric.Object
        canvas.setActiveObject(selection)
        this.scene.state.setActiveObject(selection)
      } else {
        const currentObject = refObject
        const currentObjectWidth = currentObject.getScaledWidth()
        currentObject.set({
          left: frame.left! + frame.width! / 2 - currentObjectWidth / 2,
        })
      }
      canvas.requestRenderAll()
    }
  }

  /**
   * Moves an object to the right of the frame. If multiple objects are selected,
   * will move all objects to the right of the selection.
   */
  public alignRight = (id?: string) => {
    const frame = this.scene.frame
    const canvas = this.scene.canvas
    let refObject = canvas.getActiveObject() as Required<fabric.Object>
    if (id) {
      refObject = this.findOneById(id)
    }
    if (refObject) {
      if (refObject.type === LayerType.ACTIVE_SELECTION) {
        const selectedObjects = refObject._objects as fabric.Group[]
        const refLeft = refObject.left
        const refWidth = refObject.width
        canvas.discardActiveObject()
        selectedObjects.forEach((object) => {
          const currentObject = object
          const currentObjectWidth = currentObject.getScaledWidth()
          currentObject.set({
            left: refLeft + refWidth - currentObjectWidth,
          })
        })
        const selection = new fabric.ActiveSelection(selectedObjects, {
          canvas: canvas,
        }) as fabric.Object
        canvas.setActiveObject(selection)
        this.scene.state.setActiveObject(selection)
      } else {
        const currentObject = refObject
        const currentObjectWidth = currentObject.getScaledWidth()
        currentObject.set({
          left: frame.left! + frame.width! - currentObjectWidth,
        })
      }
      canvas.requestRenderAll()
    }
  }

  public clone = () => {
    const canvas = this.scene.canvas
    const frame = this.scene.frame
    if (canvas) {
      const activeObject = canvas.getActiveObject()
      canvas.discardActiveObject()

      this.duplicate(activeObject!, frame, (duplicates) => {
        const selection = new fabric.ActiveSelection(duplicates, {
          canvas: canvas,
        }) as fabric.Object
        canvas.setActiveObject(selection)
        canvas.requestRenderAll()
      })
    }
  }

  public cloneAudio = (id: string) => {
    const object = this.findOneById(id)
    const canvas = this.scene.canvas
    const frame = this.scene.frame

    this.deselect()
    this.duplicate(object, frame, (duplicates) => {
      canvas.requestRenderAll()
      this.updateContextObjects()
    })
  }

  private duplicate(object: fabric.Object, frame: fabric.Object, callback: (clones: fabric.Object[]) => void): void {
    const canvas = this.scene.canvas
    if (object instanceof fabric.Group && object.type !== LayerType.STATIC_VECTOR) {
      const objects: fabric.Object[] = (object as fabric.Group).getObjects()
      const duplicates: fabric.Object[] = []
      for (let i = 0; i < objects.length; i++) {
        this.duplicate(objects[i], frame, (clones) => {
          duplicates.push(...clones)
          if (i === objects.length - 1) {
            callback(duplicates)
          }
        })
      }
    } else {
      object.clone(
        (clone: fabric.Object) => {
          clone.clipPath = undefined
          clone.id = nanoid()
          clone.set({
            left: object.left! + 10,
            top: object.top! + 10,
          })
          if (!this.scene.config.outsideVisible) {
            clone.clipPath = frame
          }
          canvas.add(clone)
          callback([clone])
        },
        ["keyValues", "src"]
      )
    }
  }

  /**`
   * Remove active object
   */
  public remove = (id?: string) => {
    const canvas = this.scene.canvas
    let refObject = canvas.getActiveObjects()

    if (id) {
      refObject = this.findOneById(id)
    }

    if (refObject) {
      if (isArray(refObject)) {
        refObject.forEach((obj) => {
          canvas.remove(obj)
        })
      } else {
        canvas.remove(refObject)
      }

      canvas.discardActiveObject().renderAll()
      this.scene.history.save()
      this.updateContextObjects()
    }
  }

  public cut = () => {
    this.copy()
    this.isCut = true
    this.remove()
  }

  public copy = (id?: string) => {
    const canvas = this.scene.canvas
    let refObject = canvas.getActiveObjects()

    if (id) {
      const object = this.findOneById(id)
      if (object) {
        refObject = object
      }
    }

    if (refObject) {
      if (isArray(refObject)) {
        this.clipboard = refObject[0]
      } else {
        this.clipboard = refObject
      }
    }
  }

  public paste = () => {
    const object = this.clipboard
    if (object) {
      const canvas = this.scene.canvas
      const frame = this.scene.frame
      canvas.discardActiveObject()
      this.duplicate(object, frame, (duplicates) => {
        const selection = new fabric.ActiveSelection(duplicates, {
          canvas: canvas,
        }) as fabric.Object
        canvas.setActiveObject(selection)
        canvas.requestRenderAll()
        this.updateContextObjects()
      })
    }
  }

  public select = (id?: string) => {
    const canvas = this.scene.canvas
    canvas.discardActiveObject()
    if (id) {
      const [object] = this.findById(id) as fabric.Object[]
      if (object) {
        canvas.disableEvents()
        canvas.setActiveObject(object)
        if (object.group) {
          object.hasControls = false
        }
        canvas.enableEvents()
        canvas.requestRenderAll()

        const activeObject = canvas.getActiveObject()
        this.scene.state.setActiveObject(activeObject)
      }
    } else {
      const filteredObjects = canvas.getObjects().filter((object) => {
        if (
          object.type === LayerType.FRAME ||
          object.type === LayerType.BACKGROUND ||
          object.type === LayerType.SEPARATOR ||
          object.type === LayerType.PLACEHOLDER
        ) {
          return false
        } else if (!object.evented) {
          return false
        } else if (object.locked) {
          return false
        }
        return true
      })
      if (!filteredObjects.length) {
        return
      }
      if (filteredObjects.length === 1) {
        canvas.setActiveObject(filteredObjects[0])
        canvas.renderAll()
        this.scene.state.setActiveObject(filteredObjects[0])
        return
      }
      const activeSelection = new fabric.ActiveSelection(filteredObjects, {
        canvas: canvas,
      }) as fabric.Object
      canvas.setActiveObject(activeSelection)
      canvas.renderAll()
      this.scene.state.setActiveObject(activeSelection)
    }
  }

  public deselect = () => {
    const canvas = this.scene.canvas

    canvas.discardActiveObject()
    canvas.requestRenderAll()
    this.scene.state.setActiveObject(null)
  }

  /**
   * Group selected objects
   */
  public group = () => {
    const canvas = this.scene.canvas
    const frame = this.scene.frame
    const activeObject = canvas.getActiveObject() as fabric.ActiveSelection
    if (!activeObject) {
      return
    }
    if (activeObject.type !== LayerType.ACTIVE_SELECTION) {
      return
    }

    activeObject.toGroup()
    canvas.requestRenderAll()
    this.scene.history.save()

    const groupedActiveObject = canvas.getActiveObject()
    // @ts-ignore
    groupedActiveObject.set({
      name: "group",
      id: nanoid(),
      // @ts-ignore
      subTargetCheck: true,
      clipPath: this.scene.config.outsideVisible ? null : frame,
    })
    this.updateContextObjects()
  }

  public ungroup = () => {
    const frame = this.scene.frame
    const canvas = this.scene.canvas
    const activeObject = canvas.getActiveObject() as fabric.ActiveSelection
    if (!activeObject) {
      return
    }
    if (activeObject.type !== LayerType.GROUP.toLowerCase()) {
      return
    }

    activeObject.clipPath = null
    const activeSelection = activeObject.toActiveSelection()
    // @ts-ignore
    activeSelection._objects.forEach((object) => {
      object.clipPath = frame
    })
    this.scene.state.setActiveObject(activeSelection)
    canvas.requestRenderAll()
    this.scene.history.save()
    this.updateContextObjects()
  }

  /**
   * Moves an object or a selection up in stack of drawn objects.
   */
  public bringForward = (id?: string) => {
    const canvas = this.scene.canvas
    let refObject = canvas.getActiveObject()
    if (id) {
      refObject = this.findOneById(id)
    }
    if (refObject) {
      canvas.bringForward(refObject)
    }
  }

  /**
   * Moves an object or the objects of a multiple selection to the top of the stack of drawn objects
   */
  public bringToFront = (id?: string) => {
    const canvas = this.scene.canvas

    let refObject = canvas.getActiveObject()
    if (id) {
      refObject = this.findOneById(id)
    }
    if (refObject) {
      canvas.bringToFront(refObject)
    }
  }

  /**
   * Moves an object or a selection down in stack of drawn objects.
   */
  public sendBackwards = (id?: string) => {
    const canvas = this.scene.canvas

    const objects = canvas.getObjects()
    let refObject = canvas.getActiveObject()
    if (id) {
      refObject = this.findOneById(id)
    }

    const index = objects.findIndex((o) => o === refObject)

    const printItemIndex = objects.find((o) => o.type === LayerType.PRINT_ITEM)
    const backgroundImage = objects.find((o) => o.type === LayerType.BACKGROUND_IMAGE)
    const canBeMoved = printItemIndex || backgroundImage ? index > 4 : index > 3

    if (refObject && canBeMoved) {
      canvas.sendBackwards(refObject)
    }
  }

  /**
   * Moves an object to specified level in stack of drawn objects.
   */
  public sendToBack = (id?: string) => {
    const canvas = this.scene.canvas

    let refObject = canvas.getActiveObject()
    const objects = canvas.getObjects()
    const printItemIndex = objects.find((o) => o.type === LayerType.PRINT_ITEM)
    const backgroundImage = objects.find((o) => o.type === LayerType.BACKGROUND_IMAGE)
    if (id) {
      refObject = this.findOneById(id)
    }
    if (refObject) {
      if (printItemIndex || backgroundImage) {
        refObject.moveTo(3)
      } else {
        refObject.moveTo(2)
      }
    }
  }

  public move(direction: Direction, value: number, id?: string) {
    const canvas = this.scene.canvas

    let refObject = canvas.getActiveObject() as Required<fabric.Object>
    if (id) {
      refObject = this.findOneById(id)
    }
    if (refObject) {
      const updatedPosition = refObject[direction] + value
      refObject.set(direction, updatedPosition)
      this.scene.history.save()
    }
  }

  public position(position: Direction, value: number, id?: string) {
    const canvas = this.scene.canvas

    let refObject = canvas.getActiveObject() as Required<fabric.Object>
    if (id) {
      refObject = this.findOneById(id)
    }
    if (refObject) {
      refObject.set(position, value)
      this.scene.history.save()
    }
  }

  public findByName = (name: string) => {
    const canvas = this.scene.canvas

    return canvas.getObjects().filter((o) => o.name === name)
  }

  public removeByName = (name: string) => {
    const canvas = this.scene.canvas

    canvas.getObjects().forEach((o) => {
      if (o.name === name) {
        canvas.remove(o)
        this.scene.history.save()
      }
    })
    canvas.requestRenderAll()
  }

  public findByIdInObjecs = (id: string, objects: fabric.Object[]): any => {
    let item = null

    for (const object of objects) {
      if (object.id === id) {
        item = object
        break
      }
      if (object.type === "group") {
        // @ts-ignore
        const itemInGroup = this.findByIdInObjecs(id, object._objects)
        if (itemInGroup) {
          item = itemInGroup
          break
        }
      }
    }
    return item
  }

  public findById = (id: string) => {
    const canvas = this.scene.canvas

    const objects = canvas.getObjects()
    const object = this.findByIdInObjecs(id, objects)
    return [object]
  }

  public findOneById = (id: string) => {
    const objects = this.findById(id)
    return objects[0]
  }

  public removeById = (id: string) => {
    const canvas = this.scene.canvas
    canvas.getObjects().forEach((o) => {
      if (o.id === id) {
        canvas.remove(o)
        this.scene.history.save()
        this.updateContextObjects()
      }
    })
    canvas.requestRenderAll()
  }

  public updateContextObjects = () => {
    const canvas = this.scene.canvas
    const state = this.scene.state
    const objects = canvas.getObjects()
    const filteredObjects = objects.filter((o) => {
      return o.type !== "Frame" && o.type !== "Background"
    })
    state.setObjects(filteredObjects)
  }
}

export default Objects
