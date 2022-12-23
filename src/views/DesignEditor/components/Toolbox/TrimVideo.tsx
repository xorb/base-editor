import React from "react"
import { Block } from "baseui/block"
import { useActiveObject, useEditor } from "@layerhub-pro/react"
import { Button, KIND, SIZE } from "baseui/button"
import { Range, getTrackBackground } from "~/components/ReactRange"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"

const STEP = 0.1
const rtl = false

function VerticalLine() {
  return (
    <svg width="3" height="24" viewBox="0 0 3 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.25 24C0.559644 24 0 23.8508 0 23.6667L0 0.333333C0 0.149238 0.559644 -7.15256e-07 1.25 -7.15256e-07C1.94036 -7.15256e-07 2.5 0.149238 2.5 0.333333L2.5 23.6667C2.5 23.8508 1.94036 24 1.25 24Z"
        fill="white"
      />
    </svg>
  )
}

const TrimVideo = ({ setTrim }: { setTrim: any }) => {
  const { currentScene, setScenes, scenes } = useDesignEditorContext()
  const [values, setValues] = React.useState([0, 4000])
  const [durationRange, setDurationRange] = React.useState([0, 10000])
  const editor = useEditor()
  const activeObject = useActiveObject() as any

  React.useEffect(() => {
    if (activeObject) {
      const totalDuration = activeObject.totalDuration || 5000
      if (activeObject.cut) {
        setValues([activeObject.cut.from, activeObject.cut.to])
      } else {
        setValues([0, totalDuration])
      }
      setDurationRange([0, totalDuration])
    }
  }, [activeObject])

  const applyVideoTrim = () => {
    editor.objects.update({
      duration: values[1] - values[0],
      cut: {
        from: values[0],
        to: values[1],
      },
    })
    setTrim(false)
  }
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
          display: "grid",
          alignItems: "center",
          gridTemplateColumns: "105px 1fr 100px",
        }}
      >
        <Block $style={{ fontSize: "14px", fontWeight: 500 }}>
          {new Date(values[0]).toISOString().slice(14, 19)} - {new Date(values[1]).toISOString().slice(14, 19)}
        </Block>
        <Block
          $style={{
            backgroundImage: `url("${activeObject?.preview}")`,
            height: "30px",
            backgroundSize: "contain",
          }}
        >
          <Range
            values={values}
            step={STEP}
            min={durationRange[0]}
            max={durationRange[1]}
            rtl={rtl}
            onChange={(values) => {
              setValues(values)
            }}
            renderTrack={({ props, children }) => (
              <div
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{
                  ...props.style,
                  height: "30px",
                  display: "flex",
                  width: "100%",
                }}
              >
                <div
                  ref={props.ref}
                  style={{
                    height: "30px",
                    width: "100%",
                    borderRadius: "0px",
                    background: getTrackBackground({
                      values,
                      colors: ["rgba(255,255,255,0.75)", "rgba(0,0,0,0)", "rgba(255,255,255,0.75)"],
                      min: durationRange[0],
                      max: durationRange[1],
                      rtl,
                    }),
                    alignSelf: "center",
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ props, isDragged }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "30px",
                  width: "16px",
                  borderRadius: 0,
                  backgroundColor: "#000000",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "col-resize",
                  outline: "none",
                }}
              >
                <VerticalLine />
              </div>
            )}
          />
        </Block>

        <Button onClick={() => applyVideoTrim()} size={SIZE.compact} kind={KIND.tertiary}>
          Apply
        </Button>
      </Block>
    </Block>
  )
}

export default TrimVideo
