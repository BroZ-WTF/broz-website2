import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesEditQuoteDialogComponent } from './quotes-edit-quote-dialog.component';

describe('QuotesEditQuoteDialogComponent', () => {
  let component: QuotesEditQuoteDialogComponent;
  let fixture: ComponentFixture<QuotesEditQuoteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesEditQuoteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesEditQuoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
