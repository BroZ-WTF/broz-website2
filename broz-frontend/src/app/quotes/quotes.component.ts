import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { API_URL } from '../../env';

import { QuotesAddQuoteDialogComponent } from '../quotes/quotes-add-quote-dialog/quotes-add-quote-dialog.component';
import { QuotesEditQuoteDialogComponent } from '../quotes/quotes-edit-quote-dialog/quotes-edit-quote-dialog.component';
import { QuotesDeleteQuoteDialogComponent } from '../quotes/quotes-delete-quote-dialog/quotes-delete-quote-dialog.component';


export interface Quote {
  id: number,
  name: string,
  quote: string,
  date: Date,
}

export interface QuoteData {
  name: string,
  quote: string,
  date: Date,
}

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})

export class QuotesComponent implements OnInit {
  snackbarDuration = 3 * 1000; // ms
  maxall: number = 20;
  displayedColumns: string[] = ['id', 'name', 'quote', 'date', 'editActions'];

  topScorer;
  topScorerArray = [];

  fullQuotes: any;
  dataSourceQuotes = new MatTableDataSource<Quote>();

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog, private _http: HttpClient, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getAllQuotesAPI().subscribe(val => {
      this.refreshTable(val);
      this.dataSourceQuotes.sort = this.sort;
      this.dataSourceQuotes.paginator = this.paginator;
      console.log('quotes: AllQuotes');
      console.log(val);
    })
  }

  addQuote() {
    const addDialogRef = this.dialog.open(QuotesAddQuoteDialogComponent, {
      width: '500px',
    });
    addDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.postQuoteAPI(result);
        console.log('quotes: add quote');
        console.log(result);
      }
    });
  }

  editQuote(element) {
    const editDialogRef = this.dialog.open(QuotesEditQuoteDialogComponent, {
      width: '500px',
      data: { id: element.id, name: element.name, quote: element.quote, date: element.date }
    });
    editDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.putQuoteAPI(result);
        console.log('quotes: edit quote');
        console.log(result);
      }
    });
  }

  deleteQuote(element) {
    const deleteDialogRef = this.dialog.open(QuotesDeleteQuoteDialogComponent, {
      data: { id: element.id, name: element.name, quote: element.quote, date: element.date }
    });
    deleteDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteQuoteAPI(result);
        console.log('quotes: delete quote');
        console.log(result);
      }
    });
  }

  getAllQuotesAPI() {
    return this._http.get(`${API_URL}/quotes`)
  }

  postQuoteAPI(quote: QuoteData) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = quote;
    this._http.post(`${API_URL}/quotes`, body, { headers }).subscribe(
      (val) => {
        console.log('POST call successful value returned in body', val);
        this.refreshTable(val);
        this._snackBar.open('Neues Zitat angelegt', 'OK', { duration: this.snackbarDuration });
      },
      response => {
        console.log('POST call in error', response);
        this._snackBar.open('ERROR - POST call in error', 'OK', { duration: this.snackbarDuration });
      },
      () => {
        console.log('The POST observable is now completed.');
      }
    );
  }

  putQuoteAPI(quote: Quote) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = quote;
    this._http.put(`${API_URL}/quotes`, body, { headers }).subscribe(
      (val) => {
        console.log('PUT call successful value returned in body', val);
        this.refreshTable(val);
        this._snackBar.open('Zitat erfolgreich editiert', 'OK', { duration: this.snackbarDuration });
      },
      response => {
        console.log('PUT call in error', response);
        this._snackBar.open('ERROR - PUT call in error', 'OK', { duration: this.snackbarDuration });
      },
      () => {
        console.log('The PUT observable is now completed.');
      }
    );
  }

  deleteQuoteAPI(quote: Quote) {
    this._http.delete(`${API_URL}/quotes/${quote.id}`).subscribe(
      (val) => {
        console.log('DELETE call successful value returned in body', val);
        this.refreshTable(val);
        this._snackBar.open('Zitat erfolgreich gelöscht', 'OK', { duration: this.snackbarDuration });
      },
      response => {
        console.log('DELETE call in error', response);
        this._snackBar.open('ERROR - DELETE call in error', 'OK', { duration: this.snackbarDuration });
      },
      () => {
        console.log('The DELETE observable is now completed.');
      }
    );
  }

  refreshTable(val: any) {
    this.fullQuotes = val;
    this.dataSourceQuotes.data = this.fullQuotes.quotes_list;
    // Reset top scorer to start counting from 0 again
    this.topScorer = Object();
    for (let ii = 0; ii < this.dataSourceQuotes.data.length; ii++) {
      this.dataSourceQuotes.data[ii].id = ii;
      // Calculate top scorers
      if (this.dataSourceQuotes.data[ii].name in this.topScorer) {
        this.topScorer[this.dataSourceQuotes.data[ii].name]++;
      } else {
        this.topScorer[this.dataSourceQuotes.data[ii].name] = 1;
      }
    }

    // Wierd sorting thing from stackoverflow to sort top scorers
    let to_sort = this.topScorer;
    this.topScorerArray = Object.keys(to_sort).map(function (key) {
      return [key, to_sort[key]];
    });
    this.topScorerArray.sort(function (first, second) {
      return second[1] - first[1];
    });

    console.log('quotes: top scorer');
    console.log(this.topScorer);
    console.log(this.topScorerArray);
  }
}
