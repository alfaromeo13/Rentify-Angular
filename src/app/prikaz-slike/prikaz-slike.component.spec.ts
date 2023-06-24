import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrikazSlikeComponent } from './prikaz-slike.component';

describe('PrikazSlikeComponent', () => {
  let component: PrikazSlikeComponent;
  let fixture: ComponentFixture<PrikazSlikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrikazSlikeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrikazSlikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
