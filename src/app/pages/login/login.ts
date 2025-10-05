import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  imagePath: string = 'assets/images/logo-piacenza-young.jpeg';
  email = signal('');
  password = signal('');
  private auth = inject(AuthService);
  private router = inject(Router);

  async handleAuth() {
    const response = await this.auth.signInWithGoogle();
  }

  async signInWithEmail() {
    const { error } = await this.auth.signInWithEmail({
      email: this.email(),
      password: this.password(),
    });
    if (error) {
      alert('Error signing in: ' + error.message);
    }
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}
