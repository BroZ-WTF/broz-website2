import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-quotes-edit-quote-dialog',
  templateUrl: './quotes-edit-quote-dialog.component.html',
  styleUrls: ['./quotes-edit-quote-dialog.component.scss']
})
export class QuotesEditQuoteDialogComponent implements OnInit {
  public quoteForm: FormGroup;

  visibilitySteps = [
    { value: 0, name: 'Alle' },
    { value: 2, name: 'Bro' },
    { value: 3, name: 'Admin' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    public editDialogRef: MatDialogRef<QuotesEditQuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.quoteForm = this.formBuilder.group({
      'name': [this.data.initData.name, [Validators.required, Validators.minLength(this.data.configData.minLengthName), Validators.maxLength(this.data.configData.maxLengthName)]],
      'quote': [this.data.initData.quote, [Validators.required, Validators.minLength(this.data.configData.minLengthName), Validators.maxLength(this.data.configData.maxLengthQuote)]],
      'date': [this.data.initData.date, Validators.required],
      'visibility': [this.data.initData.visibility, Validators.required]
    });
  }

  ngOnInit(): void { };

  submit() {
    let returnval = this.quoteForm.value;
    console.log(this.quoteForm.value);
    returnval['id'] = this.data.initData.id;
    this.editDialogRef.close(returnval);
  }

  close() {
    this.editDialogRef.close(null);
  }
}
