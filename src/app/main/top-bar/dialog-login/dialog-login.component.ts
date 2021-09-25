import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginService } from 'src/app/_services/login.service';

@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.css']
})
export class DialogLoginComponent implements OnInit {

  password = new FormControl('', Validators.required);
  submitting: boolean = false;

  constructor(
    private loginService: LoginService,
    public dialogRef: MatDialogRef<DialogLoginComponent>) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.password.invalid) {
      return;
    }

    this.loginService.login(this.password.value).subscribe(
      result => {
        console.log('server responded w/ received cookies: ')
        console.log(result)
      },
      err => {
        // if password mismatch
        this.password.setErrors({ mismatch: true })
      }
    )
    // this.dialogRef.close();
  }

}
