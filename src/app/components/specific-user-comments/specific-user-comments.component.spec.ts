import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificUserCommentsComponent } from './specific-user-comments.component';

describe('SpecificUserCommentsComponent', () => {
  let component: SpecificUserCommentsComponent;
  let fixture: ComponentFixture<SpecificUserCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecificUserCommentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecificUserCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
