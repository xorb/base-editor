import React from "react"
import { DesignEditorContext } from "~/contexts/DesignEditor"
import { useEditor, useFrame } from "@layerhub-pro/react"
import { DndContext, closestCenter, PointerSensor, useSensor, DragOverlay } from "@dnd-kit/core"
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToFirstScrollableAncestor, restrictToHorizontalAxis } from "@dnd-kit/modifiers"
import TimelineItem from "./TimelineItem"
import { Block } from "baseui/block"
import { IScene } from "@layerhub-pro/types"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"

export default function () {
  const { currentScene, currentPreview, setCurrentPreview, setScenes } = React.useContext(DesignEditorContext)
  const scenes = useDesignEditorScenes()
  const editor = useEditor()
  const frame = useFrame()
  const [draggedScene, setDraggedScene] = React.useState<IScene | null>(null)

  const sensors = [
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  ]

  const makeResizeTimelineItem = React.useCallback(
    (id: string, props: any) => {
      const updatedItems = scenes.map((scene) => {
        if (scene.id === id) {
          return {
            ...scene,
            duration: props.width * 40,
          }
        }
        return scene
      })

      setScenes(updatedItems)
    },
    [scenes]
  )

  function handleDragStart(event: any) {
    const draggedScene = scenes.find((s) => s.id === event.active.id)
    if (draggedScene) {
      setDraggedScene(draggedScene)
    }
  }

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (active.id !== over.id) {
      setScenes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
    setDraggedScene(null)
  }

  React.useEffect(() => {
    // let watcher = async () => {
    //   const updatedScene = editor.scene.exportToJSON()
    //   const updatedPreview = (await renderer.render(updatedScene, {})) as any
    //   const updatedScenes = scenes.map((scene) => {
    //     if (scene.id === updatedScene.id) {
    //       let maxDuration = null
    //       const durations = updatedScene.layers.filter((s) => !!s.duration).map((s) => s.duration!)
    //       // confirm
    //       if (durations[0]) {
    //         maxDuration = Math.max(...durations, 0)
    //       }
    //       return {
    //         ...updatedScene,
    //         preview: updatedPreview,
    //         duration: maxDuration ? maxDuration : scene.duration,
    //       }
    //     } else {
    //       return scene
    //     }
    //   })
    //   setScenes(updatedScenes)
    //   setCurrentPreview(updatedPreview)
    // }
    // if (editor) {
    //   editor.on("history:changed", watcher)
    // }
    // return () => {
    //   if (editor) {
    //     editor.off("history:changed", watcher)
    //   }
    // }
  }, [editor, scenes])

  return (
    <DndContext
      modifiers={[restrictToFirstScrollableAncestor, restrictToHorizontalAxis]}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div style={{ display: "flex", background: "red" }}>
        <SortableContext items={scenes} strategy={horizontalListSortingStrategy}>
          {scenes.map((scene) => {
            let maxDuration = null
            const durations = scene.layers.filter((s) => !!s.duration).map((s) => s.duration!)
            if (durations[0]) {
              maxDuration = Math.max(...durations, 0)
            }

            return (
              <TimelineItem
                key={scene.id}
                item={scene}
                makeResizeTimelineItem={makeResizeTimelineItem}
                width={scene.duration ? scene.duration / 40 : 5000 / 40}
                maxWidth={maxDuration ? maxDuration / 40 : undefined}
                duration={scene.duration ? scene.duration : 5000}
                height={70}
                frame={frame}
                id={scene.id}
                preview={currentPreview && scene.id === currentScene?.id ? currentPreview : scene.preview || ""}
                isCurrentScene={(currentScene && currentScene.id === scene.id) || false}
              />
            )
          })}
        </SortableContext>
        <DragOverlay>
          {draggedScene ? (
            <Block
              $style={{
                backgroundImage: `url(${draggedScene.preview})`,
                backgroundSize: `${frame ? (frame.width * 70) / frame.height : 70}px 70px`,
                backgroundRepeat: "repeat",
                height: "70px",
                opacity: 0.5,
              }}
            ></Block>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}

// 125px => 5s
// 25px => 1s

// markerRefPosition.y * 40

// px * 40 === time

// 125 * 40 === 5000