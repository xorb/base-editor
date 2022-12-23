import { ILayer, IScene } from "@layerhub-pro/types"
import { IDesign } from "~/interfaces/DesignEditor"

export const getTokens = (data: IDesign) => {
  const tokens = getDesignTokens(data)
  return tokens
}

const getDesignTokens = (data: IDesign) => {
  let tokens: any[] = []
  data.scenes.forEach((scene) => {
    const sceneToken = getSceneTokens(scene)
    if (sceneToken) {
      tokens = tokens.concat(sceneToken)
    }
  })
  return tokens
}

const getSceneTokens = (scene: IScene) => {
  let tokens: any[] = []
  scene.layers.forEach((layer) => {
    // @ts-ignore
    const layerToken = getTokenFromLayer(layer)
    if (layerToken) {
      tokens = tokens.concat(layerToken)
    }
  })
  return tokens
}

const getTokenFromLayer = (layer: ILayer) => {
  if (layer.type === "Group") {
    return getTokenFromGroup(layer)
  } else {
    return layer.params
  }
}

const getTokenFromGroup = (layer: ILayer) => {
  let tokens: any[] = []
  // @ts-ignore
  layer.objects.forEach((object) => {
    let layerToken = getTokenFromLayer(object)
    if (layerToken) {
      tokens = tokens.concat(layerToken)
    }
  })
  return tokens
}
