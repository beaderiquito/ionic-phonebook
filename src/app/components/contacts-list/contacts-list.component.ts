import { Component, OnInit } from '@angular/core';
import { Contact } from '../../models/contact.model';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss'],
})
export class ContactsListComponent implements OnInit {
  public PLACEHOLDER ='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  public contacts: Contact[] = [];

  constructor(private contactsService: ContactsService) { }

  ngOnInit(){
    this.contactsService.setContacts();
    this.getContacts();
  }

  getContacts(){
    this.contactsService.getContacts()
    .then(contacts => {
      this.contacts = contacts;
      console.log('Contacts successfully loaded.');
    })
    .catch(err => { console.log(err)});
  }
}
