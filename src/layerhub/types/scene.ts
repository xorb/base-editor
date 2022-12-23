import { TimeRange } from "./common"
import { ILayer } from "./layers"

export interface IFrame {
  id?: string
  name?: string
  dpi?: number
  unit?: string
  width: number
  height: number
  type?: string
}

export interface IScene {
  id: string
  frame: IFrame
  name?: string
  description?: string
  layers: Partial<ILayer>[]
  metadata: Record<string, any>
  preview?: string
  duration?: number
  display?: TimeRange
}
