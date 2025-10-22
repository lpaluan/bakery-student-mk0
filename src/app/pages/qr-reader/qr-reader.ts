import { AfterViewInit, Component, inject, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOAD_WASM, NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { MatchService } from '../../services/match-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-qr-reader',
  imports: [CommonModule, NgxScannerQrcodeComponent],
  templateUrl: './qr-reader.html',
  styleUrl: './qr-reader.css',
})
export class QrReader implements AfterViewInit {
  imagePath: string = 'assets/images/logo-piacenza-young.jpeg';
  scannedData: any = null;
  lastMessage: string = '';
  qrCurrentDevice: number = 0;
  match_service = inject(MatchService);
  auth = inject(AuthService);
  @ViewChild(NgxScannerQrcodeComponent) scanner?: NgxScannerQrcodeComponent;

  constructor() {
    // Load the WASM file
    LOAD_WASM('assets/wasm/ngx-scanner-qrcode.wasm').subscribe();
  }

  ngAfterViewInit(): void {
    this.scanner?.start();
    const devices = this.scanner?.devices.value;
    if (devices && devices.length > 0) {
      this.scanner?.playDevice(devices[0].deviceId);
    }
  }

  async testScan() {
    await this.auth.getCurrentUserId();
    await this.match_service.nextMatch();

    const testData = {
      user_id: '6113ba1f-5e4d-4edc-8949-f14596bb5751',
      match_id: '939a02b2-df75-47fd-a12d-2a56b0471d82',
    };
    const error = await this.match_service.insertMatchAttendance(
      testData.user_id,
      testData.match_id
    );
  }

  async onScan(event: any) {
    const raw = event?.[0]?.value;
    this.scanner?.pause();
    try {
      const parsed = JSON.parse(raw);
      this.scannedData = parsed;
    } catch (e) {
      alert('QR code NON VALIDO');
      this.scannedData = null;
      return;
    }

    const error = await this.match_service.insertMatchAttendance(
      this.scannedData.user_id,
      this.scannedData.match_id
    );
    if (error) {
      alert('ERRORE REGISTRAZIONE');
      this.lastMessage = 'Errore:' + error.message;
    } 
    else {
      alert('Registrazione avvenuta con successo');
      this.lastMessage = 'Registrazione avvenuta con successo';
    }
    this.scannedData = null;
    this.scanner?.play();
  }

  switchCamera() {
    const devices = this.scanner?.devices.value;
    if (!devices || devices.length === 0) return;

    if (devices.length <= this.qrCurrentDevice) {
      this.qrCurrentDevice = 0;
    }

    const selectedDevice = devices[this.qrCurrentDevice];
    this.scanner?.playDevice(selectedDevice.deviceId);

    if (devices.length > this.qrCurrentDevice + 1) {
      this.qrCurrentDevice++;
    } else {
      this.qrCurrentDevice = 0;
    }
  }
}
