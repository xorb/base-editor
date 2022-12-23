import {
  ILayer,
  IStaticAudio,
  IStaticImage,
  IStaticText,
  IStaticVector,
  IStaticVideo,
  IStaticPath,
  IBackground,
  IGroup,
  IBackgroundImage,
  IPlaceholder,
  ISeparator,
} from "@layerhub-pro/types"
import { LayerType } from "../common/constants"

class ObjectsExporter {
  public export(item: ILayer, options: Required<ILayer>, inGroup = false): ILayer {
    let object
    switch (item.type) {
      case LayerType.STATIC_IMAGE:
        object = this.staticImage(item, options, inGroup)
        break
      case LayerType.IMAGE:
        object = this.image(item, options, inGroup)
        break
      case LayerType.BACKGROUND_IMAGE:
        object = this.backgroundImage(item, options, inGroup)
        break
      case LayerType.STATIC_VIDEO:
        object = this.staticVideo(item, options, inGroup)
        break
      case LayerType.STATIC_TEXT:
        object = this.staticText(item, options, inGroup)
        break
      case LayerType.STATIC_VECTOR:
        object = this.staticVector(item, options, inGroup)
        break
      case LayerType.STATIC_PATH:
        object = this.staticPath(item, options, inGroup)
        break
      case LayerType.PATH:
        object = this.path(item, options, inGroup)
        break
      case LayerType.BACKGROUND:
        object = this.background(item, options, inGroup)
        break
      case LayerType.GROUP.toLowerCase():
        object = this.group(item, options, inGroup)
        break
      case LayerType.STATIC_AUDIO:
        object = this.staticAudio(item, options, inGroup)
        break
      case LayerType.PLACEHOLDER:
        object = this.placeholder(item, options, inGroup)
        break
      case LayerType.SEPARATOR:
        object = this.separator(item, options, inGroup)
        break
      case LayerType.RECT:
        object = this.rect(item, options, inGroup)
        break
      case LayerType.TRIANGLE:
        object = this.triangle(item, options, inGroup)
        break
      case LayerType.LINE:
        object = this.line(item, options, inGroup)
        break
      case LayerType.POLYLINE:
        object = this.polyline(item, options, inGroup)
        break
      case LayerType.OVAL:
        object = this.ellipse(item, options, inGroup)
        break

      default:
        object = this.background(item, options, inGroup)
    }
    return object
  }

  public staticText(item: ILayer, options: Required<ILayer>, inGroup: boolean): IStaticText {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const {
      fontFamily,
      textAlign,
      fontSize,
      charSpacing,
      lineHeight,
      fill,
      text,
      angle,
      underline,
      fontURL,
      metadata,
    } = item as IStaticText
    const object = {
      ...baseOptions,
      charSpacing,
      fill,
      fontFamily,
      fontSize,
      lineHeight,
      text,
      textAlign,
      angle,
      underline,
      fontURL,
      metadata,
    }
    return object
  }

  public staticImage(item: ILayer, options: Required<ILayer>, inGroup: boolean): IStaticImage {
    let clipPathId = item.clipPath && item.clipPath.type === "Placeholder" ? item.clipPath.id : ""
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { src, cropX, cropY, metadata } = item as IStaticImage
    const object = {
      ...baseOptions,
      ...(clipPathId && { clipPathId }),
      src,
      cropX,
      cropY,
      metadata,
    }

    return object
  }

  public image(item: ILayer, options: Required<ILayer>, inGroup: boolean): IStaticImage {
    let clipPathId = item.clipPath && item.clipPath.type === "Placeholder" ? item.clipPath.id : ""
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { src, cropX, cropY, metadata } = item as IStaticImage
    const object = {
      ...baseOptions,
      ...(clipPathId && { clipPathId }),
      src,
      cropX,
      cropY,
      type: "StaticImage",
      metadata: {
        ...metadata,
        resource: "FREE_DRAWING",
      },
    }

    return object
  }

  public staticAudio(item: ILayer, options: Required<ILayer>, inGroup: boolean): IStaticAudio {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { src, metadata } = item as IStaticAudio
    const object: IStaticAudio = {
      ...baseOptions,
      src,
      metadata,
      speedFactor: 1,
    }
    return object
  }

  public separator(item: ILayer, options: Required<ILayer>, inGroup: boolean): ISeparator {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { metadata } = item as ISeparator
    const object = {
      ...baseOptions,
      // @ts-ignore
      fill: item.fill,
      // @ts-ignore
      kind: item.kind,
      metadata,
    }

    return object
  }
  public placeholder(item: ILayer, options: Required<ILayer>, inGroup: boolean): IPlaceholder {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { metadata } = item as IPlaceholder
    const object = {
      ...baseOptions,
      // @ts-ignore
      fill: item.fill,
      metadata,
    }

    return object
  }

