import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-quotes-edit-quote-dialog',
  templateUrl: './quotes-edit-quote-dialog.component.html',
  styleUrls: ['./quotes-edit-quote-dialog.component.css']
})
export class QuotesEditQuoteDialogComponent implements OnInit {

  constructor(
    public editDialogRef: MatDialogRef<QuotesEditQuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: null
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.editDialogRef.close();
  }

}
