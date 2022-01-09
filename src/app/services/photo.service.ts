import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@ionic/storage';
import { UserPhoto } from '../models/userPhoto.model';

const PHOTOS_STORAGE_KEY: string = 'photos';
const SELECTED_PHOTO_STORAGE_KEY: string = 'selectedPhoto';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  
  constructor(private storage: Storage) {
    this.init();
  }

  async init(){
    await this.storage.create();
  }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    // Save the picture and add it to photo collection
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    // Save photos gallery
    this.storage.set(PHOTOS_STORAGE_KEY, this.photos);
  }

  private async savePicture(photo: Photo){
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    //Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    // Use webPath to display the new Image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }

  // Reads photo as base64 data
  private async readAsBase64(photo: Photo){
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }

  // Converts blob to base64 data
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadSaved(){
    // Retrieve photo array data
    const photoList =  await this.storage.get(PHOTOS_STORAGE_KEY) || [];
    this.photos = photoList;

    // Display the photo by reading into base64 format
    for (let photo of this.photos) {
      // Read each saved photo's data from the Filesystem
      const readFile  = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });
      
      // Web platform only: Load the photo as base64 data
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }

  public async clearSavedPhotos(){
    await this.storage.remove(PHOTOS_STORAGE_KEY);
  }

  public async saveSelectedPhoto(photo: UserPhoto){
    this.storage.set(SELECTED_PHOTO_STORAGE_KEY, photo);
  }

  public async loadSelectedPhoto(){
    return await this.storage.get(SELECTED_PHOTO_STORAGE_KEY) || [];
  }

  public async clearSelectedPhoto(){
    await this.storage.remove(SELECTED_PHOTO_STORAGE_KEY);
  }

  public async deletePhoto(photo: UserPhoto, position: number){
    // Remove this photo from the Photos reference data array
    this.photos.splice(position, 1);

    // Update photos array cache by overwriting the existing photo array
    this.storage.set(PHOTOS_STORAGE_KEY, this.photos);

    // Delete photo file from the filesystem
    const filename = photo.filepath.substring(photo.filepath.lastIndexOf('/')+1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    });
  }
}