  public backgroundImage(item: ILayer, options: Required<ILayer>, inGroup: boolean): IBackgroundImage {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { src, cropX, cropY, metadata } = item as IBackgroundImage
    const object = {
      ...baseOptions,
      src,
      cropX,
      cropY,
      metadata,
    }

    return object
  }

  public staticVideo(item: ILayer, options: Required<ILayer>, inGroup: boolean): IStaticVideo {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { src } = item as IStaticVideo
    const object = {
      ...baseOptions,
      src: src,
      metadata: {},
      speedFactor: 1,
    }
    return object
  }

  public staticVector(item: ILayer, options: Required<ILayer>, inGroup: boolean): IStaticVector {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { src, colorMap, metadata } = item as IStaticVector
    const object = {
      ...baseOptions,
      src,
      colorMap,
      metadata,
    }

    return object
  }

  public staticPath(item: ILayer, options: Required<ILayer>, inGroup: boolean): IStaticPath {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { path, fill, metadata } = item as IStaticPath
    const object = {
      ...baseOptions,
      path,
      fill,
      metadata,
    }

    return object
  }

  public path(item: ILayer, options: Required<ILayer>, inGroup: boolean): IStaticPath {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { path, fill, metadata } = item as IStaticPath
    console.log({ fill })
    const object = {
      ...baseOptions,
      path,
      type: "StaticPath",
      fill,
      metadata: {
        ...metadata,
        resource: "FREE_DRAWING",
      },
    }

    return object
  }

  public background(item: ILayer, options: Required<ILayer>, inGroup: boolean): IBackground {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { fill, metadata } = item as IBackground
    const object = {
      ...baseOptions,
      fill,
      metadata,
    }

    return object
  }

  public rect(item: ILayer, options: Required<ILayer>, inGroup: boolean): ILayer {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { fill, metadata } = item as IStaticPath
    const object = {
      ...baseOptions,
      fill,
      metadata,
    }

    return object
  }

  public triangle(item: ILayer, options: Required<ILayer>, inGroup: boolean): ILayer {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { fill, metadata } = item as IStaticPath
    const object = {
      ...baseOptions,
      fill,
      metadata,
    }

    return object
  }

  public polyline(item: ILayer, options: Required<ILayer>, inGroup: boolean): ILayer {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { fill, points, metadata } = item as any
    const object = {
      ...baseOptions,
      fill,
      metadata,
      points,
    }
    return object
  }

  public line(item: ILayer, options: Required<ILayer>, inGroup: boolean): ILayer {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { fill, metadata, x1, x2, y1, y2 } = item as any
    const object = {
      ...baseOptions,
      fill,
      metadata,
      x1,
      x2,
      y1,
      y2,
    }
    return object
  }

  public ellipse(item: ILayer, options: Required<ILayer>, inGroup: boolean): ILayer {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { fill, metadata, rx, ry } = item as any
    const object = {
      ...baseOptions,
      fill,
      metadata,
      rx,
      ry,
    }
    return object
  }

  public group(item: ILayer, options: Required<ILayer>, inGroup: boolean): IGroup {
    const baseOptions = this.getBaseOptions(item, options, inGroup)
    const { objects, metadata } = item as IGroup
    const groupObjects = objects.map((object) => {
      return this.export(object, options, true)
    })
    return {
      ...baseOptions,
      type: "Group",
      objects: groupObjects,
      metadata,
    }
  }

  public getBaseOptions(item: ILayer, options: Required<ILayer>, inGroup: boolean = false) {
    const {
      id,
      name,
      top,
      left,
      width,
      height,
      scaleX,
      scaleY,
      originX,
      originY,
      type,
      stroke,
      strokeWidth,
      opacity,
      angle,
      flipX,
      flipY,
      skewX,
      skewY,
      shadow,
      preview,
      rx,
      ry,
    } = item as Required<ILayer>
    const baseOptions = {
      id,
      name: name ? name : type,
      angle,
      stroke,
      strokeWidth,
      left: inGroup ? left : left - options.left,
      top: inGroup ? top : top - options.top,
      width,
      height,
      opacity,
      originX,
      originY,
      scaleX,
      scaleY,
      type,
      flipX,
      flipY,
      skewX,
      skewY,
      visible: true,
      shadow,
      preview,
      rx,
      ry,
    }
    return baseOptions
  }
}

export default ObjectsExporter
