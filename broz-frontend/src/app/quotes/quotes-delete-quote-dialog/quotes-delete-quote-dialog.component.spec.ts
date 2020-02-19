import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesDeleteQuoteDialogComponent } from './quotes-delete-quote-dialog.component';

describe('QuotesDeleteQuoteDialogComponent', () => {
  let component: QuotesDeleteQuoteDialogComponent;
  let fixture: ComponentFixture<QuotesDeleteQuoteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesDeleteQuoteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesDeleteQuoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
