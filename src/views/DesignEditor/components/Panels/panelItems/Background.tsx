import React from "react"
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import { HexColorPicker } from "react-colorful"
import { Delete } from "baseui/icon"
import { throttle } from "lodash"
import { useActiveObject, useActiveScene, useEditor } from "@layerhub-pro/react"
import useAppContext from "~/hooks/useAppContext"

const PRESET_COLORS = [
  "#f44336",
  "#ff9800",
  "#ffee58",
  "#66bb6a",
  "#26a69a",
  "#03a9f4",
  "#3f51b5",
  "#673ab7",
  "#9c27b0",
  "#ec407a",
  "#8d6e63",
  "#d9d9d9",
]

export default function () {
  const scene = useActiveScene()
  const { setActiveSubMenu } = useAppContext()

  const setBackgroundColor = throttle((color: string) => {
    if (scene) {
      scene.updateBackground({
        fill: color,
      })
    }
  }, 100)

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Block
        $style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          justifyContent: "space-between",
          padding: "1.5rem",
        }}
      >
        <Block>Background</Block>

        <Block onClick={() => setActiveSubMenu("")} $style={{ cursor: "pointer", display: "flex" }}>
          <Delete size={24} />
        </Block>
      </Block>
      <Scrollable>
        <Block padding={"0 1.5rem"}>
          <HexColorPicker onChange={setBackgroundColor} style={{ width: "100%" }} />
          <Block>
            <Block $style={{ padding: "0.75rem 0", fontWeight: 500, fontSize: "14px" }}>Preset colors</Block>
            <Block $style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr", gap: "0.25rem" }}>
              {PRESET_COLORS.map((color, index) => (
                <Block
                  $style={{
                    cursor: "pointer",
                  }}
                  onClick={() => setBackgroundColor(color)}
                  backgroundColor={color}
                  height={"38px"}
                  key={index}
                ></Block>
              ))}
            </Block>
          </Block>
        </Block>
        <Block padding={"1.5rem"}>Background images</Block>
      </Scrollable>
    </Block>
  )
}
