import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { Page } from '../../_models';
import { PageApiService } from '../../_services/page-api.service';
import { DialogLoginComponent } from './dialog-login/dialog-login.component';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  
  navLinks = [
    {
        label: 'Loots',
        link: './'
    }, 
    {
        label: 'Team',
        link: './team'
    }, 
    // {
    //     label: 'Analytics',
    //     link: './analytics'
    // }, 
  ];

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private pageApi: PageApiService,
    public authService: AuthService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  isActive(link: string): boolean {
    return this.router.url === this.router.createUrlTree([link], {relativeTo: this.activatedRoute}).toString();
  }

  get page(): Page | null {
    return this.pageApi.getPage();
  }

  get url(): string {
    return window.location.href;
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(DialogLoginComponent, { width: '350px' });
  }

}
