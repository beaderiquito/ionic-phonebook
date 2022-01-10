import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from 'src/app/models/contact.model';
import { ContactsService } from 'src/app/services/contacts.service';
import { RandomUserService } from 'src/app/services/random-user.service';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.page.html',
  styleUrls: ['./contacts-list.page.scss'],
})
export class ContactsListPage {
  public data;
  public searchTerm:string = "";
  public contacts: Contact[];
  public PLACEHOLDER ='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  constructor(
    private contactsService: ContactsService, 
    private router: Router,
    private randomUserService: RandomUserService) {  }

  // Gets contacts when view is entered
  async ionViewDidEnter(){
    await this.getContacts();
  }

  // Loads all contacts
  async getContacts(){
    this.contactsService.getContacts()
    .then( (contacts) => {
      this.contacts = contacts.sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    })
    .catch( (err) => { console.log(err)});
  }

  // Search bar functionality
  async search(){
    if(!this.searchTerm){
      this.getContacts();
    } 
    else {
      this.contactsService.getContacts()
      .then( (contacts) => {
        this.contacts = contacts.filter((contact) => {
          return contact.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        });
        console.log('Contacts successfully loaded.');
      })
      .catch( (err) => { console.log(err)});
    }
  }

  // Deletes contact
  async deleteContact(contact: Contact, slidingItem){ 
    await this.contactsService.deleteContact(contact.id);
    slidingItem.close;
    this.getContacts();
  }

  // Navigates to create-contact page
  async createContact(){
    await this.router.navigate(['create-contact']);
  }

  // Select contact
  async viewContact(id: string){
    await this.router.navigate(['contacts/', id]);
  }
}
