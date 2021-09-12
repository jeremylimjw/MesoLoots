import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from '../../_models';
import { PageApiService } from '../../_services/page-api.service';

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

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private pageApi: PageApiService) { }

  ngOnInit(): void {
  }

  isActive(link: string): boolean {
    return this.router.url === this.router.createUrlTree([link], {relativeTo: this.activatedRoute}).toString();
  }

  get page(): Page | null {
    return this.pageApi.getPage();
  }

  get url(): string {
    return `${location.origin}/${this.page?.name}`;
  }

}
