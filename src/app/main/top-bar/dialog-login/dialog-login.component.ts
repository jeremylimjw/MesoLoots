import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.css']
})
export class DialogLoginComponent implements OnInit {

  form = new FormGroup({
    password: new FormControl('', Validators.required)
  });
  submitting: boolean = false;

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<DialogLoginComponent>) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    this.authService.login(this.form.controls.password.value).subscribe(
      result => {
        this.submitting = false;
        this.dialogRef.close();
      },
      err => {
        if (err.status === 401) {
          this.form.controls.password.setErrors({ mismatch: true })
        }
        this.submitting = false;
      }
    )
  }

}
