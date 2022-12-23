import { IFrame } from "@layerhub-pro/types"
import axios, { AxiosInstance } from "axios"
import { IComponent, IDesign } from "~/interfaces/DesignEditor"
import { IFontFamily, IUpload, Resource } from "~/interfaces/editor"

class ApiService {
  base: AxiosInstance
  constructor() {
    this.base = axios.create({
      baseURL: "/api",
      withCredentials: true,
    })
  }

  // UPLOADS
  getSignedURLForUpload(props: { filename: string }): Promise<string> {
    return new Promise((resolve, reject) => {
      this.base
        .post("/uploads", props)
        .then(({ data }) => {
          resolve(data.url)
        })
        .catch((err) => reject(err))
    })
  }

  updateUploadFile(props: { filename: string }): Promise<IUpload> {
    return new Promise((resolve, reject) => {
      this.base
        .put("/uploads", props)
        .then(({ data }) => {
          resolve(data.upload)
        })
        .catch((err) => reject(err))
    })
  }

  getUploads(): Promise<IUpload[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.base.get("/uploads")
        resolve(data.uploads)
      } catch (err) {
        reject(err)
      }
    })
  }

  deleteUpload(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.base.delete(`/uploads/${id}`)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  getPublicComponentById(id: string): Promise<IComponent> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.base.get(`/components/published/${id}`)
        resolve(data.component)
      } catch (err) {
        reject(err)
      }
    })
  }

  getPublicComponents(): Promise<IComponent[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.base.get("/components/published")
        resolve(data.components)
      } catch (err) {
        reject(err)
      }
    })
  }

  // DESIGNS

  getPublicDesigns(): Promise<IDesign[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.base.get("/templates/published")
        resolve(data.templates)
      } catch (err) {
        reject(err)
      }
    })
  }

  getPublicDesignById(id: string): Promise<IDesign> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.base.get(`/templates/published/${id}`)
        resolve(data.template)
      } catch (err) {
        reject(err)
      }
    })
  }

  // frames

  getFrames(): Promise<IFrame[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.base.get("/frames")
        resolve(data.frames)
      } catch (err) {
        reject(err)
      }
    })
  }

  // ELEMENTS
  getElements(): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.base.get("/elements")
        resolve(data)
      } catch (err) {
        reject(err)
      }
    })
  }

  // FONTS
  getFonts(): Promise<IFontFamily[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.base.get("/fonts")
        resolve(data.fonts)
      } catch (err) {
        reject(err)
      }
    })
  }

  getPixabayImages = (props: { query: string; perPage: number; page: number }): Promise<Resource[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.base.get(
          `resources/pixabay/images?page=${props.page}&per_page=${props.perPage}&query=${props.query}`
        )
        resolve(data.images)
      } catch (err) {
        reject(err)
      }
    })
  }

  getPexelsVideos = (props: { query: string; perPage: number; page: number }): Promise<Resource[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.base.get(
          `resources/pexels/videos?page=${props.page}&per_page=${props.perPage}&query=${props.query}`
        )
        resolve(data.videos)
      } catch (err) {
        reject(err)
      }
    })
  }

  getPixabayVideos = (props: { query: string; perPage: number; page: number }): Promise<Resource[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await this.base.get(
          `resources/pixabay/videos?page=${props.page}&per_page=${props.perPage}&query=${props.query}`
        )
        resolve(data.videos)
      } catch (err) {
        reject(err)
      }
    })
  }
}

export default new ApiService()
