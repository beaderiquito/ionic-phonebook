import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Contact } from 'src/app/models/contact.model';
import { ContactsService } from 'src/app/services/contacts.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.page.html',
  styleUrls: ['./edit-contact.page.scss'],
})
export class EditContactPage implements OnInit {
  public PLACEHOLDER ='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  constructor(
    private contactsService: ContactsService, 
    private route: ActivatedRoute, 
    private router: Router,
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController) { }
  
  public id:string = "";
  public contact: Contact;
  public name: string = "";
  public mobileNumber: string = "";
  public workNumber: string = "";
  public personalEmail: string = "";
  public workEmail: string = "";
  public photo: string = "";

  ngOnInit() {
    // Get contact id
    this.id = this.route.snapshot.paramMap.get('id');
    this.getContact(this.id);
    this.loadPhoto();
  }

  // Load photo saved in storage from photo page
  ionViewDidEnter(){
    this.loadPhoto();
  }

  // Load contact details
  getContact(id: string){
    this.contactsService.findContactById(id)
    .then(contact => {
      this.contact = contact;
      this.loadPhoto();
      this.setValues(this.contact);
      console.log('Contact successfully loaded.');
    })
    .catch(err => { console.log(err)});
  }

  // Set values of input to that of contact details
  setValues(contact: Contact){
    this.name = contact.name;
    this.mobileNumber = contact.mobileNumber;
    this.workNumber = contact.workNumber;
    this.personalEmail = contact.personalEmail;
    this.workEmail = contact.workEmail;
    this.photo = contact.photo;
  }
  
  // Save edit
  save(){
    const editedContact:Contact = {
      id: this.id,
      name: this.name,
      mobileNumber: this.mobileNumber,
      workNumber: this.workNumber,
      personalEmail: this.personalEmail,
      workEmail: this.workEmail,
      photo: this.photo
    }
    this.contactsService.updateContact(editedContact);
    this.photoService.clearSelectedPhoto();
    this.router.navigate(['contacts-list']);
  }

  // Navigate to photo page
  takePhoto(){
    this.router.navigate(['photo', this.id]);
  }

  // Load photo saved in storage from photo page
  async loadPhoto(){
    const cachedPhoto = await this.photoService.loadSelectedPhoto();
    if(cachedPhoto.length !== 0){
      this.photo = cachedPhoto.webviewPath;
    }
    else if(this.contact.photo){
      this.photo = this.contact.photo;
    }
  }

  // Show action sheet upon selecting a photo
  public async showActionSheet(){
    const actionSheet = await this.actionSheetController.create({
      header: 'Photo Gallery',
      buttons: [{
        text: 'Edit photo',
        icon: 'create',
        handler: () => {
          this.takePhoto();
        }
      }, {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deletePhoto();
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

  // Delete contact photo
  deletePhoto(){
    this.photo = "";
  }

  // Show alert when user clicks 'go back' button
  async showAlert(){
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Are you sure you want to exit? All unsaved changes will be discarded.',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          //Nothing to do, action sheet is automatically closed
        }
      },{
        text: 'Proceed',
        handler: () => {
          this.photoService.clearSelectedPhoto();
          this.setValues(this.contact);
          this.router.navigate(['contacts-list']);
        }
      }
    ]
    });
    await alert.present();
  }

}
