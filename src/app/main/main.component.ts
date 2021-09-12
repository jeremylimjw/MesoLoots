import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { PageApiService } from '../_services/page-api.service';

@Component({
  selector: 'app-main',
  template: `
    <ng-container *ngIf="!pageName">
      <app-landing-page></app-landing-page>
    </ng-container>

    <mat-spinner style="top:50%; left: 50%;" *ngIf="loading && pageName"></mat-spinner>

    <ng-container *ngIf="!loading && pageName">
      <app-top-bar></app-top-bar>

      <div class="container">
          <router-outlet></router-outlet>
      </div>
    </ng-container>`,
  styles: [`
    .container { 
      padding-top: 180px;
      background-color: #E4E4E4;
      min-height: calc(100% - 180px); 
    }`
  ],
})
export class MainComponent implements OnInit {

  pageName: string | null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute, 
    public pageApi: PageApiService, 
    private router: Router) { 
      this.pageName = this.route.snapshot.paramMap.get('pageName');
    }

  ngOnInit(): void {
    /** If url has path parameter, check for existing page. */
    if (this.pageName) {
      this.pageApi.initPage(this.pageName).subscribe(
        () => {
          this.loading = false;
        },
        err => {
          this.loading = false;
          this.router.navigate([''])
        }
      )

    } else {
      this.loading = false;
    }
  }

}
