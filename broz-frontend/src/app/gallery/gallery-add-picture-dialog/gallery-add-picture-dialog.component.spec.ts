import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryAddPictureDialogComponent } from './gallery-add-picture-dialog.component';

describe('GalleryAddPictureDialogComponent', () => {
  let component: GalleryAddPictureDialogComponent;
  let fixture: ComponentFixture<GalleryAddPictureDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryAddPictureDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryAddPictureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
