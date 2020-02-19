import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesAddQuoteDialogComponent } from './quotes-add-quote-dialog.component';

describe('QuotesAddQuoteDialogComponent', () => {
  let component: QuotesAddQuoteDialogComponent;
  let fixture: ComponentFixture<QuotesAddQuoteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesAddQuoteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesAddQuoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
