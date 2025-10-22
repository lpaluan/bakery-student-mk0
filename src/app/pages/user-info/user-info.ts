import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './user-info.html',
  styleUrl: './user-info.css',
})
export class UserInfo implements OnInit {
  imagePath: string = 'assets/images/logo-piacenza-young.jpeg';
  private router = inject(Router);
  private auth = inject(AuthService);
  userInfoForm!: FormGroup;
  userId: string = '';
  teams: any[] = [];

  constructor(private fb: FormBuilder) {}

  async ngOnInit() {
    this.userInfoForm = this.fb.group({
      full_name: [''],
      phone: [''],
      team: [''],
      isAdmin: [false],
      isReader: [false],
    });

    this.loadTeams();
    this.loadUserInfo();
  }

  async loadUserInfo() {
    this.userId = await this.auth.getCurrentUserId();
    const { data, error } = await this.auth.getUserInfo(this.userId);
    this.userInfoForm.patchValue({
      full_name: data?.full_name,
      phone: data?.phone,
      team: data?.team,
      isAdmin: data?.admin,
      isReader: data?.reader, 
    });
  }

  async loadTeams() {
    const { data, error } = await this.auth.getTeams();
    if (!error) {
      this.teams = data;
    }
  }

  async onSubmit() {
    const { error } = await this.auth.updateUser(
      this.userId,
      this.userInfoForm.value.full_name,
      this.userInfoForm.value.phone,  
      this.userInfoForm.value.team
    );
    if (!error) {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Error updating profile');
    }
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
