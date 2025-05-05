import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentPopUpComponent } from './comment-pop-up.component';

describe('CommentPopUpComponent', () => {
  let component: CommentPopUpComponent;
  let fixture: ComponentFixture<CommentPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
