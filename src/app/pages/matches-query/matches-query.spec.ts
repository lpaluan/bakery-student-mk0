import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesQuery } from './matches-query';

describe('MatchesQuery', () => {
  let component: MatchesQuery;
  let fixture: ComponentFixture<MatchesQuery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchesQuery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchesQuery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
