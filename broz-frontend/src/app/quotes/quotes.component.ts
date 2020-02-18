import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { API_URL } from '../../env';

export interface Quote {
  id: number;
  name: string;
  quote: string,
  date: string;
}

export interface DialogData {
  quote_name: string;
  quote_quote: string;
  quote_date: string;
}

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})

export class QuotesComponent implements OnInit {
  fullQuotes;
  dataSourceQuotes = new MatTableDataSource<Quote>();
  maxall: number = 20;

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'quote', 'date', 'editActions'];

  constructor(public dialog: MatDialog, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getAllQuotes().subscribe(val => {
      this.fullQuotes = val;
      this.dataSourceQuotes.data = this.fullQuotes.quotes_list;
      for (let ii = 0; ii < this.dataSourceQuotes.data.length; ii++) {
        this.dataSourceQuotes.data[ii].id = ii + 1;
      }
      this.dataSourceQuotes.sort = this.sort;
      this.dataSourceQuotes.paginator = this.paginator;
      console.log('quotes: AllQuotes');
      console.log(val);
    })
  }

  getAllQuotes() {
    return this.http.get(`${API_URL}/quotes`)
  }

  addQuote() {
    const addDialogRef = this.dialog.open(QuotesAddQuoteDialog, {
      width: '250px',
      data: { quote_name: null, quote_quote: null, quote_date: null }
    });
    addDialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO Send new quote and refresh table
      }
    });
  }
  editQuote(element) {
    const editDialogRef = this.dialog.open(QuotesEditQuoteDialog, {
      width: '250px',
      data: { quote_name: element.name, quote_quote: element.quote, quote_date: element.date }
    });
    editDialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO Send edited quote and refresh table
      }
    });
  }
  deleteQuote(element) {
    const deleteDialogRef = this.dialog.open(QuotesDeleteQuoteDialog, {
      width: '250px',
      data: { quote_name: element.name, quote_quote: element.quote, quote_date: element.date }
    });
    deleteDialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO Send DELETE for given quote and refresh table
      }
    });
  }

  /*
  sortData(sort: Sort) {
    const data = this.dataSourceQuotes.data;
    if (!sort.active || sort.direction === '') {
      this.dataSourceQuotes.data = data;
      return;
    }

    this.dataSourceQuotes.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'date': return compare(a.date, b.date, isAsc);
        default: return 0;
      }
    });
  }
  */
}

@Component({
  selector: 'quotes-add-quote-dialog',
  templateUrl: 'quotes-add-quote-dialog.html',
})
export class QuotesAddQuoteDialog {
  constructor(
    public addDialogRef: MatDialogRef<QuotesAddQuoteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.addDialogRef.close();
  }
}

@Component({
  selector: 'quotes-edit-quote-dialog',
  templateUrl: 'quotes-edit-quote-dialog.html',
})
export class QuotesEditQuoteDialog {
  constructor(
    public editDialogRef: MatDialogRef<QuotesEditQuoteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.editDialogRef.close();
  }
}

@Component({
  selector: 'quotes-delete-quote-dialog',
  templateUrl: 'quotes-delete-quote-dialog.html',
})
export class QuotesDeleteQuoteDialog {
  constructor(
    public deleteDialogRef: MatDialogRef<QuotesDeleteQuoteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.deleteDialogRef.close();
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
