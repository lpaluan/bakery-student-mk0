import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrReader } from './qr-reader';

describe('QrReader', () => {
  let component: QrReader;
  let fixture: ComponentFixture<QrReader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrReader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrReader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
