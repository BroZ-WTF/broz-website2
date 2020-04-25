import { Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { GalleryComponent } from './gallery/gallery.component';
import { QuotesComponent, } from './quotes/quotes.component';

const appRoutes: Routes = [
  {
    path: 'home',
    component: OverviewComponent,
    data: {
      icon: 'home',
      title: 'Überblick',
    }
  },
  {
    path: 'quotes',
    component: QuotesComponent,
    data: {
      icon: 'sms',
      title: 'Zitate'
    }
  },
  {
    path: 'gallery',
    component: GalleryComponent,
    data: {
      icon: 'collections',
      title: 'Galerie'
    }
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];
export default appRoutes;
