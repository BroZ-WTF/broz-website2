import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { NGXLogger } from 'ngx-logger';
import { CookieService } from 'ngx-cookie-service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { QuotesEditQuoteDialogComponent } from '../quotes/quotes-edit-quote-dialog/quotes-edit-quote-dialog.component';
import { QuotesDeleteQuoteDialogComponent } from '../quotes/quotes-delete-quote-dialog/quotes-delete-quote-dialog.component';

import { environment } from 'src/environments/environment';


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
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {
  minLengthName = 3;
  maxLengthName = 25;
  maxLengthQuote = 128;
  snackbarDuration = 3 * 1000; // ms
  baseUrl = environment.baseUrl + '/quotes';
  maxall: number = 20;
  displayedColumns: string[] = ['id', 'name', 'quote', 'date', 'editActions'];

  filterString = '';

  topScorer;
  topScorerArray = [];
  numer_shown_scorer: number;

  fullQuotes: any;
  dataSourceQuotes = new MatTableDataSource<Quote>();

  @Input() LoginState: boolean;

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _logger: NGXLogger, private _http: HttpClient, private _snackBar: MatSnackBar, private _cookieService: CookieService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.onResize(null);
    this._logger.debug('quotes.component: query quotes.');
    this.getAllQuotesAPI();
    this.dataSourceQuotes.sort = this.sort;
  }

  getLoginState() {
    return this.LoginState;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceQuotes.filter = filterValue.trim().toLowerCase();
  }

  addQuote() {
    const addDialogRef = this.dialog.open(QuotesEditQuoteDialogComponent, {
      width: '500px',
      data: {
        configData: {
          minLengthName: this.minLengthName,
          maxLengthName: this.maxLengthName,
          maxLengthQuote: this.maxLengthQuote,
          actionType: 'Neues'
        },
        initData: {
          id: null, name: '', quote: '', date: ''
        }
      }
    });
    addDialogRef.afterClosed().subscribe(result => {
      if (result) {
        delete result.id;
        this._logger.debug('quotes.component: add form result:', result);
        this.postQuoteAPI(result);
      }
    });
  }

  editQuote(element) {
    const editDialogRef = this.dialog.open(QuotesEditQuoteDialogComponent, {
      width: '500px',
      data: {
        configData: {
          minLengthName: this.minLengthName,
          maxLengthName: this.maxLengthName,
          maxLengthQuote: this.maxLengthQuote,
          actionType: 'Editiere'
        },
        initData: {
          id: element.id, name: element.name, quote: element.quote, date: element.date
        }
      }
    });
    editDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._logger.debug('quotes.component: edit form result:', result);
        if (result.name === 'Krümmelmonster') {
          this.monster();
        } else {
          this.putQuoteAPI(result);
        }
      }
    });
  }

  deleteQuote(element) {
    const deleteDialogRef = this.dialog.open(QuotesDeleteQuoteDialogComponent, {
      data: { id: element.id, name: element.name, quote: element.quote, date: element.date }
    });
    deleteDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._logger.debug('quotes.component: delete form result:', result);
        if (result.name === 'Krümmelmonster') {
          this.monster();
        } else {
          this.deleteQuoteAPI(result);
        }
      }
    });
  }

  onResize(event) {
    this.numer_shown_scorer = Math.ceil(window.innerWidth / 400);
    if (window.innerWidth < 500) {
      this.displayedColumns = ['name', 'quote', 'date', 'editActions'];
    } else {
      this.displayedColumns = ['id', 'name', 'quote', 'date', 'editActions'];
    }
  }

  getAllQuotesAPI() {
    return this._http.get(this.baseUrl).subscribe(
      (val) => {
        this._logger.log('quotes.component: GET request: all quotes val:', val);
        this.refreshTable(val);
      },
      response => {
        this._logger.error('quotes.component: GET request error: response:', response);
      },
      () => {
        this._logger.debug('quotes.component: GET observable completed.');
      }
    );
  }

  postQuoteAPI(quote: QuoteData) {
    let token = this._cookieService.get('login-token');
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Basic ${btoa(token + ':')}`);
    const body = quote;
    this._http.post(this.baseUrl, body, { headers }).subscribe(
      (val) => {
        this._logger.log('quotes.component: POST request: all quotes val:', val);
        this.refreshTable(val);
        this._snackBar.open('Neues Zitat angelegt', 'OK', { duration: this.snackbarDuration });
      },
      response => {
        this._logger.error('quotes.component: POST request error: response:', response);
        if (response.status === 401) {
          this._snackBar.open('ERROR - User unauthorized', 'OK', { duration: this.snackbarDuration });
        } else {
          this._snackBar.open('ERROR - POST call in error', 'OK', { duration: this.snackbarDuration });
        }
      },
      () => {
        this._logger.debug('quotes.component: POST observable completed.');
      }
    );
  }

  putQuoteAPI(quote: Quote) {
    let token = this._cookieService.get('login-token');
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', `Basic ${btoa(token + ':')}`);
    const body = quote;
    this._http.put(this.baseUrl, body, { headers }).subscribe(
      (val) => {
        this._logger.log('quotes.component: PUT request: all quotes val:', val);
        this.refreshTable(val);
        this._snackBar.open('Zitat erfolgreich editiert', 'OK', { duration: this.snackbarDuration });
      },
      response => {
        this._logger.error('quotes.component: PUT request error: response:', response);
        if (response.status === 401) {
          this._snackBar.open('ERROR - User unauthorized', 'OK', { duration: this.snackbarDuration });
        } else {
          this._snackBar.open('ERROR - PUT call in error', 'OK', { duration: this.snackbarDuration });
        }
      },
      () => {
        this._logger.debug('quotes.component: PUT observable completed.');
      }
    );
  }

  deleteQuoteAPI(quote: Quote) {
    let token = this._cookieService.get('login-token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Basic ${btoa(token + ':')}`);
    const delUrl = this.baseUrl + `/${quote.id}`;
    this._http.delete(delUrl, { headers }).subscribe(
      (val) => {
        this._logger.log('quotes.component: DELETE request: all quotes val:', val);
        this.refreshTable(val);
        this._snackBar.open('Zitat erfolgreich gelöscht', 'OK', { duration: this.snackbarDuration });
      },
      response => {
        this._logger.error('quotes.component: DELETE request error: response:', response);
        if (response.status === 401) {
          this._snackBar.open('ERROR - User unauthorized', 'OK', { duration: this.snackbarDuration });
        } else {
          this._snackBar.open('ERROR - DELETE call in error', 'OK', { duration: this.snackbarDuration });
        }
      },
      () => {
        this._logger.debug('quotes.component: DELETE observable completed.');
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
    this._logger.debug('quotes.component: calculated top scorer:', this.topScorer);
    this._logger.debug('quotes.component: sorted top scorer:', this.topScorerArray);

    this.dataSourceQuotes.paginator = this.paginator;
  }

  monster() {
    this._logger.debug('quotes.component: PIEP');
    alert(`
                  .---. .---.     Mich nicht löschen du kannst!
                 :     : o   :    Kekse haben ich will!
             _..-:   o :     :-.._    /
         .-''  '  \`---' \`---' "   \`\`-.
       .'   "   '  "  .    "  . '  "  \`.
      :   '.---.,,.,...,.,.,.,..---.  ' ;
      \`. " \`.                     .' " .'
       \`.  '\`.                   .' ' .'
        \`.    \`-._           _.-' "  .'  .----.
          \`. "    '"--...--"'  . ' .'  .'  o   \`.
          .'\`-._'    " .     " _.-'\`. :       o  :
        .'      \`\`\`--.....--'''    ' \`:_ o       :
      .'    "     '         "     "   ; \`.;";";";'
     ;         '       "       '     . ; .' ; ; ;
    ;     '         '       '   "    .'      .-'
    '  "     "   '      "           "    _.-'
    `);
  }
}
