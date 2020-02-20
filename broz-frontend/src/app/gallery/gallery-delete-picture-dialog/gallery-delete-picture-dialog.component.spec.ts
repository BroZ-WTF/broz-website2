import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryDeletePictureDialogComponent } from './gallery-delete-picture-dialog.component';

describe('GalleryDeletePictureDialogComponent', () => {
  let component: GalleryDeletePictureDialogComponent;
  let fixture: ComponentFixture<GalleryDeletePictureDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryDeletePictureDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryDeletePictureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
