import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateContactPageRoutingModule } from './create-contact-routing.module';

import { CreateContactPage } from './create-contact.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateContactPageRoutingModule
  ],
  declarations: [CreateContactPage]
})
export class CreateContactPageModule {}
