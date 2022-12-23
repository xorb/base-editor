import React from "react"
import { Modal, ModalBody, SIZE, ROLE } from "baseui/modal"
import { Block } from "baseui/block"
import Video from "./Video"
import Presentation from "./Presentation"
import Graphic from "./Graphic"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { useEditor } from "@layerhub-pro/react"
import { getTokens } from "../../utils/get-tokens"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import Preparing from "./Preparing"
import FillProps from "./FillProps"

export type PreviewStep = "PREPARING" | "FILL_PROPS" | "GRAPHIC" | "VIDEO" | "PRESENTATION"
interface ComponentProps {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}
export default function ({ isOpen, setIsOpen }: ComponentProps) {
  const [params, setParams] = React.useState<Record<string, string>>({})
  const [previewStep, setPreviewStep] = React.useState<PreviewStep>("PREPARING")
  // const { currentDesign } = useDesignEditorContext()
  const scenes = useDesignEditorScenes()
  const editor = useEditor()

  const updateParams = (key: string, value: string) => {
    setParams({
      ...params,
      [key]: value,
    })
  }

  React.useEffect(() => {
    if (scenes && editor) {
      applyParams()
      // const currentScene = editor.scene.exportToJSON()
      // const updatedScenes = scenes.map((scene) => {
      //   if (scene.id === currentScene.id) {
      //     return currentScene
      //   }
      //   return scene
      // })
      // const tokens = getTokens({ ...currentDesign, scenes: updatedScenes })

      // if (tokens.length) {
      //   let params: Record<string, string> = {}
      //   tokens.forEach((token) => {
      //     params[token.name] = ""
      //   })
      //   setParams(params)
      //   setPreviewStep("FILL_PROPS")
      // } else {
      //   applyParams()
      // }
    }
  }, [editor, scenes])

  const applyParams = () => {
    // setPreviewStep(currentDesign.type as "GRAPHIC")
    setPreviewStep("GRAPHIC")
  }

  return (
    <Modal
      onClose={() => setIsOpen(false)}
      closeable
      isOpen={isOpen}
      animate
      autoFocus
      size={SIZE.full}
      role={ROLE.dialog}
      overrides={{
        Root: {
          style: {
            zIndex: 5,
          },
        },
        Dialog: {
          style: {
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        },
      }}
    >
      <ModalBody
        $style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 0,
          marginLeft: 0,
          marginRight: 0,
          marginBottom: 0,
          height: "100%",
          position: "relative",
        }}
      >
        <Block
          $style={{
            position: "absolute",
            flex: 1,
            height: "100%",
            width: "100%",
            display: "flex",
          }}
        >
          {
            {
              GRAPHIC: <Graphic params={params} />,
              PRESENTATION: <Presentation params={params} />,
              VIDEO: <Video params={params} />,
              PREPARING: <Preparing />,
              FILL_PROPS: <FillProps applyParams={applyParams} updateParams={updateParams} params={params} />,
              NONE: <></>,
            }[previewStep]
          }
        </Block>
      </ModalBody>
    </Modal>
  )
}
