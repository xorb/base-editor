import React from "react"
import { Block } from "baseui/block"
import { useActiveScene, useEditor, useScenes, useZoomRatio, Renderer } from "@layerhub-pro/react"
import { useTimer } from "@layerhub-io/use-timer"
import Controller from "./Controler"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"

const Playback = () => {
  const editor = useEditor()
  const controller = React.useRef<Controller>()
  const activeScene = useActiveScene()
  const scenes = useScenes()
  const frameBoundingRect = activeScene.frame.getBoundingRect()
  const [initialized, setInitialized] = React.useState(false)
  const zoomRatio = useZoomRatio() as number
  const { start } = useTimer()
  // const scenes = useDesignEditorScenes()
  const { time } = useTimer()

  const loadFrames = React.useCallback(async () => {
    const renderer = new Renderer()
    const templates = scenes.map((scene) => scene.toJSON())
    // const currentTemplate = editor.scene.exportToJSON()
    let refTime = 0
    // const templates = scenes.map((page) => {
    //   const currentTemplate = editor.scene.exportToJSON()
    //   if (page.id === currentTemplate.id) {
    //     return { ...currentTemplate, duration: page.duration }
    //   }
    //   return page
    // })

    let clips = []
    for (const template of templates) {
      const layers = await renderer.exportLayers(template)
      const timedLayers = layers.map((layer) => {
        return {
          ...layer,
          display: {
            from: refTime,
            to: refTime + template.duration!,
          },
        }
      })
      clips.push({
        duration: template.duration!,
        layers: timedLayers,
      })

      refTime += template.duration!
    }

    const videoTemplate = {
      name: activeScene.name,
      frame: activeScene.frame,
      clips: clips,
    }

    controller.current = new Controller("scenify_playback_container", {
      template: videoTemplate,
      zoomRatio,
    })
    let interval: any
    interval = setInterval(() => {
      if (controller.current?.initialized) {
        clearInterval(interval)
        setInitialized(true)
      }
    }, 150)
  }, [editor, scenes])

  React.useEffect(() => {
    if (initialized && time && controller.current) {
      controller.current.render(time)
    }
  }, [time, initialized, controller])

  React.useEffect(() => {
    if (editor) {
      loadFrames()
    }
  }, [editor])

  React.useEffect(() => {
    if (controller.current && initialized) {
      controller.current!.play(time)
      start()
    }
  }, [initialized, controller])

  return (
    <Block
      $style={{
        display: "flex",
        flex: 1,
        background: "#f1f2f6",
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 4,
      }}
    >
      <Block $style={{ height: "100%", width: "100%", position: "relative" }}>
        <Block
          id="scenify_playback_container"
          $style={{
            flex: 1,
            position: "absolute",
            top: `${frameBoundingRect.top}px`,
            left: `${frameBoundingRect.left}px`,
            zIndex: 1000,
            height: `${frameBoundingRect.height}px`,
            width: `${frameBoundingRect.width}px`,
          }}
        ></Block>
      </Block>
    </Block>
  )
}

export default Playback
