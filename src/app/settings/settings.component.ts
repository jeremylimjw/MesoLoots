import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { PageApiService } from '../_services/page-api.service';
import { SnackBarService } from '../_services/snack-bar.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  submittingDelete: boolean = false;

  constructor(
    private authService: AuthService, 
    private pageApi: PageApiService,
    private snackBar: SnackBarService,
    private router: Router) { }

  ngOnInit(): void {
  }

  deletePage(): void {
    if (!this.authService.isAllowedToEdit()) {
      return;
    }

    this.submittingDelete = true;
    this.authService.deletePage().subscribe(
      result => {
        this.submittingDelete = false;
        this.authService.removeCookie();
        this.router.navigate([''])
      },
      err => {
        this.submittingDelete = false;
      }
    )

  }

  logout(): void {
    this.authService.removeCookie();
    this.snackBar.open("Logout successfully.");
    this.router.navigate([`${this.pageApi.getPage()?.name}`]);
  }

}
