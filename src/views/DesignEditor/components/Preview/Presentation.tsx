import React from "react"
import { Block } from "baseui/block"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import { useEditor } from "@layerhub-pro/react"
import { IScene } from "@layerhub-pro/types"
import { motion, AnimatePresence } from "framer-motion"
import { wrap } from "popmotion"
import Loading from "~/components/Loading"
import { Button, KIND, SHAPE } from "baseui/button"
import Left from "~/components/Icons/Left"
import Right from "~/components/Icons/Right"

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }
  },
}
const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

export default function ({ params }: { params: Record<string, string> }) {
  const [[page, direction], setPage] = React.useState([0, 0])

  const [slides, setSlides] = React.useState<string[]>([])
  const scenes = useDesignEditorScenes()
  const editor = useEditor()
  const [loading, setLoading] = React.useState(true)

  const imageIndex = wrap(0, slides.length, page)

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  const loadScenes = React.useCallback(
    async (scenes: IScene[]) => {
      // const slides = []
      // for (const scene of scenes) {
      //   const preview = (await renderer.render(scene, params)) as string
      //   slides.push(preview)
      // }
      // // @ts-ignore
      // setSlides(slides)
      // setLoading(false)
    },
    [editor]
  )

  React.useEffect(() => {
    if (scenes && editor) {
      // const currentScene = editor.scene.exportToJSON()
      // const updatedScenes = scenes.map((scene) => {
      //   if (scene.id === currentScene.id) {
      //     return currentScene
      //   }
      //   return scene
      // })
      // loadScenes(updatedScenes)
    }
  }, [editor, scenes])

  return (
    <Block
      $style={{
        flex: 1,
        display: "flex",
        position: "relative",
      }}
    >
      <>
        {loading ? (
          <Loading />
        ) : (
          <Block $style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Block
              $style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={page}
                  src={slides[imageIndex]}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  className="slides"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x)

                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1)
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1)
                    }
                  }}
                />
              </AnimatePresence>
            </Block>
            <Block
              $style={{
                height: "60px",
                display: "flex",
                background: "#ffffff",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 0.5rem",
              }}
            >
              <Block>
                <Button onClick={() => paginate(-1)} kind={KIND.tertiary} shape={SHAPE.square}>
                  <Left size={24} />
                </Button>
              </Block>
              <Block>
                <Button onClick={() => paginate(1)} kind={KIND.tertiary} shape={SHAPE.square}>
                  <Right size={24} />
                </Button>
              </Block>
            </Block>
          </Block>
        )}
      </>
    </Block>
  )
}
