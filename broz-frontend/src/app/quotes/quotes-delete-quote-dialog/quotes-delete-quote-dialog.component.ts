import { Component, OnInit, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-quotes-delete-quote-dialog',
  templateUrl: './quotes-delete-quote-dialog.component.html',
  styleUrls: ['./quotes-delete-quote-dialog.component.scss']
})
export class QuotesDeleteQuoteDialogComponent implements OnInit {

  constructor(
    public deleteDialogRef: MatDialogRef<QuotesDeleteQuoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  delete(): void {
    this.deleteDialogRef.close(this.data);
  }

  close(): void {
    this.deleteDialogRef.close(null);
  }
}
