import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-quotes-add-quote-dialog',
  templateUrl: './quotes-add-quote-dialog.component.html',
  styleUrls: ['./quotes-add-quote-dialog.component.css']
})
export class QuotesAddQuoteDialogComponent implements OnInit {
  quoteForm = this.formBuilder.group({
    'name': [null, [Validators.required, Validators.maxLength(12)]],
    'quote': [null, [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    'date': [null, Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    public addDialogRef: MatDialogRef<QuotesAddQuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void { }

  submit() {
    this.addDialogRef.close(this.quoteForm.value);
  }

  close() {
    this.addDialogRef.close(null);
  }
}
