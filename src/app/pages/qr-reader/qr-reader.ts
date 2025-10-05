import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';

@Component({
  selector: 'app-qr-reader',
  imports: [CommonModule, NgxScannerQrcodeComponent],
  templateUrl: './qr-reader.html',
  styleUrl: './qr-reader.css',
})
export class QrReader {
  scannedData: any = null;

  onScan(result: any) {
    this.scannedData = result;
  }
}
