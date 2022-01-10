import { Component, OnInit } from '@angular/core';
import { ContactsService } from 'src/app/services/contacts.service';
import { Contact } from 'src/app/models/contact.model';
import { Router } from '@angular/router';
import { PhotoService } from 'src/app/services/photo.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.page.html',
  styleUrls: ['./create-contact.page.scss'],
})
export class CreateContactPage implements OnInit{
  public PLACEHOLDER ='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  public name: string = "";
  public mobileNumber: string = "";
  public workNumber: string = "";
  public personalEmail: string = "";
  public workEmail: string = "";
  public photo: string = ""; 

  constructor(
    private router: Router,
    private contactsService: ContactsService,
    private photoService: PhotoService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  // Clears all fields on initialization
  ngOnInit(): void {
    this.clearFields();
  }

  // Loads user photo every time view is entered
  ionViewDidEnter(): void {
    this.loadPhoto();
  }

  // Clears all fields
	clearFields(): void {
		this.name = "";
    this.mobileNumber = "";
    this.workNumber = "";
    this.personalEmail = "";
    this.workEmail = "";
    this.photo = "";
	}

  // Saves new contact and navigates back to contacts-list
  addContact(){
    const newId = this.generateId();
    const newContact: Contact = {
      id: newId, 
      name: this.name,
      mobileNumber: this.mobileNumber,
      workNumber: this.workNumber,
      personalEmail: this.personalEmail,
      workEmail: this.workEmail,
      photo: this.photo
    };
    this.contactsService.addContact(newContact);
	  this.clearFields();
    this.photoService.clearSelectedPhoto();
    this.router.navigate(['contacts-list']);
  }

  // Generates a unique Id for each newly created contact
  generateId(): string{
    const currentTime = Date.now();
    return currentTime.toString();
  }

  // Navigate to photo page
  takePhoto(){
    this.router.navigate(['photo']);
  }

  // Loads photo saved in storage from photo page
  async loadPhoto(){
    const cachedPhoto = await this.photoService.loadSelectedPhoto();
    if(cachedPhoto.length !== 0){
      this.photo = cachedPhoto.webviewPath;
    }
  }

  // Alert when user clicks 'go back' button
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
          this.clearFields();
          this.router.navigate(['contacts-list']);
          
        }
      }
    ]
    });
    await alert.present();
  }

}
