import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import PictureMetadata from 'src/assets/gallery/gallery.json';

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
  allPictures: Picture[] = [];

  constructor(private httpService: HttpClient) {
  }

  ngOnInit(): void {
    for (const picture of PictureMetadata.pictures) {
      picture.file = 'assets/gallery/' + picture.file;
      this.allPictures.push(picture);
    }
    console.log(this.allPictures)
    this.numer_render_columns = Math.ceil(window.innerWidth / 500);

    this.httpService.get('./assets/gallery/gallery.json').subscribe(
      data => {
        console.log(data);
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }

  onResize(event) {
    this.numer_render_columns = Math.ceil(window.innerWidth / 500);
  }

}
