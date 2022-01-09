import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'contacts-list',
    pathMatch: 'full'
  },
  {
    path: 'create-contact',
    loadChildren: () => import('./pages/create-contact/create-contact.module').then( m => m.CreateContactPageModule)
  },
  {
    path: 'contacts-list',
    loadChildren: () => import('./pages/contacts-list/contacts-list.module').then( m => m.ContactsListPageModule)
  },
  {
    path: 'contacts/:id',
    loadChildren: () => import('./pages/edit-contact/edit-contact.module').then( m => m.EditContactPageModule)
  },
  {
    path: 'photo/:id',
    loadChildren: () => import('./pages/photo/photo.module').then( m => m.PhotoPageModule)
  },
  {
    path: 'photo',
    loadChildren: () => import('./pages/photo/photo.module').then( m => m.PhotoPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
