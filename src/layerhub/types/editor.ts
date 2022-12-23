import { Dimension, RotationControlPosition } from "./common"
import { IFrame, IScene } from "./scene"

export interface IConfig {
  id: string
  outsideVisible: boolean
  margin: number
  shortcuts: boolean
  properties: string[]
  frame: IFrame
  canvas: {
    color: string
    size: {
      width: number
      height: number
    }
  }
  background: {
    color: string
    shadow: fabric.IShadowOptions
  }
}

export interface ControlsPosition {
  rotation: RotationControlPosition
}

export interface IDesign {
  id: string
  name: string
  frame: IFrame
  type: string
  scenes: IScene[]
  previews: { id: string; src: string }[]
  metadata: {}
  published?: boolean
}
