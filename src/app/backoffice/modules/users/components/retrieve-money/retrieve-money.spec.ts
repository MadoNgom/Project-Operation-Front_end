import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrieveMoney } from './retrieve-money';

describe('RetrieveMoney', () => {
  let component: RetrieveMoney;
  let fixture: ComponentFixture<RetrieveMoney>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetrieveMoney]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetrieveMoney);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
