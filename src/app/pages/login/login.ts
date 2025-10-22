import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  imagePath: string = 'assets/images/logo-piacenza-young.jpeg';
  loginForm!: FormGroup;
  email = signal('');
  password = signal('');
  private auth = inject(AuthService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {}

  async ngOnInit() {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  async handleAuth() {
    const response = await this.auth.signInWithGoogle();
  }

  async onSubmit() {
    const { error } = await this.auth.signInWithEmail({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    });
    if (error) {
      alert('Error: ' + error.message);
    }
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}
