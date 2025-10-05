import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { Imatch } from '../../interface/match-interface';
import { MatchService } from '../../services/match-service';
import { MatToolbarModule, MatToolbar } from '@angular/material/toolbar';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { NextMatch } from '../next-match/next-match';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NextMatch,
    RouterModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private auth = inject(AuthService);
  private router = inject(Router);
  private match_service = inject(MatchService);
  matches = signal<Imatch[]>([]);
  user = signal<any>(null);
  nextMatch = signal<any>(null);
  openMenu: any;
  imagePath: string = 'assets/images/logo-piacenza-young.jpeg';

  constructor() {
    effect(() => {
      this.onListChat();
    });

    effect(async () => {
      const id = await this.auth.getCurrentUserId();
      const { data } = await this.auth.getUserInfo(id as string);
      this.user.set(data);
      if (this.user().team === null || this.user().team === undefined) {
        alert('Completa il tuo profilo per continuare');
        this.router.navigate(['/user-info']);
      } else {
        effect(async () => {
          const { data } = await this.match_service.nextMatch();
          this.nextMatch.set(data);
        });
      }
    });
  }

  async logOut() {
    this.auth
      .signOut()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  onListChat() {
    this.match_service
      .listMatches()
      .then((res: Imatch[] | null) => {
        console.log(res);
        if (res !== null) {
          this.matches.set(res);
        } else {
          console.log('No matches Found');
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  }
}
