import { fabric } from "fabric"
import { LayerType } from "../common/constants"
import { FabricCanvas } from "../common/interfaces"
import type Design from "../design/design"
import { type Editor } from "./editor"
import Shortcuts from "../utils/shortcuts"

interface CanvasEventsOptions {
  canvas: FabricCanvas
  design: Design
  editor: Editor
}
class CanvasEvents {
  private canvas: FabricCanvas
  private design: Design
  private editor: Editor
  constructor(options: CanvasEventsOptions) {
    this.canvas = options.canvas
    this.design = options.design
    this.editor = options.editor
    this.initialize()
  }

  public initialize = () => {
    this.enableEvents()
  }

  public destroy = () => {
    this.disableEvents()
  }
  public enableEvents() {
    this.canvas.wrapperEl.tabIndex = 1
    this.canvas.wrapperEl.style.outline = "none"

    // @ts-ignore
    this.canvas.on({
      "mouse:dblclick": this.onDoubleClick,
      "mouse:down": this.onMouseDown,
      "mouse:up": this.handleSelection,
      "selection:cleared": this.handleSelection,
      "selection:updated": this.handleSelection,
      "mouse:wheel": this.onMouseWheel,
      "object:modified": this.objectModified,
      "background:selected": this.onBackgroundSelected,
    })

    this.canvas.wrapperEl.addEventListener("keydown", this.onKeyDown.bind(this), false)
  }

  public disableEvents() {
    this.canvas.off({
      "mouse:dblclick": this.onDoubleClick,
      "mouse:down": this.onMouseDown,
      "mouse:up": this.handleSelection,
      "selection:cleared": this.handleSelection,
      "selection:updated": this.handleSelection,
      "mouse:wheel": this.onMouseWheel,
      "object:modified": this.objectModified,
      "background:selected": this.onBackgroundSelected,
    })

    this.canvas.wrapperEl.removeEventListener("keydown", this.onKeyDown.bind(this))
  }

  private onKeyDown(event: KeyboardEvent) {
    const shortcuts = Shortcuts()
    if (shortcuts.isCtrlZero(event)) {
      event.preventDefault()
      const fitRatio = this.design.activeScene.getFitRatio()
      this.editor.zoom.zoomToFit(fitRatio)
    } else if (shortcuts.isCtrlMinus(event)) {
      event.preventDefault()
      this.editor.zoom.zoomIn()
    } else if (shortcuts.isCtrlEqual(event)) {
      event.preventDefault()
      this.editor.zoom.zoomOut()
    } else if (shortcuts.isCtrlOne(event)) {
      event.preventDefault()
      this.editor.zoom.zoomToOne()
    } else if (shortcuts.isCtrlZ(event)) {
      this.editor.design.activeScene.history.undo()
    } else if (shortcuts.isCtrlShiftZ(event)) {
      this.editor.design.activeScene.history.redo()
    } else if (shortcuts.isCtrlY(event)) {
      this.editor.design.activeScene.history.redo()
    } else if (shortcuts.isCtrlA(event)) {
      event.preventDefault()
      this.editor.design.activeScene.objects.select()
    } else if (shortcuts.isDelete(event)) {
      event.preventDefault()
      this.editor.design.activeScene.objects.remove()
    } else if (shortcuts.isCtrlC(event)) {
      event.preventDefault()
      this.editor.design.activeScene.objects.copy()
    } else if (shortcuts.isCtrlV(event)) {
      event.preventDefault()
      this.editor.design.activeScene.objects.paste()
    } else if (shortcuts.isCtrlX(event)) {
      event.preventDefault()
      this.editor.design.activeScene.objects.cut()
    }
  }

  private onDoubleClick = (event: fabric.IEvent<any>) => {
    const subTarget = event.subTargets![0]
    if (subTarget) {
      this.design.activeScene.objects.select(subTarget.id)
    }
  }

  private objectModified = (event: fabric.IEvent) => {
    const { target } = event
    if (target instanceof fabric.Textbox) {
      this.scaleTextbox(target)
    }
    // this.editor.history.save();
    this.editor.design.activeScene.history.save()
    // MOVE ALL SEPARATORS TO TOP
    // const objects = this.canvas.getObjects();
    // objects.forEach((o) => {
    //   if (o.type === LayerType.SEPARATOR) {
    //     o.bringToFront();
    //   }
    // });
  }

  private scaleTextbox = (target: fabric.Textbox) => {
    const { fontSize, width, scaleX } = target
    target.set({
      fontSize: fontSize! * scaleX!,
      width: width! * scaleX!,
      scaleX: 1,
      scaleY: 1,
    })
  }

  onBackgroundSelected = () => {
    const objects = this.canvas.getObjects()
    const frame = objects[0]
    this.canvas.setActiveObject(objects[0])
    this.editor.state.setActiveObject(frame)
  }

  private onMouseDown = (e: fabric.IEvent<any>) => {
    // this.editor.objects.pasteStyle();
    if (e.button === 3) {
      this.editor.state.setContextMenuRequest({
        left: e.e.offsetX,
        top: e.e.offsetY,
        target: e.target,
      })
    } else {
      this.editor.state.setContextMenuRequest(null)
    }
  }

  private handleSelection = (target: fabric.IEvent) => {
    const state = this.editor.state
    if (target) {
      state.setActiveObject(null)
      const initialSelection = this.canvas.getActiveObject() as any
      const isNotMultipleSelection =
        (initialSelection && initialSelection.type === LayerType.GROUP.toLowerCase()) ||
        (initialSelection && initialSelection.type === LayerType.STATIC_VECTOR)
      // Handle multiple selection
      if (initialSelection && !isNotMultipleSelection && initialSelection._objects) {
        const filteredObjects = (initialSelection._objects as fabric.Object[]).filter((object) => {
          if (
            object.type === LayerType.BACKGROUND ||
            object.type === LayerType.SEPARATOR ||
            object.type === LayerType.PLACEHOLDER
          ) {
            return false
          }
          return !object.locked
        })
        this.canvas.discardActiveObject()
        if (filteredObjects.length > 0) {
          if (filteredObjects.length === 1) {
            this.canvas.setActiveObject(filteredObjects[0])
            state.setActiveObject(filteredObjects[0])
          } else {
            const activeSelection = new fabric.ActiveSelection(filteredObjects, {
              canvas: this.canvas,
            }) as fabric.Object
            this.canvas.setActiveObject(activeSelection)
            state.setActiveObject(activeSelection)
          }
        }
      } else {
        if (initialSelection) {
          if (initialSelection.clipPath && initialSelection.clipPath.type === LayerType.PLACEHOLDER) {
            initialSelection.set({ hasBorders: false, hasControls: false })
          }
        }
        state.setActiveObject(initialSelection)
      }
    } else {
      state.setActiveObject(null)
    }
    this.canvas.requestRenderAll()
  }

  private onMouseWheel = (event: fabric.IEvent<any>) => {
    const isCtrlKey = event.e.ctrlKey
    if (isCtrlKey) {
      this.handleZoom(event)
    }
  }

  private handleZoom = (event: fabric.IEvent<any>) => {
    const delta = event.e.deltaY
    let zoomRatio = this.canvas.getZoom()
    if (delta > 0) {
      zoomRatio -= 0.02
    } else {
      zoomRatio += 0.02
    }
    this.editor.zoom.zoomToPoint(new fabric.Point(this.canvas.getWidth() / 2, this.canvas.getHeight() / 2), zoomRatio)
    event.e.preventDefault()
    event.e.stopPropagation()
  }
}

export default CanvasEvents
