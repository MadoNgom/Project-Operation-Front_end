import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTransactions } from './send-transactions';

describe('SendTransactions', () => {
  let component: SendTransactions;
  let fixture: ComponentFixture<SendTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendTransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
