import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-quotes-add-quote-dialog',
  templateUrl: './quotes-add-quote-dialog.component.html',
  styleUrls: ['./quotes-add-quote-dialog.component.css']
})
export class QuotesAddQuoteDialogComponent implements OnInit {
  quoteForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public addDialogRef: MatDialogRef<QuotesAddQuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.quoteForm = this.formBuilder.group({
      'name': ['', [Validators.required, Validators.minLength(this.data.configData.minLengthName), Validators.maxLength(this.data.configData.maxLengthName)]],
      'quote': ['', [Validators.required, Validators.minLength(this.data.configData.minLengthName), Validators.maxLength(this.data.configData.maxLengthQuote)]],
      'date': ['', Validators.required],
    });
  }

  ngOnInit(): void { }

  submit() {
    this.addDialogRef.close(this.quoteForm.value);
  }

  close() {
    this.addDialogRef.close(null);
  }
}
