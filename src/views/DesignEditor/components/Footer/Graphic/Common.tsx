import React from "react"
import Icons from "~/components/Icons"
import { Button, KIND, SIZE } from "baseui/button"
import { StatefulTooltip, PLACEMENT } from "baseui/tooltip"
import { useZoomRatio, useEditor, useActiveScene } from "@layerhub-pro/react"
import { Block } from "baseui/block"
import { Slider } from "baseui/slider"
import { Input } from "baseui/input"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"

interface Options {
  zoomRatio: number
  zoomRatioTemp: number
}

export default function () {
  const zoomMin = 10
  const zoomMax = 240
  const editor = useEditor()
  const [state, setState] = React.useState<Options>({
    zoomRatio: 20,
    zoomRatioTemp: 20,
  })
  const { toggleFullScreen } = useDesignEditorContext()
  const zoomRatio: number = useZoomRatio()
  const scene = useActiveScene()

  const makeUndo = React.useCallback(() => {
    if (scene) {
      scene.history.undo()
    }
  }, [scene])

  const makeRedo = React.useCallback(() => {
    if (scene) {
      scene.history.redo()
    }
  }, [scene])

  const handleChange = (type: string, value: number) => {
    if (editor) {
      if (type.includes("emp")) {
        setState({ ...state, zoomRatioTemp: value })
      }
    }
  }

  React.useEffect(() => {
    setState({ ...state, zoomRatio: Math.round(zoomRatio * 100), zoomRatioTemp: Math.round(zoomRatio * 100) })
  }, [zoomRatio])

  const applyZoomRatio = (type: string, e: any) => {
    const value = e.target.value
    if (editor) {
      if (value === "") {
        setState({ ...state, zoomRatio: state.zoomRatio, zoomRatioTemp: state.zoomRatio })
      } else {
        let parsedValue = parseFloat(value)

        if (parsedValue < 0) {
          editor.zoom.zoomToRatio(zoomMin / 100)
        } else if (parsedValue > zoomMax) {
          editor.zoom.zoomToRatio(zoomMax / 100)
        } else {
          editor.zoom.zoomToRatio(parsedValue / 100)
        }
      }
    }
  }

  return (
    <Block
      $style={{
        height: "50px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Button kind={KIND.tertiary} size={SIZE.compact}>
          <Icons.Layers size={20} />
        </Button>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Button onClick={() => toggleFullScreen()} kind={KIND.tertiary} size={SIZE.compact}>
          <Icons.Expand size={16} />
        </Button>

        <Block>
          <StatefulTooltip
            placement={PLACEMENT.bottom}
            showArrow={true}
            accessibilityType={"tooltip"}
            content="Zoom to fit"
          >
            <Button
              kind={KIND.tertiary}
              size={SIZE.compact}
              onClick={() => {
                editor?.zoom.zoomToFit(scene.getFitRatio())
              }}
            >
              <Icons.Compress size={16} />
            </Button>
          </StatefulTooltip>
        </Block>

        <Block>
          <StatefulTooltip
            placement={PLACEMENT.bottom}
            showArrow={true}
            accessibilityType={"tooltip"}
            content="Zoom Out"
          >
            <Button kind={KIND.tertiary} size={SIZE.compact} onClick={() => editor?.zoom.zoomOut()}>
              <Icons.RemoveCircleOutline size={24} />
            </Button>
          </StatefulTooltip>
        </Block>

        <Slider
          overrides={{
            InnerThumb: () => null,
            ThumbValue: () => null,
            TickBar: () => null,
            Root: {
              style: { width: "140px" },
            },
            Thumb: {
              style: {
                height: "12px",
                width: "12px",
                paddingLeft: 0,
              },
            },
            Track: {
              style: {
                paddingLeft: 0,
                paddingRight: 0,
              },
            },
          }}
          value={[state.zoomRatio]}
          onChange={({ value }) => applyZoomRatio("zoomRatio", { target: { value: value[0] } })}
          min={zoomMin}
          max={zoomMax}
        />

        <Block>
          <StatefulTooltip
            placement={PLACEMENT.bottom}
            showArrow={true}
            accessibilityType={"tooltip"}
            content="Zoom In"
          >
            <Button kind={KIND.tertiary} size={SIZE.compact} onClick={() => editor?.zoom.zoomIn()}>
              <Icons.AddCircleOutline size={24} />
            </Button>
          </StatefulTooltip>
        </Block>

        <Input
          type="number"
          endEnhancer="%"
          overrides={{
            Input: {
              style: {
                backgroundColor: "#ffffff",
                textAlign: "center",
                paddingLeft: 0,
                paddingRight: 0,
              },
            },
            Root: {
              style: {
                borderBottomColor: "rgba(0,0,0,0.15)",
                borderTopColor: "rgba(0,0,0,0.15)",
                borderRightColor: "rgba(0,0,0,0.15)",
                borderLeftColor: "rgba(0,0,0,0.15)",
                borderTopWidth: "1px",
                borderBottomWidth: "1px",
                borderRightWidth: "1px",
                borderLeftWidth: "1px",
                height: "20px",
                width: "52px",
                paddingRight: 0,
              },
            },
            EndEnhancer: {
              style: {
                paddingLeft: 0,
                paddingRight: "10px",
                backgroundColor: "#ffffff",
              },
            },
          }}
          size={SIZE.mini}
          max={zoomMax}
          min={zoomMin}
          onChange={(e) => handleChange("zoomRatioTemp", parseFloat(e.target.value))}
          onBlur={(e) => applyZoomRatio("zoomRatio", e)}
          value={state.zoomRatioTemp}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
        <Button onClick={makeUndo} kind={KIND.tertiary} size={SIZE.compact}>
          <Icons.Undo size={22} />
        </Button>
        <Button onClick={makeRedo} kind={KIND.tertiary} size={SIZE.compact}>
          <Icons.Redo size={22} />
        </Button>
      </div>
    </Block>
  )
}
