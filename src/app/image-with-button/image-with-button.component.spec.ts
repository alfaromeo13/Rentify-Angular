import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWithButtonComponent } from './image-with-button.component';

describe('ImageWithButtonComponent', () => {
  let component: ImageWithButtonComponent;
  let fixture: ComponentFixture<ImageWithButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageWithButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageWithButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
