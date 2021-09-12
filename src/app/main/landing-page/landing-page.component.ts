import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageApiService } from 'src/app/_services/page-api.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {


  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32), Validators.pattern(/^\S*$/)]),
    private: new FormControl(false),
    password: new FormControl('', [Validators.minLength(6), Validators.maxLength(32)]),
  })
  submitting: boolean = false;
  errorMessage: string = '';

  constructor(
    private pageApi: PageApiService, 
    private router: Router) { }

  ngOnInit(): void {
    this.form.controls.name.valueChanges.subscribe(() => this.errorMessage = '');
  }
  
  submitForm(): void {

    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    
    this.pageApi.createPage(this.form.value).subscribe(
      page => {
        this.submitting = false;
        this.router.navigateByUrl(`/${page.name}/team`);
      },
      err => {
        this.errorMessage = err;
        this.submitting = false;
      }
    )
  }

}
