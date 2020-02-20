import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-gallery-delete-picture-dialog',
  templateUrl: './gallery-delete-picture-dialog.component.html',
  styleUrls: ['./gallery-delete-picture-dialog.component.css']
})
export class GalleryDeletePictureDialogComponent implements OnInit {

  constructor(
    public deleteDialogRef: MatDialogRef<GalleryDeletePictureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  delete(): void {
    this.deleteDialogRef.close(this.data);
  }

  close(): void {
    this.deleteDialogRef.close(null);
  }
}
