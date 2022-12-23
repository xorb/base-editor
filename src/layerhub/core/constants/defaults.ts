import { nanoid } from "nanoid"
import { IBackground, IDesign, IFrame, IScene } from "@layerhub-pro/types"
import { PROPERTIES_TO_INCLUDE } from "../common/constants"
import { IConfig } from "@layerhub-pro/types"

const frame: IFrame = {
  dpi: 300,
  width: 1920,
  height: 1080,
  name: "Custom",
  unit: "PIXELS",
  type: "Frame",
}

const background: IBackground = {
  width: 1920,
  height: 1080,
  name: "Custom",
  fill: "#ffffff",
  type: "Background",
  id: nanoid(),
}

const scene: IScene = {
  id: nanoid(),
  name: "Scene 1",
  frame,
  layers: [background],
  metadata: {},
}

const design: IDesign = {
  id: nanoid(),
  name: "Scene 1",
  frame,
  scenes: [scene],
  metadata: {},
  previews: [],
  type: "GRAPHIC",
}

export const defaultObjects = {
  FRAME: frame,
  BACKGROUND: background,
  SCENE: scene,
  DESIGN: design,
}

export const defaultConfig: IConfig = {
  id: nanoid(),
  outsideVisible: false,
  margin: 120,
  shortcuts: false,
  properties: PROPERTIES_TO_INCLUDE,
  frame: frame,
  background: {
    color: "#ffffff",
    shadow: {
      blur: 10,
      color: "#C7C7C7",
      offsetX: 0,
      offsetY: 0,
    },
  },
  canvas: {
    color: "#ecf0f1",
    size: {
      width: 1200,
      height: 1200,
    },
  },
}

export const defaultObjectOptions = {
  angle: 0,
  originX: "left",
  originY: "top",
  scaleX: 1,
  scaleY: 1,
  fill: "transparent",
  opacity: 1,
  flipX: false,
  flipY: false,
  skewX: 0,
  skewY: 0,
  stroke: null,
  strokeWidth: 0,
  strokeDashArray: null,
  strokeLineCap: "butt",
  strokeLineJoin: "miter",
  strokeUniform: false,
  strokeMiterLimit: 4,
  strokeDashOffset: 0,
  metadata: {},
}
