import { IScene } from "@layerhub-pro/types"
import { IDesign } from "~/interfaces/DesignEditor"
import { loadTemplateFonts } from "~/utils/fonts"
import { loadVideoEditorAssets } from "~/utils/video"

const loadGraphicTemplate = async (payload: IDesign) => {
  // const scenes = []
  // const { scenes: scns, ...design } = payload
  // for (const scn of scns) {
  //   const scene: IScene = {
  //     name: scn.name,
  //     frame: payload.frame,
  //     id: scn.id,
  //     layers: scn.layers,
  //     metadata: {},
  //   }
  //   const loadedScene = await loadVideoEditorAssets(scene)
  //   await loadTemplateFonts(loadedScene)
  //   const preview = (await renderer.render(loadedScene)) as string
  //   scenes.push({ ...loadedScene, preview })
  // }
  // return { scenes, design }
}

const loadPresentationTemplate = async (payload: IDesign) => {
  // const scenes = []
  // const { scenes: scns, ...design } = payload
  // for (const scn of scns) {
  //   const scene: IScene = {
  //     name: scn.name,
  //     frame: payload.frame,
  //     id: scn,
  //     layers: scn.layers,
  //     metadata: {},
  //   }
  //   const loadedScene = await loadVideoEditorAssets(scene)
  //   const preview = (await renderer.render(loadedScene)) as string
  //   await loadTemplateFonts(loadedScene)
  //   scenes.push({ ...loadedScene, preview })
  // }
  // return { scenes, design }
}

const loadVideoTemplate = async (payload: IDesign) => {
  // const scenes = []
  // const { scenes: scns, ...design } = payload
  // for (const scn of scns) {
  //   const design: IScene = {
  //     name: "Awesome template",
  //     frame: payload.frame,
  //     id: scn.id,
  //     layers: scn.layers,
  //     metadata: {},
  //     duration: scn.duration,
  //   }
  //   const loadedScene = await loadVideoEditorAssets(design)
  //   const preview = (await renderer.render(loadedScene)) as string
  //   await loadTemplateFonts(loadedScene)
  //   scenes.push({ ...loadedScene, preview })
  // }
  // return { scenes, design }
}

const designLoaders = {
  GRAPHIC: loadGraphicTemplate,
  PRESENTATION: loadPresentationTemplate,
  VIDEO: loadVideoTemplate,
}

export const loadDesign = async (data: IDesign) => {
  const loader = await designLoaders[data.type as "GRAPHIC"]
  return loader(data)
}
