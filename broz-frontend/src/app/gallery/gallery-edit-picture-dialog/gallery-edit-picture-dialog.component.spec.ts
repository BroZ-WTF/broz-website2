import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GalleryEditPictureDialogComponent } from './gallery-edit-picture-dialog.component';

describe('GalleryEditPictureDialogComponent', () => {
  let component: GalleryEditPictureDialogComponent;
  let fixture: ComponentFixture<GalleryEditPictureDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryEditPictureDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryEditPictureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
