import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../../env';

export interface Picture {
  name: string;
  description: string,
  file: string;
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


  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.numer_render_columns = Math.ceil(window.innerWidth / 500);
    this.getGalleryMetadata().subscribe(val => {
      this.fullPicturesMetadata = val;
      this.picturesMetadata = this.fullPicturesMetadata.pictures;
      for (const picture of this.picturesMetadata) {
        picture.file = `${API_URL}/gallery/picture/` + picture.file;
      }
      console.log('gallery: GalleryMetadata');
      console.log(val);
    })
  }

  onResize(event) {
    this.numer_render_columns = Math.ceil(window.innerWidth / 500);
  }

  getGalleryMetadata() {
    return this.http.get(`${API_URL}/gallery/metadata`)
  }

}
