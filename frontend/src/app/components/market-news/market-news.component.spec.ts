import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketNewsComponent } from './market-news.component';

describe('MarketNewsComponent', () => {
  let component: MarketNewsComponent;
  let fixture: ComponentFixture<MarketNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
