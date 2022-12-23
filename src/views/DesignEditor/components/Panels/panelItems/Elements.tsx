import React from "react"
import { useActiveScene, useEditor } from "@layerhub-pro/react"
import { useStyletron } from "baseui"
import { Block } from "baseui/block"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import Scrollable from "~/components/Scrollable"
import { graphics } from "~/constants/mock-data"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import { Button } from "baseui/button"

export default function () {
  const editor = useEditor()
  const scene = useActiveScene()
  const setIsSidebarOpen = useSetIsSidebarOpen()

  const addObject = React.useCallback(
    (item: any) => {
      if (editor) {
        scene.objects.add({
          ...item,
          metadata: {
            controls: {
              mb: false,
              mr: false,
              mt: false,
            },
          },
        })
      }
    },
    [scene]
  )
  const onDragStart = React.useCallback((ev: React.DragEvent<HTMLDivElement>, item: any) => {
    let img = new Image()
    img.src = item.preview
    // ev.dataTransfer.setDragImage(img, img.width / 2, img.height / 2)
    // editor.dragger.onDragStart(item)
  }, [])

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
        <Block>Elements</Block>

        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>
      <Scrollable>
        <Block>
          <Button onClick={() => editor?.drawer.enable("Line", { stroke: "#000000", strokeWidth: 5, fill: "#000000" })}>
            Line
          </Button>
          <Button onClick={() => editor?.drawer.enable("Oval", { stroke: "#000000", strokeWidth: 5, fill: "#000000" })}>
            Oval
          </Button>
          <Button
            onClick={() => editor?.drawer.enable("Triangle", { stroke: "#000000", strokeWidth: 5, fill: "#000000" })}
          >
            Triangle
          </Button>
          <Button
            onClick={() => editor?.drawer.enable("Polyline", { stroke: "#000000", strokeWidth: 5, fill: "#000000" })}
          >
            Polyline
          </Button>
          <Button
            onClick={() => editor?.drawer.enable("Rectangle", { stroke: "#000000", strokeWidth: 5, fill: "#000000" })}
          >
            Rectangle
          </Button>

          <Button
            onClick={() =>
              editor?.freeDrawer.enable("SpraypaintBrush", {
                color: "#000000",
                opacity: 1,
                size: 21,
              })
            }
          >
            SpraypaintBrush
          </Button>
          <Button
            onClick={() =>
              editor?.freeDrawer.enable("MarkerBrush", {
                color: "#000000",
                opacity: 1,
                size: 21,
              })
            }
          >
            MarkerBrush
          </Button>
          <Button
            onClick={() =>
              editor?.freeDrawer.enable("PencilBrush", {
                color: "#000000",
                opacity: 1,
                size: 21,
              })
            }
          >
            PencilBrush
          </Button>
          <Button
            onClick={() =>
              editor?.freeDrawer.enable("RibbonBrush", {
                color: "#000000",
                opacity: 1,
                size: 21,
              })
            }
          >
            RibbonBrush
          </Button>

          <Button onClick={() => editor?.freeDrawer.disable()}>Disable</Button>
          <Block $style={{ display: "grid", gap: "8px", padding: "1.5rem", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
            {graphics.map((graphic, index) => (
              <ImageItem
                onDragStart={(ev: React.DragEvent<HTMLDivElement>) => onDragStart(ev, graphic)}
                onClick={() => addObject(graphic)}
                key={index}
                preview={graphic.preview}
              />
            ))}
          </Block>
        </Block>
      </Scrollable>
    </Block>
  )
}

function ImageItem({
  preview,
  onClick,
  onDragStart,
}: {
  preview: any
  onDragStart: (ev: React.DragEvent<HTMLDivElement>) => void
  onClick?: (option: any) => void
}) {
  const [css] = useStyletron()
  return (
    <div
      onDragStart={onDragStart}
      onClick={onClick}
      className={css({
        position: "relative",
        background: "#f8f8fb",
        cursor: "pointer",
        borderRadius: "8px",
        overflow: "hidden",
        ":hover": {
          opacity: 1,
          background: "rgb(233,233,233)",
        },
        userSelect: "all",
      })}
    >
      <img
        src={preview}
        className={css({
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
          verticalAlign: "middle",
        })}
      />
    </div>
  )
}
