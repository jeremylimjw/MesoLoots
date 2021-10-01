import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../_common/dialog-confirm/dialog-confirm.component';
import { Page } from '../_models';
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
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  get page(): Page | null {
    return this.pageApi.getPage();
  }

  get hashedPassword(): string | undefined {
    return this.authService.getHashedPassword();
  }

  deletePage(): void {
    if (!this.authService.isAllowedToEdit()) {
      return;
    }
    
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: { title: `Delete this page '${this.page?.name}'?`, message: "Are you sure? This action cannot be undone."}
    });

    confirmDialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
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
    });

  }

  logout(): void {
    this.authService.removeCookie();
    this.snackBar.open("Logout successfully.");
    this.router.navigate([`${this.page?.name}`]);
  }

  WIP(): void {
    this.snackBar.open("This feature is still a work-in-progress.")
  }

}
