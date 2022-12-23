import React from "react"
import { Block } from "baseui/block"
import useAppContext from "~/hooks/useAppContext"
import { useActiveObject, useEditor } from "@layerhub-pro/react"

export default function () {
  const [state, setState] = React.useState({ fill: "#000000" })
  const { setActiveSubMenu } = useAppContext()
  const editor = useEditor()
  // const background = useBackground()
  const activeObject = useActiveObject() as any

  React.useEffect(() => {
    if (activeObject && activeObject.type === "Frame") {
      // setState({ fill: background.fill })
    }
  }, [activeObject])

  React.useEffect(() => {
    let watcher = async () => {
      if (activeObject && activeObject.type === "Frame") {
        // setState({ fill: background.fill })
      }
    }
    if (editor) {
      editor.on("history:changed", watcher)
    }
    return () => {
      if (editor) {
        editor.off("history:changed", watcher)
      }
    }
  }, [editor, activeObject])

  return (
    <Block
      $style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        justifyContent: "space-between",
      }}
    >
      <Block
        $style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Block onClick={() => setActiveSubMenu("Background")}>
          <Block
            $style={{
              height: "24px",
              width: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: state.fill,
              border: "1px solid #dedede",
            }}
          ></Block>
        </Block>
      </Block>
    </Block>
  )
}
