import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-gallery-edit-picture-dialog',
  templateUrl: './gallery-edit-picture-dialog.component.html',
  styleUrls: ['./gallery-edit-picture-dialog.component.scss']
})
export class GalleryEditPictureDialogComponent implements OnInit {
  pictureForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public editDialogRef: MatDialogRef<GalleryEditPictureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.pictureForm = this.formBuilder.group({
      'name': [this.data.initData.name, [Validators.required, Validators.minLength(this.data.configData.minLengthName), , Validators.maxLength(this.data.configData.maxLengthName)]],
      'tags': [this.data.initData.tags, [Validators.required, Validators.maxLength(this.data.configData.maxLengthTags)]],
      'file': [this.data.initData.file, [Validators.required, Validators.pattern(this.data.configData.isPictureRegEx)]],
    });
  }

  ngOnInit(): void { }

  submit() {
    let returnval = this.pictureForm.value;
    returnval['id'] = this.data.initData.id;
    this.editDialogRef.close(returnval);
  }

  close() {
    this.editDialogRef.close(null);
  }

}
