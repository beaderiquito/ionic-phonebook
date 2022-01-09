import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPhoto } from 'src/app/models/userPhoto.model';
import { PhotoService } from 'src/app/services/photo.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {
  public id: string = '';
  
  constructor(public photoService: PhotoService,
    public route: ActivatedRoute,
    private router: Router,
    public actionSheetController: ActionSheetController) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
    await this.photoService.loadSaved();
  }

  addPhotoToGallery(){
    this.photoService.addNewToGallery();
  }

  selectPhoto(photo: UserPhoto){
    this.photoService.saveSelectedPhoto(photo);
    this.goBack();
  }

  public async showActionSheet(photo: UserPhoto, position: number){
    const actionSheet = await this.actionSheetController.create({
      header: 'Photo Gallery',
      buttons: [{
        text: 'Select',
        icon: 'person-circle-outline',
        handler: () => {
          this.selectPhoto(photo);
        }
      }, {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePhoto(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          //Nothing to do, action sheet is automatically closed
        }
      }]
    });
    await actionSheet.present();
  }

  goBack(){
    if(this.id === null){
      this.router.navigate(['create-contact']);
    }
    else{
      this.router.navigate(['contacts/' + this.id])
    }
  }

}
