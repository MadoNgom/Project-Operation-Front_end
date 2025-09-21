import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Unautorized } from './unautorized';

describe('Unautorized', () => {
  let component: Unautorized;
  let fixture: ComponentFixture<Unautorized>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Unautorized]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Unautorized);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
