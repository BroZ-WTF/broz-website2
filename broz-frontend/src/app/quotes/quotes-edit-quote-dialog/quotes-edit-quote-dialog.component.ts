import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-quotes-edit-quote-dialog',
  templateUrl: './quotes-edit-quote-dialog.component.html',
  styleUrls: ['./quotes-edit-quote-dialog.component.css']
})
export class QuotesEditQuoteDialogComponent implements OnInit {
  quoteForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public editDialogRef: MatDialogRef<QuotesEditQuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.quoteForm = this.formBuilder.group({
      'name': [this.data.initData.name, [Validators.required, Validators.minLength(this.data.configData.minLengthName), Validators.maxLength(this.data.configData.maxLengthName)]],
      'quote': [this.data.initData.quote, [Validators.required, Validators.minLength(this.data.configData.minLengthName), Validators.maxLength(this.data.configData.maxLengthQuote)]],
      'date': [this.data.initData.date, Validators.required],
    });
  }

  ngOnInit(): void { }

  submit() {
    let returnval = this.quoteForm.value;
    returnval['id'] = this.data.initData.id;
    this.editDialogRef.close(returnval);
  }

  close() {
    this.editDialogRef.close(null);
  }

}
