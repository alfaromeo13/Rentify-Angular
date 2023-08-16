import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordNextComponent } from './reset-password-next.component';

describe('ResetPasswordNextComponent', () => {
  let component: ResetPasswordNextComponent;
  let fixture: ComponentFixture<ResetPasswordNextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordNextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordNextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
