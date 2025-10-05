import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RouterLink,
    RouterModule
],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements OnInit {
  imagePath: string = 'assets/images/logo-piacenza-young.jpeg';
  signupForm!: FormGroup;
  name = signal('');
  email = signal('');
  password = signal('');
  teams: any[] = [];

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor(private fb: FormBuilder) {}

  async ngOnInit() {
    this.signupForm = this.fb.group({
      full_name: [''],
      email: [''],
      password: [''],
    });
  }

  async signUp() {
    const { error } = await this.auth.signUpWithEmail({
      name: this.name(),
      email: this.email(),
      password: this.password(),
    });
    if (error) {
      alert('Error signing up: ' + error.message);
    } else {
      alert('Check your email to confirm your account!');
      this.router.navigate(['/login']);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  async onSubmit() {
    const { error } = await this.auth.signUpWithEmail({
      name: this.signupForm.value.full_name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
    });
    if (error) {
      alert('Errore: ' + error.message);
    } else {
      alert('Controlla la tua emailper confermare la registrazione!');
      this.router.navigate(['/login']);
    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
