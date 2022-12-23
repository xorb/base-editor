import React from "react"
import useEditorType from "~/hooks/useEditorType"
import SelectEditor from "./SelectEditor"
import GraphicEditor from "./GraphicEditor"
import PresentationEditor from "./PresentationEditor"
import VideoEditor from "./VideoEditor"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import Preview from "./components/Preview"
import { Block } from "baseui/block"
import { useFullscreen } from "react-use"

function DesignEditor() {
  const editorType = useEditorType()
  const { displayPreview, setDisplayPreview } = useDesignEditorContext()
  const { isFullScreen, toggleFullScreen } = useDesignEditorContext()
  const ref = React.useRef(null)

  const isFullscreen = useFullscreen(ref, isFullScreen, { onClose: () => toggleFullScreen() })

  return (
    <Block ref={ref}>
      {displayPreview && <Preview isOpen={displayPreview} setIsOpen={setDisplayPreview} />}

      {
        {
          NONE: <SelectEditor />,
          CUSTOMIZATION: <GraphicEditor />,
          PRESENTATION: <PresentationEditor />,
          VIDEO: <VideoEditor />,
          GRAPHIC: <GraphicEditor />,
        }[editorType]
      }
    </Block>
  )
}

export default DesignEditor
