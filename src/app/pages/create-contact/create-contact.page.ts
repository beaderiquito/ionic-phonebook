import { Component, OnInit } from '@angular/core';
import { ContactsService } from 'src/app/services/contacts.service';
import { Contact } from 'src/app/models/contact.model';
import { Router } from '@angular/router';
import { PhotoService } from 'src/app/services/photo.service';
import { AlertController } from '@ionic/angular';

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
    private alertController: AlertController
  ) { }

  ngOnInit(): void {
    this.clearFields();
  }

  ionViewDidEnter(): void {
    this.loadPhoto();
  }

	clearFields(): void {
		this.name = "";
    this.mobileNumber = "";
    this.workNumber = "";
    this.personalEmail = "";
    this.workEmail = "";
    this.photo = "";
	}

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

  generateId(): string{
    const currentTime = Date.now();
    return currentTime.toString();
  }

  takePhoto(){
    this.router.navigate(['photo']);
  }

  async loadPhoto(){
    const cachedPhoto = await this.photoService.loadSelectedPhoto();
    if(cachedPhoto.length !== 0){
      this.photo = cachedPhoto.webviewPath;
    }
  }

  async showAlert(){
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Are you sure you want to exit? All unsave changes will be discarded.',
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
