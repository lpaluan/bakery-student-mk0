import { Component, effect, inject, signal } from '@angular/core';
import { MatchService } from '../../services/match-service';
import { AuthService } from '../../services/auth-service';
import { QRCodeComponent } from 'angularx-qrcode';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-next-match',
  imports: [QRCodeComponent],
  templateUrl: './next-match.html',
  styleUrl: './next-match.css',
})
export class NextMatch {
  private auth = inject(AuthService);
  user = signal<any>(null);
  private match_service = inject(MatchService);
  nextMatch = signal<any>(null);
  nextMatchDate: string = '';

  constructor() {
    effect(async () => {
      const id = await this.auth.getCurrentUserId();
      const { data } = await this.auth.getUserInfo(id as string);
      this.user.set(data);
    });

    effect(async () => {
      const { data } = await this.match_service.nextMatch();
      this.nextMatch.set(data);

      const datePipe = new DatePipe('it-IT');
      this.nextMatchDate = datePipe.transform(
        this.nextMatch().matchdatetime,
        'd MMMM, y, HH:mm'
      ) || '';
    });
  }

  get qrData(): string {
    return JSON.stringify({
      user_id: this.user().id,
      match_id: this.nextMatch().id,
    });
  }
}
