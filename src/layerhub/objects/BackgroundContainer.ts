import { fabric } from "fabric"

// @ts-ignore
export class BackgroundContainerObject extends fabric.Rect {
  static type = "BackgroundContainer"
  initialize(options: BackgroundContainerOptions) {
    super.initialize({
      ...options,
      selectable: false,
      hasControls: false,
      hasBorders: false,
      lockMovementY: true,
      lockMovementX: true,
      strokeWidth: 0,
      evented: true,
      hoverCursor: "default",
      excludeFromExport: true,
      opacity: 1,
    })
    return this
  }

  toObject(propertiesToInclude: string[] = []) {
    return super.toObject(propertiesToInclude)
  }
  toJSON(propertiesToInclude: string[] = []) {
    return super.toObject(propertiesToInclude)
  }

  static fromObject(options: BackgroundContainerOptions, callback: Function) {
    return callback && callback(new fabric.BackgroundContainer(options))
  }
}

fabric.BackgroundContainer = fabric.util.createClass(
  BackgroundContainerObject,
  {
    type: BackgroundContainerObject.type,
  }
)
fabric.BackgroundContainer.fromObject = BackgroundContainerObject.fromObject

export interface BackgroundContainerOptions extends fabric.IRectOptions {
  id: string
  name: string
  description?: string
}

declare module "fabric" {
  namespace fabric {
    class BackgroundContainer extends BackgroundContainerObject {
      constructor(options: BackgroundContainerOptions)
    }
  }
}
