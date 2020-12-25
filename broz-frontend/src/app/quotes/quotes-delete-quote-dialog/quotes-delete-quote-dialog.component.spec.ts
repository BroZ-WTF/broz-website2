import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuotesDeleteQuoteDialogComponent } from './quotes-delete-quote-dialog.component';

describe('QuotesDeleteQuoteDialogComponent', () => {
  let component: QuotesDeleteQuoteDialogComponent;
  let fixture: ComponentFixture<QuotesDeleteQuoteDialogComponent>;

  beforeEach(waitForAsync(() => {
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
