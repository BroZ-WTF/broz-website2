import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-gallery-edit-picture-dialog',
  templateUrl: './gallery-edit-picture-dialog.component.html',
  styleUrls: ['./gallery-edit-picture-dialog.component.scss']
})
export class GalleryEditPictureDialogComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  pictureForm: FormGroup;
  tagInputCtrl = new FormControl(); // Seperate Form Control for the input that is then written into the chip list and the inputs value discarded, hence not part of the reactive form group
  tags: string[];
  allKnownTags: string[];
  filteredTags: Observable<string[]>;

  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    public editDialogRef: MatDialogRef<GalleryEditPictureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.pictureForm = this.formBuilder.group({
      'name': [this.data.initData.name, [Validators.required, Validators.minLength(this.data.configData.minLengthName), , Validators.maxLength(this.data.configData.maxLengthName)]],
      'file': [this.data.initData.file, [Validators.required, Validators.pattern(this.data.configData.isPictureRegEx)]],
    });
    this.tags = Object.assign([], this.data.initData.tags); // Explicit copy of the tags array to not have the main gallery component display new tags before submit was called
    this.allKnownTags = this.data.configData.allKnownTags;
    this.filteredTags = this.tagInputCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allKnownTags.filter(tag => this.tags.indexOf(tag) === -1))
    );
  }

  ngOnInit(): void { }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.tagInputCtrl.setValue(null);
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagInputCtrl.setValue(null);
  }

  submit() {
    let returnval = this.pictureForm.value;
    returnval['id'] = this.data.initData.id;
    returnval['tags'] = this.tags;
    this.editDialogRef.close(returnval);
  }

  close() {
    this.editDialogRef.close(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allKnownTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0 && this.tags.indexOf(tag) === -1);
  }
}
