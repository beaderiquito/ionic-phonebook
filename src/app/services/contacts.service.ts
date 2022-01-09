import { Injectable } from '@angular/core';
import { Contact } from '../models/contact.model';
import { Storage } from '@ionic/storage-angular';

const CONTACTS_STORAGE_KEY = 'contacts';
@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private storage: Storage) { 
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  async addContact(contact: Contact) {
    const contacts = await this.storage.get(CONTACTS_STORAGE_KEY) || [];
    contacts.push(contact);
    return this.storage.set(CONTACTS_STORAGE_KEY, contacts);
  }

  async deleteContact(id: string){
    const contacts = await this.storage.get(CONTACTS_STORAGE_KEY);
    const newContacts: Contact[] = [];
    for(let contact of contacts){
      if(contact.id !== id){
        newContacts.push(contact);
      }
    }
    this.storage.set(CONTACTS_STORAGE_KEY, newContacts);
  }

  async getContacts(): Promise<Contact[]> {
    return await this.storage.get(CONTACTS_STORAGE_KEY) || [];
  }

  async findContactById(id: string){
    const contacts = await this.storage.get(CONTACTS_STORAGE_KEY);
    const result = contacts.find(contact => contact.id===id);
    return result;
  }

  async updateContact(newContact: Contact): Promise<Contact[]>{
    const contacts = await this.getContacts();
    let newContacts: Contact[] = [];
    for(let oldContact of contacts){
      if(oldContact.id === newContact.id){
        newContacts.push(newContact);
      }
      else {
        newContacts.push(oldContact);
      }
    }
    return this.storage.set(CONTACTS_STORAGE_KEY, newContacts);
  }

}
