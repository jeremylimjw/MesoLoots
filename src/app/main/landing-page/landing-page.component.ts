import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPageComponent } from './dialog-add-page/dialog-add-page.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  form: FormGroup = new FormGroup({ pageName: new FormControl('') });

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    this.dialog.open(DialogAddPageComponent, { width: '500px' });
  }

  submitForm(): void {
    if (this.form.controls.pageName.value == '') {
      return;
    }

    window.location.href += this.form.controls.pageName.value;
  }

}
