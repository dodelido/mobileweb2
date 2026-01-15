import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Preferences } from '@capacitor/preferences'
import { ref } from 'vue'

export interface UserPhoto {
  filepath: string
  webviewPath?: string
}

const PHOTO_STORAGE = 'photos'

export function usePhotoGallery() {
  const photos = ref<UserPhoto[]>([])

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    })

    const savedFileImage = await savePicture(photo)

    photos.value = [savedFileImage, ...photos.value]

    Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value)
    })
  }

  const savePicture = async (photo: any): Promise<UserPhoto> => {
    const response = await fetch(photo.webPath!)
    const blob = await response.blob()
    const base64Data = await convertBlobToBase64(blob)

    const fileName = new Date().getTime() + '.jpeg'

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data as string,
      directory: Directory.Data
    })

    return {
      filepath: fileName,
      webviewPath: photo.webPath
    }
  }

  const convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = reject
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    }
 )

    const loadSaved = async () => {
        const photoList = await Preferences.get({ key: PHOTO_STORAGE })
        photos.value = photoList.value ? JSON.parse(photoList.value) : []
      
        for (const photo of photos.value) {
          const file = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data
          })
      
          photo.webviewPath = `data:image/jpeg;base64,${file.data}`
        }
      }
      
  return {
    photos,
    takePhoto,
    loadSaved
  }
}
