import { useActiveObject, useActiveScene, useContextMenuRequest, useEditor } from "@layerhub-pro/react"
import { IScene } from "@layerhub-pro/types"
import { useStyletron } from "baseui"
import BringToFront from "~/components/Icons/BringToFront"
import Delete from "~/components/Icons/Delete"
import Duplicate from "~/components/Icons/Duplicate"
import Elements from "~/components/Icons/Elements"
import Locked from "~/components/Icons/Locked"
import Paste from "~/components/Icons/Paste"
import SendToBack from "~/components/Icons/SendToBack"
import Unlocked from "~/components/Icons/Unlocked"

function ContextMenu() {
  const contextMenuRequest = useContextMenuRequest()
  const activeObject = useActiveObject() as any
  const editor = useEditor()
  const activeScene = useActiveScene()
  const handleAsComponentHandler = async () => {
    if (editor) {
      // const component: any = await editor.scene.exportAsComponent()
      // if (component) {
      //   const design: IScene = {
      //     id: "some_id",
      //     frame: {
      //       width: component.width,
      //       height: component.height,
      //     },
      //     layers: [component],
      //     metadata: {},
      //   }
      //   const preview = await renderer.render(design)
      // }
    }
  }
  if (!contextMenuRequest || !contextMenuRequest.target || !editor || !activeScene) {
    return <></>
  }

  if (contextMenuRequest.target.type === "Background") {
    return (
      <>
        <div // @ts-ignore
          onContextMenu={(e: Event) => e.preventDefault()}
          style={{
            position: "absolute",
            top: `${contextMenuRequest.top}px`,
            left: `${contextMenuRequest.left}px`,
            zIndex: 129,
            width: "240px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0.5px 2px 7px rgba(0, 0, 0, 0.1)",
            padding: "0.5rem 0",
          }}
        >
          <ContextMenuItem
            disabled={true}
            onClick={() => {
              activeScene.objects.copy()
              editor?.cancelContextMenuRequest()
            }}
            icon="Duplicate"
            label="Copy"
          >
            <Duplicate size={24} />
          </ContextMenuItem>
          <ContextMenuItem
            disabled={!activeScene?.objects.clipboard}
            onClick={() => {
              activeScene.objects.paste()
              editor.cancelContextMenuRequest()
            }}
            icon="Paste"
            label="Paste"
          >
            <Paste size={24} />
          </ContextMenuItem>
          <ContextMenuItem
            disabled={!activeObject || activeObject.type === "Frame"}
            onClick={() => {
              activeScene.objects.remove()
              editor.cancelContextMenuRequest()
            }}
            icon="Delete"
            label="Delete"
          >
            <Delete size={24} />
          </ContextMenuItem>
        </div>
      </>
    )
  }
  return (
    <>
      {!contextMenuRequest.target.locked ? (
        <div // @ts-ignore
          onContextMenu={(e: Event) => e.preventDefault()}
          style={{
            position: "absolute",
            top: `${contextMenuRequest.top}px`,
            left: `${contextMenuRequest.left}px`,
            zIndex: 129,
            width: "240px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0.5px 2px 7px rgba(0, 0, 0, 0.1)",
            padding: "0.5rem 0",
          }}
        >
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.copy()
              editor.cancelContextMenuRequest()
            }}
            icon="Duplicate"
            label="Copy"
          >
            <Duplicate size={24} />
          </ContextMenuItem>
          <ContextMenuItem
            disabled={!activeScene.objects.clipboard}
            onClick={() => {
              activeScene.objects.paste()
              editor.cancelContextMenuRequest()
            }}
            icon="Paste"
            label="Paste"
          >
            <Paste size={24} />
          </ContextMenuItem>
          <ContextMenuItem
            disabled={!activeObject || activeObject.type === "Frame"}
            onClick={() => {
              activeScene.objects.remove()
              editor.cancelContextMenuRequest()
            }}
            icon="Delete"
            label="Delete"
          >
            <Delete size={24} />
          </ContextMenuItem>
          <div style={{ margin: "0.5rem 0" }} />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.bringForward()
              editor.cancelContextMenuRequest()
            }}
            icon="Forward"
            label="Bring forward"
          >
            <BringToFront size={24} />
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.sendBackwards()
              editor.cancelContextMenuRequest()
            }}
            icon="Backward"
            label="Send backward"
          >
            <SendToBack size={24} />
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              // handleAsComponentHandler()
              // editor.cancelContextMenuRequest()
            }}
            icon="Elements"
            label="Save as component"
          >
            <Elements size={24} />
          </ContextMenuItem>
          <div style={{ margin: "0.5rem 0" }} />
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.lock()
              editor.cancelContextMenuRequest()
            }}
            icon="Locked"
            label="Lock"
          >
            <Locked size={24} />
          </ContextMenuItem>
          {activeObject?.type === "StaticImage" && (
            <ContextMenuItem
              onClick={() => {
                // handleAsComponentHandler()
                activeScene.objects.setAsBackgroundImage()
                editor.cancelContextMenuRequest()
              }}
              icon="Images"
              label="Set as background image"
            >
              <Elements size={24} />
            </ContextMenuItem>
          )}
        </div>
      ) : (
        <div // @ts-ignore
          onContextMenu={(e: Event) => e.preventDefault()}
          style={{
            position: "absolute",
            top: `${contextMenuRequest.top}px`,
            left: `${contextMenuRequest.left}px`,
            zIndex: 129,
            width: "240px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0.5px 2px 7px rgba(0, 0, 0, 0.1)",
            padding: "0.5rem 0",
          }}
        >
          <ContextMenuItem
            onClick={() => {
              activeScene.objects.unlock()
              editor.cancelContextMenuRequest()
            }}
            icon="Unlocked"
            label="Unlock"
          >
            <Unlocked size={24} />
          </ContextMenuItem>
        </div>
      )}
    </>
  )
}

function ContextMenuItem({
  label,
  onClick,
  children,
  disabled = false,
}: {
  icon: string
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  const [css] = useStyletron()
  return (
    <div
      onClick={onClick}
      className={css({
        display: "flex",
        height: "36px",
        alignItems: "center",
        padding: "0 1rem",
        gap: "1rem",
        cursor: "pointer",
        pointerEvents: disabled ? "none" : "auto",
        opacity: disabled ? 0.4 : 1,
        fontSize: "14px",
        ":hover": {
          backgroundColor: "rgba(0,0,0,0.075)",
        },
      })}
    >
      {children} {label}
    </div>
  )
}

export default ContextMenu
