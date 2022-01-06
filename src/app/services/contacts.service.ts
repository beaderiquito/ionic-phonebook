import { Injectable } from '@angular/core';
import { Contact } from '../models/contact.model';
import { CONTACTS } from '../mock-data/mock-contacts';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private contacts: Contact[] = [];

  constructor(private storage: Storage) {
    this.init();
    this.contacts = CONTACTS;
  }

  init() {
    this.storage.create();
  }

  public saveContact(contact: Contact): void {
    this.contacts.push(contact);
    this.setContacts();
  }

  async setContacts(): Promise<void> {
    await this.storage.set('contacts', this.contacts);
  }

  async getContacts(): Promise<Contact[]> {
    this.contacts = await this.storage.get('contacts');
    return this.contacts;
  }

  public findContactById(id: string){
    const result = this.contacts.find(contact => contact.id===id);
    return result;
  }
}
