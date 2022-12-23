import React from "react"
import { Block } from "baseui/block"
import ReactPlayer from "react-player"
import { useEditor } from "@layerhub-pro/react"
import Loading from "~/components/Loading"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { IDesign } from "~/interfaces/DesignEditor"

const layerhubRenderer = import.meta.env.VITE_APP_LAYERHUB_RENDERER

function Video({ params }: { params: Record<string, string> }) {
  const editor = useEditor()
  const [loading, setLoading] = React.useState(true)
  const { currentDesign, scenes } = useDesignEditorContext()

  const [state, setState] = React.useState({
    video: "",
  })

  const parseVideoJSON = () => {
    // const currentScene = editor.scene.exportToJSON()
    // const updatedScenes = scenes.map((scn) => {
    //   if (scn.id === currentScene.id) {
    //     return {
    //       id: scn.id,
    //       duration: scn.duration,
    //       layers: currentScene.layers,
    //       name: currentScene.name ? currentScene.name : "",
    //     }
    //   }
    //   return {
    //     id: scn.id,
    //     duration: scn.duration,
    //     layers: scn.layers,
    //     name: scn.name ? scn.name : "",
    //   }
    // })
    // const videoTemplate: IDesign = {
    //   id: currentDesign.id,
    //   type: "VIDEO",
    //   name: currentDesign.name,
    //   frame: currentDesign.frame,
    //   scenes: updatedScenes,
    //   metadata: {},
    //   previews: [],
    // }
    // return videoTemplate
  }

  const makePreview = React.useCallback(async () => {
    const design = parseVideoJSON()
    fetch(`${layerhubRenderer}/render`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(design),
    })
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        setState({ video: res.url })
        setLoading(false)
      })
      .catch((err) => console.error(err))
  }, [editor])

  React.useEffect(() => {
    makePreview()
  }, [editor])

  return (
    <Block $style={{ flex: 1, alignItems: "center", justifyContent: "center", display: "flex", padding: "5rem" }}>
      {loading ? (
        <Loading text="Generating preview" />
      ) : (
        <ReactPlayer
          muted={false}
          className="react-player"
          width={"100%"}
          height={"100%"}
          controls
          autoPlay
          url={state.video}
        />
      )}
    </Block>
  )
}

export default Video
