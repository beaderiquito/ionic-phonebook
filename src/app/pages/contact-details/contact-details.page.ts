import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contact } from 'src/app/models/contact.model';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.page.html',
  styleUrls: ['./contact-details.page.scss'],
})
export class ContactDetailsPage implements OnInit {
  public PLACEHOLDER ='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  public id:string = "";
  public contact:Contact;
  constructor(private route: ActivatedRoute, private contactsService: ContactsService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.contact = this.getContact(this.id);
  }

  getContact(id: string){
    return this.contactsService.findContactById(id);
  }

}
