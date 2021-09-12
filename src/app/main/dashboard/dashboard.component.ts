import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: 
    `<app-distributable></app-distributable>
    <app-loot-table></app-loot-table>`,
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
