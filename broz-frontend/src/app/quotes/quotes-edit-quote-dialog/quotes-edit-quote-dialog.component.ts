import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-quotes-edit-quote-dialog',
  templateUrl: './quotes-edit-quote-dialog.component.html',
  styleUrls: ['./quotes-edit-quote-dialog.component.css']
})
export class QuotesEditQuoteDialogComponent implements OnInit {
  quoteForm = this.formBuilder.group({
    'name': [null, [Validators.required, Validators.maxLength(12)]],
    'quote': [null, [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    'date': [null, Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    public editDialogRef: MatDialogRef<QuotesEditQuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, name: string, quote: string, date: string }
  ) {
    // Preset dialog fields on old values
    this.quoteForm.setValue({ name: this.data.name, quote: this.data.quote, date: new Date(this.data.date) });
  }

  ngOnInit(): void { }

  submit() {
    this.editDialogRef.close(this.quoteForm.value);
  }

  close() {
    this.editDialogRef.close(null);
  }

}
