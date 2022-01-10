import { Injectable } from '@angular/core';
import { Contact } from '../models/contact.model';
import { Storage } from '@ionic/storage-angular';
import { RandomUserService } from './random-user.service';

const CONTACTS_STORAGE_KEY = 'contacts';
const randomUsersCount: number = 5;
@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(
    private storage: Storage, 
    private randomUserService: RandomUserService) { 
    this.init();
  }

  // Create storage
  async init() {
    await this.storage.create();
  }

  // Converts random user data from api to contact object
  async convertRandomUserToContacts(){
    const results = await this.randomUserService.getResults();
    const contact: Contact = {
      id: this.generateId(),
      name: results[0].name.first + ' ' + results[0].name.last,
      mobileNumber: results[0].cell,
      workNumber: results[0].phone,
      personalEmail: results[0].email,
      workEmail: "",
      photo: results[0].picture.large
    }
    await this.addContact(contact);
  }

  // Populates contacts list from data from API
  async populateContactsList(){
    for(let i:number = 0; i<randomUsersCount; i++){
      await this.convertRandomUserToContacts();
    }
  }

  // Add contact
  async addContact(contact: Contact) {
    const contacts = await this.storage.get(CONTACTS_STORAGE_KEY) || [];
    contacts.push(contact);
    await this.storage.set(CONTACTS_STORAGE_KEY, contacts);
  }

  // Delete contact
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

  // Load contacts from storage
  async getContacts(): Promise<Contact[]> {
    const contacts = await this.storage.get(CONTACTS_STORAGE_KEY) || [];
    if (contacts.length === 0) {
      this.populateContactsList();
    }
    return await this.storage.get(CONTACTS_STORAGE_KEY) || [];
  }

  // Looks for contact by id
  async findContactById(id: string){
    const contacts = await this.storage.get(CONTACTS_STORAGE_KEY);
    const result = contacts.find(contact => contact.id===id);
    return result;
  }

  // Update contact details
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

  // Generates a unique Id for each newly created contact
  generateId(): string{
    const currentTime = Date.now();
    return currentTime.toString();
  }

}
