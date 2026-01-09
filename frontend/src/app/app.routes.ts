import { Routes } from '@angular/router';
import { MenuGeneratorComponent } from './menu-generator/menu-generator.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { ShareWhatsappComponent } from './share-whatsapp/share-whatsapp.component';

export const routes: Routes = [
  { path: '', component: MenuGeneratorComponent },
  { path: 'menu', component: MenuListComponent },
  { path: 'share', component: ShareWhatsappComponent },
];
