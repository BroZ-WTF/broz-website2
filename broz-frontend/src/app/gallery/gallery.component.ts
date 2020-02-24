import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { NGXLogger } from 'ngx-logger';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { GalleryAddPictureDialogComponent } from '../gallery/gallery-add-picture-dialog/gallery-add-picture-dialog.component';
import { GalleryDeletePictureDialogComponent } from '../gallery/gallery-delete-picture-dialog/gallery-delete-picture-dialog.component';
import { GalleryEditPictureDialogComponent } from '../gallery/gallery-edit-picture-dialog/gallery-edit-picture-dialog.component';

import { environment } from 'src/environments/environment';


export interface Picture {
  id: number,
  name: string,
  description: string,
  file: string,
}

export interface PictureData {
  name: string,
  description: string,
  file: string,
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})

export class GalleryComponent implements OnInit {
  snackbarDuration = 3 * 1000; // ms
  baseUrl = environment.baseUrl + '/gallery';

  numer_render_columns: number;
  fullPicturesMetadata;
  picturesMetadata;


  constructor(private logger: NGXLogger, public dialog: MatDialog, private _http: HttpClient, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.numer_render_columns = Math.ceil(window.innerWidth / 500);
    this.logger.debug('gallery.component: query gallery metadata.');
    this.getGalleryMetadataAPI();
  }

  addPicture() {
    const addDialogRef = this.dialog.open(GalleryAddPictureDialogComponent, {
      width: '500px',
    });
    addDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logger.debug('gallery.component: add form result:', result);
        this.postPictureAPI(result);
      }
    });
  }

  editPicture(element) {
    const editDialogRef = this.dialog.open(GalleryEditPictureDialogComponent, {
      width: '500px',
      data: { id: element.id, name: element.name, file: element.file, description: element.description }
    });
    editDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logger.debug('gallery.component: edit form result:', result);
        this.putPictureAPI(result);
      }
    });
  }

  deletePicture(element) {
    const deleteDialogRef = this.dialog.open(GalleryDeletePictureDialogComponent, {
      data: { id: element.id, name: element.name, file: element.file, description: element.description }
    });
    deleteDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logger.debug('gallery.component: delete form result:', result);
        this.deletePictureAPI(result);
      }
    });
  }

  onResize(event) {
    this.numer_render_columns = Math.ceil(window.innerWidth / 500);
  }

  getGalleryMetadataAPI() {
    return this._http.get(this.baseUrl + '/metadata').subscribe(
      (val) => {
        this.logger.log('gallery.component: GET request: all gallery metadata val:', val);
        this.refreshPictureGrid(val);
      },
      response => {
        this.logger.error('gallery.component: GET request error: response:', response);
      },
      () => {
        this.logger.debug('gallery.component: GET observable completed.');
      }
    );
  }

  postPictureAPI(picture: PictureData) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = picture;
    this._http.post(this.baseUrl + '/metadata', body, { headers }).subscribe(
      (val) => {
        this.logger.log('gallery.component: POST request: all gallery metadata val:', val);
        this.refreshPictureGrid(val);
        this._snackBar.open('Neues Bild angelegt', 'OK', { duration: this.snackbarDuration });
      },
      response => {
        this.logger.error('gallery.component: POST request error: response:', response);
        this._snackBar.open('ERROR - POST call in error', 'OK', { duration: this.snackbarDuration });
      },
      () => {
        this.logger.debug('gallery.component: POST observable completed.');
      }
    );
  }

  putPictureAPI(picture: Picture) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = picture;
    this._http.put(this.baseUrl + '/metadata', body, { headers }).subscribe(
      (val) => {
        this.logger.log('gallery.component: PUT request: all gallery metadata val:', val);
        this.refreshPictureGrid(val);
        this._snackBar.open('Bild erfolgreich editiert', 'OK', { duration: this.snackbarDuration });
      },
      response => {
        this.logger.error('gallery.component: PUT request error: response:', response);
        this._snackBar.open('ERROR - PUT call in error', 'OK', { duration: this.snackbarDuration });
      },
      () => {
        this.logger.debug('gallery.component: PUT observable completed.');
      }
    );
  }

  deletePictureAPI(picture: Picture) {
    const delUrl = this.baseUrl + `/metadata/${picture.id}`;
    this._http.delete(delUrl).subscribe(
      (val) => {
        this.logger.log('gallery.component: DELETE request: all gallery metadata val:', val);
        this.refreshPictureGrid(val);
        this._snackBar.open('Bild erfolgreich gelöscht', 'OK', { duration: this.snackbarDuration });
      },
      response => {
        this.logger.error('gallery.component: DELETE request error: response:', response);
        this._snackBar.open('ERROR - DELETE call in error', 'OK', { duration: this.snackbarDuration });
      },
      () => {
        this.logger.debug('gallery.component: DELETE observable completed.');
      }
    );
  }

  refreshPictureGrid(val: any) {
    this.fullPicturesMetadata = val;
    this.picturesMetadata = this.fullPicturesMetadata.pictures;
    for (let ii = 0; ii < this.picturesMetadata.length; ii++) {
      this.picturesMetadata[ii].id = ii;
    }
  }
}
