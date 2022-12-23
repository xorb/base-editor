import fabric from "fabric/fabric-impl"
import { Editor } from "../editor/editor"
import { ILayer } from "@layerhub-pro/types"
import type Design from "../design/design"

export type Direction = "top" | "left"
export type Size = "width" | "height"
export type ScaleType = "fit" | "fill"

export interface FabricWheelEvent {
  e: WheelEvent
  target?: Object | undefined
  subTargets?: Object[] | undefined
  button?: number | undefined
  isClick?: boolean | undefined
  pointer?: fabric.IPoint | undefined
  absolutePointer?: fabric.IPoint | undefined
  transform?:
    | {
        corner: string
        original: Object
        originX: string
        originY: string
        width: number
      }
    | undefined
}

export interface Dimension {
  width: number
  height: number
}

export interface CanvasOptions {
  width: number
  height: number
}

export interface FabricCanvasOption {
  wrapperEl: HTMLElement
}

export type FabricCanvas<T extends any = fabric.Canvas> = T & FabricCanvasOption

export interface CanvasJSON {
  id: string
  name: string
  objects: ILayer[]
}
//  Template

export interface Template {
  id: string
  name: string
  preview: string
  background: any
  frame: {
    width: number
    height: number
  }
  objects: any[]
  metadata: {
    animated: boolean
  }
}

export interface GradientOptions {
  angle: number
  colors: string[]
}

export interface ShadowOptions extends fabric.IShadowOptions {
  enabled: boolean
}

export interface IState {
  frame: any
  background: any
  activeObject: any
  activeScene: any
  objects: any[]
  scenes: any[]
  zoomRatio: number
  contextMenuRequest: any
  editor: Editor | null
  design: Design | null
  paramMenuRequest: any
  isFreeDrawing: boolean
  setFrame: (o: any) => void
  setBackground: (o: any) => void
  setActiveObject: (o: any) => void
  setActiveScene: (o: any) => void
  setObjects: (o: any) => void
  setZoomRatio: (o: any) => void
  setContextMenuRequest: (o: any) => void
  setEditor: (o: any) => void
  setDesign: (o: any) => void
  setScenes: (o: any) => void
  setParamMenuRequest: (o: any) => void
  setIsFreeDrawing: (o: boolean) => void
}
