import { fabric } from "fabric"
import { nanoid } from "nanoid"
import {
  IBackground,
  IBackgroundImage,
  IGroup,
  ILayer,
  IStaticAudio,
  IStaticImage,
  IStaticPath,
  IStaticText,
  IStaticVector,
  IStaticVideo,
} from "@layerhub-pro/types"
import { defaultObjectOptions } from "../constants/defaults"
import { updateObjectBounds, updateObjectShadow } from "../utils/fabric"
import { loadImageFromURL } from "../utils/image-loader"
import { createVideoElement } from "../utils/video-loader"

interface ImportOptions {
  item: ILayer
  options: Required<ILayer>
  isInGroup: boolean
}

const ObjectTypes = {
  StaticImage: "image",
  Group: "group",
  StaticPath: "path",
  StaticText: "text",
  StaticVideo: "video",
  StaticAudio: "audio",
  StaticVector: "vector",
  Background: "background",
  BackgroundImage: "backgroundImage",
  BackgroundContainer: "backgroundContainer",
  PrintItem: "printItem",
  polyline: "polyline",
  ellipse: "ellipse",
  line: "line",
  rect: "rect",
  triangle: "triangle",
}

class ObjectImporter {
  public async import(props: ImportOptions) {
    const type = ObjectTypes[props.item.type as "line"] as "line"
    return await this[type](props)
  }

  public text(props: ImportOptions) {
    return new Promise((resolve, reject) => {
      try {
        const { item, options } = props
        const baseOptions = this.getBaseOptions(props)

        const metadata = item.metadata

        const { textAlign, fontFamily, fontSize, charSpacing, lineHeight, text, underline, fill, fontURL } =
          item as IStaticText

        const textOptions = {
          ...baseOptions,
          underline,
          width: baseOptions.width ? baseOptions.width : 240,
          fill: fill ? fill : "#333333",
          text: text ? text : "Empty Text",
          ...(textAlign && { textAlign }),
          ...(fontFamily && { fontFamily }),
          ...(fontSize && { fontSize }),
          ...(charSpacing && { charSpacing }),
          ...(lineHeight && { lineHeight }),
          metadata,
          fontURL,
        }
        // @ts-ignore
        const element = new fabric.StaticText(textOptions)
        updateObjectBounds(element, options)
        updateObjectShadow(element, item.shadow)

        resolve(element)
      } catch (err) {
        reject(err)
      }
    })
  }
  public image(props: ImportOptions) {
    return new Promise(async (resolve, reject) => {
      try {
        const { item, options } = props
        const baseOptions = this.getBaseOptions(props)
        const { src, cropX, cropY } = item as IStaticImage

        const image: any = await loadImageFromURL(src)

        const { width, height } = baseOptions
        if (!width || !height) {
          baseOptions.width = image.width
          baseOptions.height = image.height
        }

        const element = new fabric.StaticImage(image, {
          ...baseOptions,
          src,
          cropX: cropX || 0,
          cropY: cropY || 0,
        })

        updateObjectBounds(element, options)
        updateObjectShadow(element, item.shadow)

        resolve(element)
      } catch (err) {
        reject(err)
      }
    })
  }
  public video(props: ImportOptions) {
    return new Promise(async (resolve, reject) => {
      try {
        const { item } = props
        const baseOptions = this.getBaseOptions(props)
        const { src } = item as IStaticVideo
        const id = item.id
        const videoElement = await createVideoElement(id, src)
        const { width, height } = baseOptions

        if (!width || !height) {
          baseOptions.width = videoElement.videoWidth
          baseOptions.height = videoElement.videoHeight
        }

        const element = new fabric.StaticVideo(videoElement, {
          ...baseOptions,
          src: src,
          duration: videoElement.duration,
          totalDuration: videoElement.duration,
        }) as unknown as any

        element.set("time", 10)
        videoElement.currentTime = 10
        resolve(element)
      } catch (err) {
        reject(err)
      }
    })
  }
  public background(props: ImportOptions) {
    return new Promise(async (resolve, reject) => {
      try {
        const { item } = props
        const baseOptions = this.getBaseOptions(props)
        const { fill } = item as IBackground
        const element = new fabric.Background({
          ...baseOptions,
          fill: fill,
          // @ts-ignore
          shadow: item.shadow,
        })
        resolve(element)
      } catch (err) {
        reject(err)
      }
    })
  }
  public backgroundContainer(props: ImportOptions): Promise<fabric.BackgroundContainer> {
    return new Promise(async (resolve, reject) => {
      try {
        const { item } = props

        const baseOptions = this.getBaseOptions(props)
        const { fill } = item as IBackground
        // @ts-ignore
        const element = new fabric.BackgroundContainer({
          ...baseOptions,
          fill: fill,
        })

        resolve(element)
      } catch (err) {
        reject(err)
      }
    })
  }

  public backgroundImage(props: ImportOptions) {
    return new Promise(async (resolve, reject) => {
      try {
        const { item, options } = props
        const baseOptions = this.getBaseOptions(props)
        const { src, cropX, cropY } = item as IBackgroundImage

        const image: any = await loadImageFromURL(src)

        const { width, height } = baseOptions
        if (!width || !height) {
          baseOptions.width = image.width
          baseOptions.height = image.height
        }

        const element = new fabric.BackgroundImage(image, {
          ...baseOptions,
          cropX: cropX || 0,
          cropY: cropY || 0,
        })

        updateObjectBounds(element, options)
        updateObjectShadow(element, item.shadow)

        resolve(element)
      } catch (err) {
        reject(err)
      }
    })
  }

