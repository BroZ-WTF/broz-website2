import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryEditPictureDialogComponent } from './gallery-edit-picture-dialog.component';

describe('GalleryEditPictureDialogComponent', () => {
  let component: GalleryEditPictureDialogComponent;
  let fixture: ComponentFixture<GalleryEditPictureDialogComponent>;

  beforeEach(async(() => {
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
