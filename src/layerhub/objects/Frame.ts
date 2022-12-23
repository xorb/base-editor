import { fabric } from "fabric"
// @ts-ignore
export class FrameObject extends fabric.Rect {
  static type = "Frame"
  public dpi: number
  public unit: string
  initialize(options: FrameOptions) {
    this.dpi = options.dpi || 300
    this.unit = options.unit || "px"
    super.initialize({
      ...options,
      selectable: false,
      hasControls: false,
      lockMovementY: true,
      lockMovementX: true,
      strokeWidth: 0,
      padding: 0,
      evented: false,
      absolutePositioned: true,
      fill: "#ffffff",
    })
    return this
  }

  toObject(propertiesToInclude: string[] = []) {
    return super.toObject([...propertiesToInclude, ...["dpi", "unit"]])
  }
  toJSON(propertiesToInclude: string[] = []) {
    return super.toObject([...propertiesToInclude, ...["dpi", "unit"]])
  }

  static fromObject(options: FrameOptions, callback: Function) {
    return callback && callback(new fabric.Frame(options))
  }
}

fabric.Frame = fabric.util.createClass(FrameObject, {
  type: FrameObject.type,
})
fabric.Frame.fromObject = FrameObject.fromObject

export interface FrameOptions extends fabric.IRectOptions {
  id: string
  name?: string
  description?: string
  dpi?: number
  unit?: string
}

declare module "fabric" {
  namespace fabric {
    class Frame extends FrameObject {
      constructor(options: FrameOptions)
    }
  }
}
