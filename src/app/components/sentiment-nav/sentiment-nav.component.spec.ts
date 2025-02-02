import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentNavComponent } from './sentiment-nav.component';

describe('SentimentNavComponent', () => {
  let component: SentimentNavComponent;
  let fixture: ComponentFixture<SentimentNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentimentNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SentimentNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
