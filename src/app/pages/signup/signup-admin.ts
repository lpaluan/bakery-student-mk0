import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup-admin',
  template: `
  <div mat-dialog-content>
    <h3 mat-dialog-title>Admin Password</h3>
    <div>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Password</mat-label>
        <input matInput [type]="hide ? 'password' : 'text'" [(ngModel)]="password">
        <button mat-icon-button matSuffix (click)="hide = !hide" [attr.aria-label]="'Hide password'" [attr.aria-pressed]="hide">
          <mat-icon>{{hide ? 'visibility_off' : 'visibility'}}</mat-icon>
        </button>
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="center">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onConfirm()">OK</button>
    </div>
  </div>
  `,
  imports: [MatInputModule, MatIconModule, FormsModule, MatDialogContent, MatDialogActions]
})

export class SignupAdmin {
  password: string = '';
  hide = true;

  constructor(
    public dialogRef: MatDialogRef<SignupAdmin>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(this.password);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}