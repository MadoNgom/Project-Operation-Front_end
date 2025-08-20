import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTransactions } from './cancel-transactions';

describe('CancelTransactions', () => {
  let component: CancelTransactions;
  let fixture: ComponentFixture<CancelTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelTransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
