import React from "react"
import { Block } from "baseui/block"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import Scrollable from "~/components/Scrollable"
import { useActiveScene, useEditor } from "@layerhub-pro/react"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import api from "~/services/api"

const loadVideoResource = (videoSrc: string): Promise<HTMLVideoElement> => {
  return new Promise(function (resolve, reject) {
    var video = document.createElement("video")
    video.src = videoSrc
    video.crossOrigin = "anonymous"
    video.addEventListener("loadedmetadata", function (event) {
      video.currentTime = 1
    })

    video.addEventListener("seeked", function () {
      resolve(video)
    })

    video.addEventListener("error", function (error) {
      reject(error)
    })
  })
}

const captureFrame = (video: HTMLVideoElement) => {
  return new Promise(function (resolve) {
    var canvas = document.createElement("canvas") as HTMLCanvasElement
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d")!.drawImage(video, 0, 0, canvas.width, canvas.height)
    URL.revokeObjectURL(video.src)

    const data = canvas.toDataURL()

    fetch(data)
      .then((res) => {
        return res.blob()
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        resolve(url)
      })
  })
}

const captureDuration = (video: HTMLVideoElement): Promise<number> => {
  return new Promise((resolve) => {
    resolve(video.duration)
  })
}

export default function () {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const activeScene = useActiveScene()
  const [videos, setVideos] = React.useState<any[]>([
    {
      src: "https://ik.imagekit.io/lh/vid4_6yff-VhyB.mp4",
    },
    {
      src: "https://ik.imagekit.io/lh/vid3_-NwyLYovT.mp4",
    },
  ])
  const { scenes, setScenes, currentScene } = useDesignEditorContext()

  // const loadPexelsVideos = async () => {
  //   // const videos = (await getPexelsVideos("people")) as any
  //   const videos = await api.getPixabayVideos({
  //     page: 1,
  //     perPage: 10,
  //     query: "cat",
  //   })
  //   console.log({ videos })
  //   setVideos(videos)
  // }
  // React.useEffect(() => {
  //   loadPexelsVideos()
  // }, [])

  const addObject = React.useCallback(
    async (options: any) => {
      if (activeScene) {
        const video = await loadVideoResource(options.src)
        const frame = await captureFrame(video)
        const duration = (await captureDuration(video)) * 1000
        activeScene.objects.add({ ...options, duration, preview: frame, type: "StaticVideo" })
        const updatedScenes = scenes.map((scn) => {
          if (scn.id === currentScene?.id) {
            return {
              ...currentScene,
              duration: duration > currentScene!.duration! ? duration : currentScene!.duration!,
            }
          }
          return scn
        })
        // @ts-ignore
        setScenes(updatedScenes)
      }
    },
    [activeScene, scenes, currentScene]
  )

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
        <Block>Videos</Block>

        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>
      <Scrollable>
        <Block padding={"0 1.5rem"}>
          <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "1fr 1fr" }}>
            {videos.map((video, index) => {
              return (
                <img
                  style={{ cursor: "pointer" }}
                  width={"120px"}
                  key={index}
                  src={"https://via.placeholder.com/300/09f/fff.png"}
                  onClick={() => addObject({ src: video.src })}
                />
              )
            })}
          </div>
        </Block>
      </Scrollable>
    </Block>
  )
}
