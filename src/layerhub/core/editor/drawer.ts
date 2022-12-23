import { fabric } from "fabric"
import { IState } from "../common/interfaces"
import { type Editor } from "./editor"

const enum DrawingMode {
  Line,
  Rectangle,
  Oval,
  Triangle,
  Polyline,
  Path,
}
type DrawingModeString = "Oval" | "Line" | "Rectangle" | "Triangle" | "Polyline"
interface IObjectDrawer {
  drawingMode: DrawingMode
  readonly make: (
    x: number,
    y: number,
    options: fabric.IObjectOptions,
    x2?: number,
    y2?: number
  ) => Promise<fabric.Object>
  readonly resize: (
    object: fabric.Object | fabric.Ellipse,
    x: number,
    y: number
  ) => Promise<fabric.Object | fabric.Ellipse>
}

class LineDrawer implements IObjectDrawer {
  drawingMode: DrawingMode = DrawingMode.Line
  make(x: number, y: number, options: fabric.IObjectOptions, x2?: number, y2?: number): Promise<fabric.Object> {
    return new Promise<fabric.Object>((resolve) => {
      resolve(new fabric.Line([x, y, x2!, y2!], options))
    })
  }
  resize(object: fabric.Object, x: number, y: number): Promise<fabric.Object> {
    ;(object as fabric.Line)
      .set({
        x2: x,
        y2: y,
      })
      .setCoords()
    return new Promise<fabric.Object>((resolve) => {
      resolve(object)
    })
  }
}

class RectangleDrawer implements IObjectDrawer {
  private startPoint: { x: number; y: number } = { x: 0, y: 0 }
  drawingMode: DrawingMode = DrawingMode.Rectangle
  make(x: number, y: number, options: fabric.IObjectOptions, width?: number, height?: number): Promise<fabric.Object> {
    this.startPoint.x = x
    this.startPoint.y = y
    return new Promise<fabric.Object>((resolve) => {
      resolve(
        new fabric.Rect({
          left: x,
          top: y,
          width: width,
          height: height,
          fill: "transparent",
          ...options,
        })
      )
    })
  }
  resize(object: fabric.Object, x: number, y: number): Promise<fabric.Object> {
    object
      .set({
        originX: this.startPoint.x > x ? "right" : "left",
        originY: this.startPoint.y > y ? "bottom" : "top",
        width: Math.abs(this.startPoint.x - x),
        height: Math.abs(this.startPoint.y - y),
      })
      .setCoords()

    return new Promise<fabric.Object>((resolve) => {
      resolve(object)
    })
  }
}

class OvalDrawer implements IObjectDrawer {
  private startPoint: { x: number; y: number } = { x: 0, y: 0 }
  drawingMode: DrawingMode = DrawingMode.Oval

  make(x: number, y: number, options: fabric.IObjectOptions, rx?: number, ry?: number): Promise<fabric.Object> {
    this.startPoint.x = x
    this.startPoint.y = y

    return new Promise<fabric.Object>((resolve) => {
      resolve(
        new fabric.Ellipse({
          left: x,
          top: y,
          rx: rx,
          ry: ry,
          fill: "transparent",
          ...options,
        })
      )
    })
  }
  resize(object: fabric.Object, x: number, y: number): Promise<fabric.Object> {
    ;(object as fabric.Ellipse)
      .set({
        originX: this.startPoint.x > x ? "right" : "left",
        originY: this.startPoint.y > y ? "bottom" : "top",
        rx: Math.abs(x - object.left!) / 2,
        ry: Math.abs(y - object.top!) / 2,
      })
      .setCoords()

    return new Promise<fabric.Object>((resolve) => {
      resolve(object)
    })
  }
}

class TriangleDrawer implements IObjectDrawer {
  private startPoint: { x: number; y: number } = { x: 0, y: 0 }

  drawingMode: DrawingMode = DrawingMode.Triangle

  make(x: number, y: number, options: fabric.IObjectOptions, width?: number, height?: number): Promise<fabric.Object> {
    this.startPoint.x = x
    this.startPoint.y = y

    return new Promise<fabric.Object>((resolve) => {
      resolve(
        new fabric.Triangle({
          left: x,
          top: y,
          width: width,
          height: height,
          fill: "transparent",
          ...options,
        })
      )
    })
  }

  resize(object: fabric.Triangle, x: number, y: number): Promise<fabric.Object> {
    object
      .set({
        originX: this.startPoint.x > x ? "right" : "left",
        originY: this.startPoint.y > y ? "bottom" : "top",
        width: Math.abs(this.startPoint.x - x),
        height: Math.abs(this.startPoint.y - y),
      })
      .setCoords()

    return new Promise<fabric.Object>((resolve) => {
      resolve(object)
    })
  }
}

