import React from "react"
import { Block } from "baseui/block"
import { Button, KIND } from "baseui/button"
import { DesignType, IDesign } from "~/interfaces/DesignEditor"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import Video from "~/components/Icons/Video"
import Images from "~/components/Icons/Images"
import Presentation from "~/components/Icons/Presentation"
import { StyledLink } from "baseui/link"
import { loadDesign } from "./utils/design-loader"

export default function () {
  const [selectedEditor, setSelectedEditor] = React.useState<DesignType>("GRAPHIC")
  const { setEditorType, setCurrentScene } = useDesignEditorContext()
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const { setScenes, setCurrentDesign } = useDesignEditorContext()

  const handleInputFileRefClick = () => {
    inputFileRef.current?.click()
  }

  const handleImportDesign = React.useCallback(async (data: IDesign) => {
    const template = await loadDesign(data)
    setScenes(template.scenes)
    //   @ts-ignore
    setCurrentDesign(template.design)
    setCurrentScene(template.scenes[0])
    setEditorType(data.type as "GRAPHIC")
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (res) => {
        const result = res.target!.result as string
        const design = JSON.parse(result)
        handleImportDesign(design)
      }
      reader.onerror = (err) => {
        console.log(err)
      }

      reader.readAsText(file)
    }
  }

  return (
    <Block
      $style={{
        height: "100vh",
        width: "100vw",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Block>
        <Block>
          <Block
            $style={{
              display: "flex",
              gap: "2rem",
            }}
          >
            <Block
              onClick={() => setSelectedEditor("GRAPHIC")}
              $style={{
                height: "180px",
                width: "180px",
                background: selectedEditor === "GRAPHIC" ? "#000000" : "rgb(231, 236, 239)",
                color: selectedEditor === "GRAPHIC" ? "#ffffff" : "#333333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <Images size={34} />
              <Block>Graphic</Block>
            </Block>
            <Block
              onClick={() => setSelectedEditor("PRESENTATION")}
              $style={{
                height: "180px",
                width: "180px",
                background: selectedEditor === "PRESENTATION" ? "#000000" : "rgb(231, 236, 239)",
                color: selectedEditor === "PRESENTATION" ? "#ffffff" : "#333333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <Presentation size={36} />
              <Block>Presentation</Block>
            </Block>
            <Block
              onClick={() => setSelectedEditor("VIDEO")}
              $style={{
                height: "180px",
                width: "180px",
                background: selectedEditor === "VIDEO" ? "#000000" : "rgb(231, 236, 239)",
                color: selectedEditor === "VIDEO" ? "#ffffff" : "#333333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <Video size={36} />
              <Block>Video</Block>
            </Block>
          </Block>
        </Block>
        <Block $style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 0 0rem" }}>
          <Button style={{ width: "180px" }} onClick={() => setEditorType(selectedEditor)}>
            Continue
          </Button>
        </Block>
        <Block $style={{ display: "grid", placeContent: "center" }}>
          <Button onClick={handleInputFileRefClick} $as={StyledLink} kind={KIND.tertiary}>
            Import design from file
          </Button>
          <input
            multiple={false}
            onChange={handleFileInput}
            type="file"
            id="file"
            ref={inputFileRef}
            style={{ display: "none" }}
          />
        </Block>
      </Block>
    </Block>
  )
}
