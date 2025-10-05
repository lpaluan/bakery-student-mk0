import id from '@angular/common/locales/id';
import { Component, effect, inject, signal } from '@angular/core';
import { MatchService } from '../../services/match-service';
import { AuthService } from '../../services/auth-service';
import { QRCodeComponent } from 'angularx-qrcode';

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

  constructor() {
    effect(async () => {
      const id = await this.auth.getCurrentUserId();
      const { data } = await this.auth.getUserInfo(id as string);
      this.user.set(data);
    });

    effect(async () => {
      const { data } = await this.match_service.nextMatch();
      this.nextMatch.set(data);
    });
  }

  get qrData(): string {
    return JSON.stringify({ user: this.user().id, match: this.nextMatch().id });
  }
}
