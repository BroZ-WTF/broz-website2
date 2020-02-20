import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-gallery-add-picture-dialog',
  templateUrl: './gallery-add-picture-dialog.component.html',
  styleUrls: ['./gallery-add-picture-dialog.component.css']
})
export class GalleryAddPictureDialogComponent implements OnInit {
  pictureForm = this.formBuilder.group({
    'name': [null, [Validators.required, Validators.maxLength(12)]],
    'description': [null, [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    'file': [null, [Validators.required, Validators.pattern(
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+\/+[-_a-zA-Z0-9]+((\.jpg)|(\.png)|(\.gif))$/
    )]],
  });

  constructor(
    private formBuilder: FormBuilder,
    public addDialogRef: MatDialogRef<GalleryAddPictureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void { }

  submit() {
    this.addDialogRef.close(this.pictureForm.value);
  }

  close() {
    this.addDialogRef.close(null);
  }
}
