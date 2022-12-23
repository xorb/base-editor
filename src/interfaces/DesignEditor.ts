import { IFrame, IScene } from "@layerhub-pro/types"

export interface Page {
  id: string
  name: string
  preview: string
}

export type DesignType = "GRAPHIC" | "PRESENTATION" | "VIDEO" | "NONE"

export interface ContextMenuTimelineRequest {
  id: string
  top: number
  left: number
  visible: boolean
}

export interface IDesign {
  id: string
  name: string
  frame: IFrame
  type: string
  scenes: any[]
  previews: { id: string; src: string }[]
  metadata: {}
  published?: boolean
}
export interface IComponent extends IScene {
  published: boolean
}
