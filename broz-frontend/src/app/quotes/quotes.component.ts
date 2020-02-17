import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../../env';

export interface Quote {
  name: string;
  quote: string,
  date: string;
}

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})

export class QuotesComponent implements OnInit {
  fullQuotes;
  dataSource;

  displayedColumns: string[] = ['name', 'quote', 'date'];

  constructor(private http: HttpClient) {
    this.getAllQuotes().subscribe(val => {
      this.fullQuotes = val;
      this.dataSource = this.fullQuotes.quotes_list;
      console.log('quotes: AllQuotes');
      console.log(val);
    })
  }

  ngOnInit(): void {
  }

  getAllQuotes() {
    return this.http.get(`${API_URL}/quotes`)
  }

}
