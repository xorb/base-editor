import React from "react"
import { Canvas, fabric } from "@layerhub-pro/react"
import Playback from "../Playback"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import ParamMenu from "../ParamMenu"
import ContextMenu from "../ContextMenu"

export default function () {
  const { displayPlayback } = useDesignEditorContext()
  React.useEffect(() => {
    //Disable context menu
    //@ts-ignore
    fabric.util.addListener(document.getElementsByClassName("upper-canvas")[0], "contextmenu", function (e) {
      e.preventDefault()
    })

    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.cornerColor = "#3d3d3d"
    fabric.Object.prototype.cornerSize = 10
    // fabric.Object.prototype.cornerStyle = "circle"
    fabric.Object.prototype.borderColor = "#3ae374"
    fabric.Object.prototype.borderScaleFactor = 2
    fabric.Object.prototype.borderOpacityWhenMoving = 1

    // @ts-ignore
    fabric.Object.prototype.borderOpacity = 1
  }, [])
  return (
    <div style={{ flex: 1, display: "flex", position: "relative" }}>
      {displayPlayback && <Playback />}
      <ParamMenu />
      <ContextMenu />
      <Canvas
        config={{
          background: "#f1f2f6",

          controlsPosition: {
            rotation: "BOTTOM",
          },
          // @ts-ignore
          type: "GRAPHIC",
          shadow: {
            blur: 4,
            color: "#fcfcfc",
            offsetX: 0,
            offsetY: 0,
          },
        }}
      />
    </div>
  )
}
