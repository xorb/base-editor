import React from "react"
import { useStyletron } from "baseui"
import { Block } from "baseui/block"
import { Button, SIZE } from "baseui/button"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import Scrollable from "~/components/Scrollable"
import { vectors } from "~/constants/mock-data"
import { useActiveScene } from "@layerhub-pro/react"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"

export default function () {
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const scene = useActiveScene()
  const setIsSidebarOpen = useSetIsSidebarOpen()

  const addObject = React.useCallback(
    (url: string) => {
      if (scene) {
        const options = {
          type: "StaticVector",
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

  const handleDropFiles = (files: FileList) => {
    const file = files[0]
    const url = URL.createObjectURL(file)
    scene.objects.add({
      src: url,
      type: "StaticVector",
    })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDropFiles(e.target.files!)
  }

  const handleInputFileRefClick = () => {
    inputFileRef.current?.click()
  }

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
        <Block>Graphics</Block>

        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>

      <Block padding={"0 1.5rem"}>
        <Button
          onClick={handleInputFileRefClick}
          size={SIZE.compact}
          overrides={{
            Root: {
              style: {
                width: "100%",
              },
            },
          }}
        >
          Computer
        </Button>
      </Block>
      <Scrollable>
        <input onChange={handleFileInput} type="file" id="file" ref={inputFileRef} style={{ display: "none" }} />
        <Block>
          <Block $style={{ display: "grid", gap: "8px", padding: "1.5rem", gridTemplateColumns: "1fr 1fr" }}>
            {vectors.map((vector, index) => (
              <GraphicItem
                onDragStart={(ev: React.DragEvent<HTMLDivElement>) =>
                  onDragStart(ev, { type: "StaticVector", src: vector })
                }
                onClick={() => addObject(vector)}
                key={index}
                preview={vector}
              />
            ))}
          </Block>
        </Block>
      </Scrollable>
    </Block>
  )
}

function GraphicItem({
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
      onClick={onClick}
      onDragStart={onDragStart}
      className={css({
        position: "relative",
        height: "84px",
        background: "#f8f8fb",
        cursor: "pointer",
        padding: "12px",
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
