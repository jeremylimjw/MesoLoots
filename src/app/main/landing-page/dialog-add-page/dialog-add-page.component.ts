import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { PageApiService } from 'src/app/_services/page-api.service';

@Component({
  selector: 'app-dialog-add-page',
  templateUrl: './dialog-add-page.component.html',
  styleUrls: ['./dialog-add-page.component.css']
})
export class DialogAddPageComponent implements OnInit {

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32), Validators.pattern(/^\S*$/)]),
    private: new FormControl(false),
    password: new FormControl('', [Validators.minLength(6), Validators.maxLength(32)]),
  })
  submitting: boolean = false;
  errorMessage: string = '';

  constructor(
    private pageApi: PageApiService,
    private authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<DialogAddPageComponent>) { }

  ngOnInit(): void {
    this.form.controls.name.valueChanges.subscribe(() => this.errorMessage = '');
  }

  get url(): string {
    return window.location.href;
  }
  
  submitForm(): void {

    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    
    this.pageApi.createPage(this.form.value).subscribe(
      page => {
        this.submitting = false;
        this.dialogRef.close();
        if (page.private) {
          this.authService.setCookie(page._id, page.password);
        }
        this.router.navigateByUrl(`/${page.name}/team`);
      },
      err => {
        this.errorMessage = err;
        this.submitting = false;
      }
    )
  }

}
