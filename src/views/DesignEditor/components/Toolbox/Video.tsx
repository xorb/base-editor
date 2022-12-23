import React from "react"
import { Block } from "baseui/block"
import { Button, KIND, SIZE } from "baseui/button"
import Common from "./Common"
import Flip from "./Shared/Flip"
import TrimVideo from "./TrimVideo"
import { useActiveObject } from "@layerhub-pro/react"
import Scissor from "~/components/Icons/Scissor"
import { useEditor } from "@layerhub-pro/react"

export default function () {
  const [trim, setTrim] = React.useState(false)
  const [duration, setDuration] = React.useState<string>("10")
  const activeObject = useActiveObject() as any
  const editor = useEditor()

  const loadState = (object: any) => {
    if (object.type === "StaticVideo") {
      const cut = object.cut
      const duration = cut.to - cut.from
      setDuration((duration / 1000).toFixed(2))
    }
  }

  React.useEffect(() => {
    if (activeObject) {
      loadState(activeObject)
    }
  }, [activeObject])

  React.useEffect(() => {
    let watcher = async () => {
      loadState(activeObject)
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
    <>
      {trim ? (
        <TrimVideo setTrim={setTrim} />
      ) : (
        <Block
          $style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            justifyContent: "space-between",
          }}
        >
          <Block $style={{ display: "flex" }}>
            <Flip />
            <Button
              startEnhancer={() => <Scissor size={22} />}
              onClick={() => setTrim(true)}
              size={SIZE.compact}
              kind={KIND.tertiary}
            >
              {duration}s
            </Button>
          </Block>
          <Common />
        </Block>
      )}
    </>
  )
}
