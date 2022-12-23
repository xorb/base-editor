import { IConfig } from "@layerhub-pro/types"
import { FabricCanvas } from "../common/interfaces"

export const getFitRatio = (options: any, canvas: FabricCanvas, config: IConfig) => {
  const canvasWidth = canvas.getWidth() - config.margin
  const canvasHeight = canvas.getHeight() - config.margin
  let scaleX = canvasWidth / options.width
  let scaleY = canvasHeight / options.height

  const scaleMin = Math.min(scaleX, scaleY)
  if (scaleMin < 1) {
    if (options.height >= options.width) {
      scaleX = scaleY
    } else {
    }
  } else {
    if (options.height >= options.width) {
      scaleX = scaleY
      if (canvasWidth < options.width) {
        scaleX = scaleX * (canvasWidth / options.width)
      }
    } else {
      if (canvasHeight < options.height) {
        scaleX = scaleX * (canvasHeight / options.height)
      }
    }
  }
  return scaleX
}
