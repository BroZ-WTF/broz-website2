import { Component, OnInit } from '@angular/core';
import QuoteMetadata from 'src/assets/quotes.json';

export interface Quote {
  name: string;
  quote: string,
  date?: string;
}

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})

export class QuotesComponent implements OnInit {
  allQuotes: Quote[] = [];
  dataSource = this.allQuotes;

  displayedColumns: string[] = ['name', 'quote', 'date'];

  constructor() {
  }

  ngOnInit(): void {
    for (const quote of QuoteMetadata.quotes) {
      if ("date" in quote) {
        this.allQuotes.push(quote);
      } else {
        this.allQuotes.push({ name: quote.name, quote: quote.quote, date: "-" });
      }
    }
    console.log(this.allQuotes)
  }

}
