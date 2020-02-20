import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
  numer_render_columns: number;
  fullPicturesMetadata;
  picturesMetadata;


  constructor(public dialog: MatDialog, private http: HttpClient) { }

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
        this.putPictureAPI(element.id);
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
    return this.http.get(`${API_URL}/gallery/metadata`)
  }

  postPictureAPI(picture: PictureData) {

  }

  putPictureAPI(picture: Picture) {

  }

  deletePictureAPI(picture: Picture) {

  }

  refreshPictureGrid(val: any) {
    this.fullPicturesMetadata = val;
    this.picturesMetadata = this.fullPicturesMetadata.pictures;
    for (let ii = 0; ii < this.picturesMetadata.length; ii++) {
      this.picturesMetadata[ii].id = ii;
      // TODO Check whether online resource or own server resource
      this.picturesMetadata[ii].file = `${API_URL}/gallery/picture/` + this.picturesMetadata[ii].file;
    }
  }
}
