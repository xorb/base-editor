import React from "react"
import { styled, ThemeProvider, DarkTheme } from "baseui"
import { Theme } from "baseui/theme"
import { Button, KIND } from "baseui/button"
import Logo from "~/components/Icons/Logo"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import Play from "~/components/Icons/Play"
import { Block } from "baseui/block"
import { useDesign, useEditor } from "@layerhub-pro/react"
import DesignTitle from "./DesignTitle"
import { IDesign } from "~/interfaces/DesignEditor"
import { loadDesign } from "../../utils/design-loader"

const Container = styled<"div", {}, Theme>("div", ({ $theme }) => ({
  height: "64px",
  background: $theme.colors.black,
  display: "grid",
  padding: "0 1.25rem",
  gridTemplateColumns: "320px 1fr 320px",
  alignItems: "center",
}))

export default function () {
  const { setDisplayPreview } = useDesignEditorContext()
  const design = useDesign()
  const editor = useEditor()
  const inputFileRef = React.useRef<HTMLInputElement>(null)

  const makeDownload = (data: Object) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data))
    const a = document.createElement("a")
    a.href = dataStr
    a.download = "template.json"
    a.click()
  }

  const makeDownloadTemplate = async () => {
    if (design) {
      const data = design.toJSON()
      makeDownload(data)
    }
  }

  const handleImportDesign = React.useCallback(
    async (data: IDesign) => {
      await loadDesign(data)
      editor?.design.setDesign(data)
    },
    [editor]
  )

  const handleInputFileRefClick = () => {
    inputFileRef.current?.click()
  }

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
    // @ts-ignore
    <ThemeProvider theme={DarkTheme}>
      <Container>
        <div style={{ color: "#ffffff" }}>
          <Logo size={36} />
        </div>
        <DesignTitle />
        <Block $style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "flex-end" }}>
          <input
            multiple={false}
            onChange={handleFileInput}
            type="file"
            id="file"
            ref={inputFileRef}
            style={{ display: "none" }}
          />
          <Button size="compact" onClick={() => editor!.debug()} kind={KIND.tertiary}>
            Debug
          </Button>
          <Button
            size="compact"
            onClick={handleInputFileRefClick}
            kind={KIND.tertiary}
            overrides={{
              StartEnhancer: {
                style: {
                  marginRight: "4px",
                },
              },
            }}
          >
            Import
          </Button>

          <Button
            size="compact"
            onClick={makeDownloadTemplate}
            kind={KIND.tertiary}
            overrides={{
              StartEnhancer: {
                style: {
                  marginRight: "4px",
                },
              },
            }}
          >
            Export
          </Button>
          <Button
            size="compact"
            onClick={() => setDisplayPreview(true)}
            kind={KIND.tertiary}
            overrides={{
              StartEnhancer: {
                style: {
                  marginRight: "4px",
                },
              },
            }}
          >
            <Play size={24} />
          </Button>
        </Block>
      </Container>
    </ThemeProvider>
  )
}
