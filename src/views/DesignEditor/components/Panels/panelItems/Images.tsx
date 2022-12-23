import React from "react"
import { useStyletron } from "baseui"
import { Block } from "baseui/block"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import Scrollable from "~/components/Scrollable"
import { images } from "~/constants/mock-data"
import { useActiveScene, useEditor } from "@layerhub-pro/react"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"

export default function () {
  // const editor = useEditor()
  const scene = useActiveScene()
  const setIsSidebarOpen = useSetIsSidebarOpen()

  const addObject = React.useCallback(
    (url: string) => {
      if (scene) {
        const options = {
          type: "StaticImage",
          src: url,
        }
        scene.objects.add(options)
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
        <Block>Images</Block>

        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>
      <Scrollable>
        <Block padding={"0 1.5rem"}>
          <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "1fr 1fr" }}>
            {images.map((image, index) => {
              return (
                <ImageItem
                  key={index}
                  onClick={() => addObject(image.src.large2x)}
                  preview={image.src.small}
                  onDragStart={(ev: React.DragEvent<HTMLDivElement>) =>
                    onDragStart(ev, { type: "StaticImage", preview: image.src.small, src: image.src.large2x })
                  }
                />
              )
            })}
          </div>
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
        "::before:hover": {
          opacity: 1,
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
