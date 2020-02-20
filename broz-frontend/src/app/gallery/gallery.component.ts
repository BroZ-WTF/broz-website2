import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { API_URL } from '../../env';

import { GalleryAddPictureDialogComponent } from '../gallery/gallery-add-picture-dialog/gallery-add-picture-dialog.component';
import { GalleryDeletePictureDialogComponent } from '../gallery/gallery-delete-picture-dialog/gallery-delete-picture-dialog.component';
import { GalleryEditPictureDialogComponent } from '../gallery/gallery-edit-picture-dialog/gallery-edit-picture-dialog.component';

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

  numer_render_columns: number;
  fullPicturesMetadata;
  picturesMetadata;


  constructor(public dialog: MatDialog, private _http: HttpClient, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.numer_render_columns = Math.ceil(window.innerWidth / 500);
    this.getGalleryMetadataAPI().subscribe(val => {
      this.refreshPictureGrid(val);
      console.log('gallery: GalleryMetadata');
      console.log(val);
    })
  }

  addPicture() {
    const addDialogRef = this.dialog.open(GalleryAddPictureDialogComponent, {
      width: '500px',
    });
    addDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.postPictureAPI(result);
        console.log('gallery: add picture');
        console.log(result);
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
        this.putPictureAPI(result);
        console.log('gallery: edit picture');
        console.log(result);
      }
    });
  }

  deletePicture(element) {
    const deleteDialogRef = this.dialog.open(GalleryDeletePictureDialogComponent, {
      data: { id: element.id, name: element.name, file: element.file, description: element.description }
    });
    deleteDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePictureAPI(result);
        console.log('gallery: delete picture');
        console.log(result);
      }
    });
  }

  onResize(event) {
    this.numer_render_columns = Math.ceil(window.innerWidth / 500);
  }

  getGalleryMetadataAPI() {
    return this._http.get(`${API_URL}/gallery/metadata`)
  }

  postPictureAPI(picture: PictureData) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = picture;
    this._http.post(`${API_URL}/gallery/metadata`, body, { headers }).subscribe(
      (val) => {
        console.log('POST call successful value returned in body', val);
        this.refreshPictureGrid(val);
        this._snackBar.open('Neues Bild angelegt', 'OK', { duration: this.snackbarDuration });
      },
      response => {
        console.log('POST call in error', response);
        this._snackBar.open('ERROR - POST call in error', 'OK', { duration: this.snackbarDuration });
      },
      () => {
        console.log('The POST observable is now completed.');
      }
    );
  }

  putPictureAPI(picture: Picture) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = picture;
    this._http.put(`${API_URL}/gallery/metadata`, body, { headers }).subscribe(
      (val) => {
        console.log('PUT call successful value returned in body', val);
        this.refreshPictureGrid(val);
        this._snackBar.open('Bild erfolgreich editiert', 'OK', { duration: this.snackbarDuration });
      },
      response => {
        console.log('PUT call in error', response);
        this._snackBar.open('ERROR - PUT call in error', 'OK', { duration: this.snackbarDuration });
      },
      () => {
        console.log('The PUT observable is now completed.');
      }
    );
  }

  deletePictureAPI(picture: Picture) {
    this._http.delete(`${API_URL}/gallery/metadata/${picture.id}`).subscribe(
      (val) => {
        console.log('DELETE call successful value returned in body', val);
        this.refreshPictureGrid(val);
        this._snackBar.open('Bild erfolgreich gelöscht', 'OK', { duration: this.snackbarDuration });
      },
      response => {
        console.log('DELETE call in error', response);
        this._snackBar.open('ERROR - DELETE call in error', 'OK', { duration: this.snackbarDuration });
      },
      () => {
        console.log('The DELETE observable is now completed.');
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