  public printItem(props: ImportOptions) {
    return new Promise(async (resolve, reject) => {
      try {
        const { item, options } = props
        const baseOptions = this.getBaseOptions(props)
        const { src, cropX, cropY } = item as IStaticImage

        const image: any = await loadImageFromURL(src)

        const { width, height } = baseOptions
        if (!width || !height) {
          baseOptions.width = image.width
          baseOptions.height = image.height
        }

        const element = new fabric.PrintItem(image, {
          ...baseOptions,
          cropX: cropX || 0,
          cropY: cropY || 0,
        })

        updateObjectBounds(element, options)
        updateObjectShadow(element, item.shadow)
        resolve(element)
      } catch (err) {
        reject(err)
      }
    })
  }
  public triangle(props: ImportOptions): Promise<fabric.Triangle> {
    return new Promise(async (resolve, reject) => {
      try {
        const { item } = props
        const baseOptions: any = this.getBaseOptions(props)
        const element = new fabric.Triangle(baseOptions)

        updateObjectShadow(element, item.shadow)

        resolve(element)
      } catch (err) {
        reject(err)
      }
    })
  }
  public rect(props: ImportOptions): Promise<fabric.Rect> {
    return new Promise(async (resolve, reject) => {
      try {
        const { item } = props
        const baseOptions: any = this.getBaseOptions(props)

        const element = new fabric.Rect(baseOptions)

        updateObjectShadow(element, item.shadow)

        resolve(element)
      } catch (err) {
        reject(err)
      }
    })
  }

  public line(props: ImportOptions): Promise<fabric.Line> {
    return new Promise(async (resolve, reject) => {
      try {
        const { item, options } = props
        const baseOptions = this.getBaseOptions(props) as unknown as fabric.ILineOptions
        const { x1, y1, x2, y2 } = item as any

        const element = new fabric.Line([x1, y1, x2, y2], baseOptions)

        updateObjectBounds(element, options)
        updateObjectShadow(element, item.shadow)

        resolve(element)
      } catch (err) {
        reject(err)
      }
    })
  }

  public ellipse(props: ImportOptions): Promise<fabric.Ellipse> {
    return new Promise(async (resolve, reject) => {
      try {
        const { item, options } = props
        const baseOptions: any = this.getBaseOptions(props)
        const element = new fabric.Ellipse(baseOptions)

        updateObjectBounds(element, options)
        updateObjectShadow(element, item.shadow)

        resolve(element)
      } catch (err) {
        reject(err)
      }
    })
  }

  public polyline(props: ImportOptions): Promise<fabric.Polyline> {
    return new Promise(async (resolve, reject) => {
      try {
        const { item, options } = props
        const baseOptions: any = this.getBaseOptions(props)
        const { points } = item as any

        const element = new fabric.Polyline(points, baseOptions)
        updateObjectShadow(element, item.shadow)

        resolve(element)
      } catch (err) {
        reject(err)
      }
    })
  }

  public audio(props: ImportOptions) {
    return new Promise((resolve, reject) => {
      try {
        const { item } = props

        const baseOptions = this.getBaseOptions(props)
        const { src } = item as IStaticAudio
        // @ts-ignore
        const element = new fabric.StaticAudio({
          ...baseOptions,
          src: src,
        })
        resolve(element)
      } catch (err) {
        reject(err)
      }
    })
  }

  public path(props: ImportOptions) {
    return new Promise(async (resolve, reject) => {
      try {
        const { item, options } = props
        const baseOptions = this.getBaseOptions(props)
        const { path, fill } = item as IStaticPath

        const element = new fabric.StaticPath({
          ...baseOptions,
          // @ts-ignore
          path,
          fill,
        })

        updateObjectBounds(element, options)
        updateObjectShadow(element, item.shadow)

        resolve(element)
      } catch (err) {
        reject(err)
      }
    })
  }

  public vector(props: ImportOptions) {
    return new Promise((resolve, reject) => {
      try {
        const { item, options } = props
        const baseOptions = this.getBaseOptions(props)
        const { src, colorMap = {} } = item as IStaticVector

        fabric.loadSVGFromURL(src, (objects, opts) => {
          const { width, height } = baseOptions
          if (!width || !height) {
            baseOptions.width = opts.width
            baseOptions.height = opts.height
            baseOptions.top = options.top!
            baseOptions.left = options.left!
          }

          const element = new fabric.StaticVector(objects, opts, {
            ...baseOptions,
            src,
            colorMap,
          })

          updateObjectBounds(element, options)
          updateObjectShadow(element, item.shadow)

          resolve(element)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  public group(props: ImportOptions) {
    return new Promise(async (resolve, reject) => {
      try {
        const { item, options } = props
        const baseOptions = this.getBaseOptions(props)
        let objects: fabric.Object[] = []

        for (const object of (item as IGroup).objects) {
          objects = objects.concat(
            // @ts-ignore
            await this.import({
              isInGroup: true,
              item: object,
              options: options,
            })
          )
        }
        // @ts-ignore
        const element = new fabric.Group(objects, {
          ...baseOptions,
          subTargetCheck: true,
        })

        updateObjectBounds(element, options)
        updateObjectShadow(element, item.shadow)

        resolve(element)
      } catch (err) {
        reject(err)
      }
    })
  }

  public getBaseOptions(props: ImportOptions): Required<ILayer> {
    const isInGroup = props.isInGroup
    const { top, left, preview, id, name, type } = props.item as Required<ILayer>
    const baseOptions = Object.assign({}, defaultObjectOptions, props.item, {
      id: id || nanoid(),
      name: name || type,
      top: isInGroup ? top : props.options.top! + top,
      left: isInGroup ? left : props.options.left! + left,
      preview: preview,
    })
    return baseOptions as unknown as Required<ILayer>
  }
}
export default ObjectImporter
