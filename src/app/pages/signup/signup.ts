import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SignupAdmin } from './signup-admin';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RouterModule,
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
  private adminSignup = false;
  private readerSignup = false;
  private adminSignupConfirmed: boolean = false;
  private adminPassword: string = 'B@kery25!';

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private adminConfirm: MatDialog
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params['admin'] === 'true') {
        this.adminSignup = true;
      }
      if (params['reader'] === 'true') {
        this.readerSignup = true;
      }
    });
  }

  async ngOnInit() {
    this.signupForm = this.fb.group({
      full_name: [''],
      email: [''],
      password: [''],
    });
  }

  async openDialog(): Promise<void> {
    const dialogRef = this.adminConfirm.open(SignupAdmin, {
      width: '300px',
      disableClose: true, // optional: prevents closing without action
    });

    const dialogPassword =  dialogRef.afterClosed();
    const result = await lastValueFrom(dialogPassword);

    if (result) {
      if (result === this.adminPassword) {
        this.adminSignupConfirmed = true; // Proceed with signup
      }
      console.log('Password entered:', result);
    } else {
      console.log('Dialog was cancelled');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  async onSubmit() {
    if (this.adminSignup || this.readerSignup) {
      await this.openDialog();
      if (!this.adminSignupConfirmed) {
        return; // Exit if admin signup not confirmed
      }
    }
    const { error } = await this.auth.signUpWithEmail(
      {
        name: this.signupForm.value.full_name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
      },
      this.adminSignup,
      this.readerSignup
    );
    if (error) {
      alert('Errore: ' + error.message);
    } else {
      alert('Controlla la tua email per confermare la registrazione!');
      this.router.navigate(['/login']);
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard']);
  }
}
