import { useEditor, useParamMenuRequest } from "@layerhub-pro/react"
import { Block } from "baseui/block"
import { Button } from "baseui/button"
import { Input, SIZE } from "baseui/input"
import React from "react"
import useOnClickOutside from "~/hooks/useOnClickOutside"

export default function () {
  const [state, setState] = React.useState({
    name: "",
  })
  const paramMenuRequest = useParamMenuRequest()
  const ref = React.useRef<HTMLDivElement>(null)
  const editor = useEditor()

  useOnClickOutside(ref, () => {
    cancelParamMenuRequest()
  })

  React.useEffect(() => {
    if (paramMenuRequest) {
      setState({ name: paramMenuRequest.param.name })
    }
  }, [paramMenuRequest])
  if (!paramMenuRequest) return null

  const updateParam = () => {
    paramMenuRequest.object.updateParam(paramMenuRequest.param.key, state.name)
    cancelParamMenuRequest()
  }
  const cancelParamMenuRequest = () => {
    if (editor) {
      editor.cancelParamMenuRequest()
    }
  }
  return (
    <Block
      ref={ref}
      $style={{
        position: "absolute",
        zIndex: 10,
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.16), 0 1px 3px rgba(0,0,0,0.23)",
        top: `${paramMenuRequest.position.top}px`,
        left: `${paramMenuRequest.position.left}px`,
        width: "360px",
        display: "grid",
        gap: "1rem",
        padding: "2rem 1.5rem",
      }}
    >
      <Block style={{ fontWeight: 600, display: "flex", alignItems: "center", paddingBottom: "0.5rem" }}>
        Update param
      </Block>
      <Block $style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "1rem" }}>
        {/* @ts-ignore */}
        <Block $style={{ fontSize: 14, display: "flex", alignItems: "center" }}>Default value</Block>
        <Block>
          <Input
            disabled={true}
            value={(paramMenuRequest.param.key as string).slice(1, paramMenuRequest.param.key.length - 1)}
            size={SIZE.compact}
          />
        </Block>
      </Block>

      <Block $style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "1rem" }}>
        {/* @ts-ignore */}
        <Block $style={{ fontSize: 14, display: "flex", alignItems: "center" }}>Variable name</Block>
        <Block>
          <Input value={state.name} onChange={(e) => setState({ name: e.target.value })} size={SIZE.compact} />
        </Block>
      </Block>
      <Block $style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <Button onClick={cancelParamMenuRequest} kind="secondary" size="compact">
          Cancel
        </Button>
        <Button onClick={() => updateParam()} size="compact">
          Update
        </Button>
      </Block>
    </Block>
  )
}
