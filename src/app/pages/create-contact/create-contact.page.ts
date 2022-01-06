import { Component, OnInit } from '@angular/core';
import { ContactsService } from 'src/app/services/contacts.service';
import { Contact } from 'src/app/models/contact.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.page.html',
  styleUrls: ['./create-contact.page.scss'],
})
export class CreateContactPage {
  public name: string = "";
  public mobileNumber: string = "";
  public workNumber: string = "";
  public personalEmail: string = "";
  public workEmail: string = "";

  public PLACEHOLDER ='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  constructor(
    private router: Router,
    private contactsService: ContactsService
  ) { }

  addContact(){
    const newId = this.generateId();
    const newContact: Contact = {
      id: newId, 
      name: this.name,
      mobileNumber: this.mobileNumber,
      workNumber: this.workNumber,
      personalEmail: this.personalEmail,
      workEmail: this.workEmail
    };
    this.contactsService.saveContact(newContact);
    this.router.navigate(['/home']);
  }

  generateId(): string{
    const currentTime = Date.now();
    return currentTime.toString();
  }

}
