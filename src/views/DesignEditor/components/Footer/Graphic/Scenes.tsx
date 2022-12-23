import React from "react"
import { useStyletron } from "baseui"
import Add from "~/components/Icons/Add"
import useDesignEditorPages from "~/hooks/useDesignEditorScenes"
import { DesignEditorContext } from "~/contexts/DesignEditor"
import { nanoid } from "nanoid"
import { getDefaultTemplate } from "~/constants/design-editor"
import { useActiveScene, useEditor, useScenes } from "@layerhub-pro/react"
import { IScene } from "@layerhub-pro/types"
import SceneItem from "./SceneItem"
import { Block } from "baseui/block"
import useContextMenuTimelineRequest from "~/hooks/useContextMenuTimelineRequest"
import SceneContextMenu from "./SceneContextMenu"
import useEditorType from "~/hooks/useEditorType"
import Scrollable from "~/components/Scrollable"

export default function () {
  const scenes = useScenes()
  const activeScene = useActiveScene()
  // const scenes = useDesignEditorPages()
  const { setScenes, setCurrentScene, currentScene, setCurrentDesign, currentDesign } =
    React.useContext(DesignEditorContext)
  const editor = useEditor()
  const [css] = useStyletron()
  const [currentPreview, setCurrentPreview] = React.useState("")
  const contextMenuTimelineRequest = useContextMenuTimelineRequest()
  const editorType = useEditorType()

  React.useEffect(() => {
    // if (editor && scenes && currentScene) {
    //   const isCurrentSceneLoaded = scenes.find((s) => s.id === currentScene?.id)
    //   if (!isCurrentSceneLoaded) {
    //     setCurrentScene(scenes[0])
    //   }
    // }
  }, [editor, currentScene, editorType])

  React.useEffect(() => {
    let watcher = async () => {
      // const updatedTemplate = editor.scene.exportToJSON()
      // const updatedPreview = (await renderer.render(updatedTemplate, {})) as string
      // setCurrentPreview(updatedPreview)
    }
    if (editor) {
      editor.on("history:changed", watcher)
    }
    return () => {
      if (editor) {
        editor.off("history:changed", watcher)
      }
    }
  }, [editor])

  React.useEffect(() => {
    if (editor) {
      if (currentScene) {
        // updateCurrentScene(currentScene)
      } else {
        // const defaultTemplate = getDefaultTemplate({
        //   width: 1200,
        //   height: 1200,
        // })
        // setCurrentDesign({
        //   id: nanoid(),
        //   frame: defaultTemplate.frame,
        //   metadata: {},
        //   name: "Untitled Design",
        //   previews: [],
        //   scenes: [],
        //   type: "PRESENTATION",
        // })
        // editor.scene
        //   .importFromJSON(defaultTemplate)
        //   .then(() => {
        //     const initialDesign = editor.scene.exportToJSON() as any
        //     renderer.render(initialDesign, {}).then((data) => {
        //       setCurrentScene({ ...initialDesign, preview: data })
        //       setScenes([{ ...initialDesign, preview: data }])
        //     })
        //   })
        //   .catch(console.log)
      }
    }
  }, [editor, currentScene, editorType])

  const addScene = React.useCallback(() => {
    if (editor) {
      editor.design.addScene()
    }
  }, [editor])

  const setActiveScene = React.useCallback(
    (id: string) => {
      if (editor) {
        console.log({ id })
        editor.design.setActiveScene(id)
      }
    },
    [editor]
  )

  return (
    <Block $style={{ flex: 1, display: "flex", height: "130px" }}>
      <Scrollable>
        <Block $style={{ padding: "0.25rem 0.75rem", background: "#ffffff" }}>
          <div className={css({ display: "flex", alignItems: "center" })}>
            {contextMenuTimelineRequest.visible && <SceneContextMenu />}
            {scenes.map((scene, index) => {
              return (
                <SceneItem
                  key={index}
                  isCurrentScene={activeScene && activeScene.id === scene.id}
                  scene={scene}
                  index={index}
                  setActiveScene={setActiveScene}
                  preview={scene.preview}
                />
              )
            })}
            <div
              style={{
                background: "#ffffff",
                padding: "1rem 1rem 1rem 0.5rem",
              }}
            >
              <div
                onClick={addScene}
                className={css({
                  width: "100px",
                  height: "56px",
                  background: "rgb(243,244,246)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                })}
              >
                <Add size={20} />
              </div>
            </div>
          </div>
        </Block>
      </Scrollable>
    </Block>
  )
}
