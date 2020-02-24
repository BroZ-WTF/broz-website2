import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { environment } from '../environments/environment';

import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe, 'de-DE');

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverviewComponent } from './overview/overview.component';
import { GalleryComponent } from './gallery/gallery.component';
import { QuotesComponent, } from './quotes/quotes.component';
import { QuotesAddQuoteDialogComponent } from './quotes/quotes-add-quote-dialog/quotes-add-quote-dialog.component';
import { QuotesEditQuoteDialogComponent } from './quotes/quotes-edit-quote-dialog/quotes-edit-quote-dialog.component';
import { QuotesDeleteQuoteDialogComponent } from './quotes/quotes-delete-quote-dialog/quotes-delete-quote-dialog.component';
import { GalleryAddPictureDialogComponent } from './gallery/gallery-add-picture-dialog/gallery-add-picture-dialog.component';
import { GalleryDeletePictureDialogComponent } from './gallery/gallery-delete-picture-dialog/gallery-delete-picture-dialog.component';
import { GalleryEditPictureDialogComponent } from './gallery/gallery-edit-picture-dialog/gallery-edit-picture-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    GalleryComponent,
    QuotesComponent,
    QuotesAddQuoteDialogComponent,
    QuotesEditQuoteDialogComponent,
    QuotesDeleteQuoteDialogComponent,
    GalleryAddPictureDialogComponent,
    GalleryDeletePictureDialogComponent,
    GalleryEditPictureDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    MatTabsModule,
    MatToolbarModule,
    MatGridListModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    LoggerModule.forRoot({
      level: !environment.production ? NgxLoggerLevel.DEBUG : NgxLoggerLevel.ERROR,// serverLogLevel
      serverLogLevel: NgxLoggerLevel.OFF
    })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'de_DE' },
    { provide: MAT_DATE_LOCALE, useValue: 'de_DE' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
