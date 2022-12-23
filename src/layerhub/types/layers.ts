import { TimeRange } from "./common"

export type ILayerType =
  | "StaticVector"
  | "StaticGroup"
  | "DynamicGroup"
  | "StaticPath"
  | "DynamicPath"
  | "StaticImage"
  | "StaticVideo"
  | "StaticAudio"
  | "DynamicImage"
  | "StaticText"
  | "DynamicText"
  | "Background"
  | "Frame"
  | "Group"
  | "Separator"
  | "activeSelection"

export enum LayerType {
  STATIC_VECTOR = "StaticVector",
  STATIC_GROUP = "StaticGroup",
  DYNAMIC_GROUP = "DynamicGroup",
  STATIC_PATH = "StaticPath",
  DYNAMIC_PATH = "DynamicPath",
  STATIC_IMAGE = "StaticImage",
  STATIC_VIDEO = "StaticVideo",
  STATIC_AUDIO = "StaticAudio",
  DYNAMIC_IMAGE = "DynamicImage",
  STATIC_TEXT = "StaticText",
  DYNAMIC_TEXT = "DynamicText",
  BACKGROUND = "Background",
  FRAME = "Frame",
  GROUP = "Group",
  ACTIVE_SELECTION = "activeSelection",
  SEPARATOR = "Separator",
  PLACEHOLDER = "Placeholder",
}

export interface IKeyValue {
  key: string
  value: string
}

export interface IShadow {
  blur: number
  color: string
  offsetX: number
  offsetY: number
  affectStroke?: boolean
  nonScaling?: boolean
}

interface LayerBaseOptions {
  id: string
  name?: string
  type: ILayerType | string
  top?: number
  left?: number
  angle?: number
  width?: number
  height?: number
  originX?: string
  originY?: string
  scaleX?: number
  scaleY?: number
  opacity?: number
  flipX?: boolean
  flipY?: boolean
  skewX?: number
  skewY?: number
  stroke?: string
  rx?: number
  ry?: number
  strokeWidth?: number
  visible?: boolean
  shadow?: IShadow
  metadata?: Record<string, string | number | boolean>
  animation?: Animation
  clipPath?: ILayer | null
  strokeDashArray?: number[] | undefined
  strokeLineCap?: string | undefined
  strokeLineJoin?: string | undefined
  strokeUniform?: boolean
  strokeMiterLimit?: number | undefined
  strokeDashOffset?: number
  clipToFrame?: boolean
  preview?: string
  duration?: number
  display?: TimeRange
  cut?: TimeRange
}

interface Animation {
  type: string
}

export interface IStaticText extends LayerBaseOptions {
  fontURL?: string
  textAlign?: string
  fontFamily?: string
  fontSize?: number
  charSpacing?: number
  lineHeight?: number
  underline?: boolean
  text: string
  fill?: string
}

export interface IDynamicText extends IStaticText {
  keyValues: IKeyValue[]
}

export interface IStaticImage extends LayerBaseOptions {
  src: string
  cropX: number
  cropY: number
}
export interface IBackgroundImage extends IStaticImage {}

export interface IDynamicImage extends LayerBaseOptions {
  key: string
}

export interface IGroup extends LayerBaseOptions {
  objects: ILayer[]
}

export interface IStaticPath extends LayerBaseOptions {
  path: number[][]
  fill: string
}

export interface IStaticVector extends LayerBaseOptions {
  src: string
  colorMap: Record<string, string>
}

export interface IStaticVideo extends LayerBaseOptions {
  src: string
  speedFactor: number
}

export interface IStaticAudio extends LayerBaseOptions {
  src: string
  speedFactor: number
}

export interface IBackground extends LayerBaseOptions {
  fill: string
}
export interface ISeparator extends LayerBaseOptions {
  fill: string
  kind: "VERTICAL" | "HORIZONTAL"
}

export interface IPlaceholder extends LayerBaseOptions {
  fill: string
}

export type ILayer =
  | IStaticText
  | IDynamicText
  | IStaticImage
  | IDynamicImage
  | IStaticPath
  | IBackground
  | IStaticAudio
  | IStaticVideo
  | IStaticVector
  | ISeparator
  | IGroup
  | IPlaceholder
  | IBackgroundImage

export type ILayerOptions = IStaticText &
  IDynamicText &
  IStaticImage &
  IDynamicImage &
  IStaticPath &
  IBackground &
  IStaticAudio &
  IStaticVideo &
  IStaticVector &
  IGroup &
  IBackgroundImage
