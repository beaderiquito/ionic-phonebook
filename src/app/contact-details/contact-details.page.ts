import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.page.html',
  styleUrls: ['./contact-details.page.scss'],
})
export class ContactDetailsPage implements OnInit {
  public PLACEHOLDER ='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  constructor() { }

  ngOnInit() {
  }

}
