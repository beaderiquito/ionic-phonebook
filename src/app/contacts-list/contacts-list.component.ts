import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss'],
})
export class ContactsListComponent implements OnInit {
  public BLANK_AVATAR ='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  constructor() { }

  ngOnInit() {}

}