class PolylineDrawer implements IObjectDrawer {
  drawingMode: DrawingMode = DrawingMode.Polyline

  make(x: number, y: number, options: fabric.IObjectOptions, rx?: number, ry?: number): Promise<fabric.Object> {
    return new Promise<fabric.Object>((resolve) => {
      resolve(new fabric.Polyline([{ x, y }], { ...options, fill: "transparent" }))
    })
  }

  resize(object: fabric.Object, x: number, y: number): Promise<fabric.Object> {
    //Create and push a new Point for the Polyline
    ;(object as fabric.Polyline).points!.push(new fabric.Point(x, y))
    const dim = (object as fabric.Polyline)._calcDimensions()

    ;(object as fabric.Polyline)
      .set({
        left: dim.left,
        top: dim.top,
        width: dim.width,
        height: dim.height,
        dirty: true,
        pathOffset: new fabric.Point(dim.left + dim.width / 2, dim.top + dim.height / 2),
      })
      .setCoords()

    return new Promise<fabric.Object>((resolve) => {
      resolve(object)
    })
  }
}

class Drawer {
  private drawer: IObjectDrawer
  private readonly drawers: IObjectDrawer[]
  private object?: fabric.Object
  private drawerOptions: fabric.IObjectOptions
  constructor(public canvas: fabric.Canvas, public editor: Editor) {
    this.drawers = [
      new LineDrawer(),
      new RectangleDrawer(),
      new OvalDrawer(),
      new TriangleDrawer(),
      new PolylineDrawer(),
    ]
    this.drawer = this.drawers[DrawingMode.Polyline]

    this.drawerOptions = {
      stroke: "black",
      strokeWidth: 1,
      selectable: true,
      strokeUniform: true,
    }
    // @ts-ignore
    this.canvas.isDrawingObject = false
  }

  private onMouseDown = async (o: fabric.IEvent<MouseEvent>): Promise<any> => {
    // @ts-ignore
    this.canvas.isDrawingObject = true
    this.canvas.selection = false
    var pointer = this.canvas.getPointer(o.e)
    this.object = await this.make(pointer.x, pointer.y)
    this.canvas.add(this.object)
    this.canvas.renderAll()
  }

  private onMouseMove = (o: fabric.IEvent<MouseEvent>) => {
    const canvas = this.canvas

    // @ts-ignore
    if (!canvas.isDrawingObject) return
    var pointer = canvas.getPointer(o.e)

    this.drawer.resize(this.object!, pointer.x, pointer.y)
    this.canvas.renderAll()
  }

  public onMouseUp = (o: fabric.IEvent<MouseEvent>) => {
    const canvas = this.canvas
    // @ts-ignore
    canvas.isDrawingObject = false
    canvas.setActiveObject(this.object!)
    this.editor.state.setActiveObject(this.object!)
    this.editor.design.activeScene.history.save()
    canvas.requestRenderAll()
    this.disable()
  }

  public disable() {
    // @ts-ignore
    this.canvas.off("mouse:down", this.onMouseDown)
    // @ts-ignore
    this.canvas.off("mouse:move", this.onMouseMove)
    // @ts-ignore
    this.canvas.off("mouse:up", this.onMouseUp)
    this.canvas.selection = true
  }

  public enable(mode: DrawingModeString, options: fabric.IObjectOptions) {
    this.drawerOptions = Object.assign({}, this.drawerOptions, options)
    this.setDrawingMode(mode)
    this.canvas.selection = false
    this.canvas.on("mouse:down", this.onMouseDown)
    this.canvas.on("mouse:move", this.onMouseMove)
    this.canvas.on("mouse:up", this.onMouseUp)
    // this.canvas.hoverCursor = "crosshair"
    // this.canvas.defaultCursor = "crosshair"
  }

  public setDrawingMode(mode: DrawingModeString) {
    switch (mode) {
      case "Oval":
        this.drawer = this.drawers[DrawingMode.Oval]
        break
      case "Line":
        this.drawer = this.drawers[DrawingMode.Line]
        break
      case "Rectangle":
        this.drawer = this.drawers[DrawingMode.Rectangle]
        break
      case "Triangle":
        this.drawer = this.drawers[DrawingMode.Triangle]
        break
      case "Polyline":
        this.drawer = this.drawers[DrawingMode.Polyline]
        break
      default:
        this.drawer = this.drawers[DrawingMode.Oval]
    }
  }

  private async make(x: number, y: number): Promise<fabric.Object> {
    return await this.drawer.make(x, y, this.drawerOptions)
  }
}

export default Drawer
