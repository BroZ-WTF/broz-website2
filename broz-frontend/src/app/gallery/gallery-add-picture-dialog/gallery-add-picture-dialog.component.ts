import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-gallery-add-picture-dialog',
  templateUrl: './gallery-add-picture-dialog.component.html',
  styleUrls: ['./gallery-add-picture-dialog.component.css']
})
export class GalleryAddPictureDialogComponent implements OnInit {
  pictureForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public addDialogRef: MatDialogRef<GalleryAddPictureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.pictureForm = this.formBuilder.group({
      'name': ['', [Validators.required, Validators.minLength(this.data.configData.minLengthName), , Validators.maxLength(this.data.configData.maxLengthName)]],
      'description': ['', [Validators.required, Validators.maxLength(this.data.configData.maxLengthDescription)]],
      'file': ['', [Validators.required, Validators.pattern(this.data.configData.isPictureRegEx)]],
    });
  }

  ngOnInit(): void { }

  submit() {
    this.addDialogRef.close(this.pictureForm.value);
  }

  close() {
    this.addDialogRef.close(null);
  }
}
