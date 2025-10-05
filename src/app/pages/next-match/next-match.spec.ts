import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextMatch } from './next-match';

describe('NextMatch', () => {
  let component: NextMatch;
  let fixture: ComponentFixture<NextMatch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextMatch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextMatch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
