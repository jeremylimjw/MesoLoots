import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './main/analytics/analytics.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { TeamComponent } from './main/team/team.component';

const routes: Routes = [
  { path: ':pageName', component: MainComponent, 
    children:[
      { path: '', component: DashboardComponent },
      { path: 'team', component: TeamComponent },
      { path: 'analytics', component: AnalyticsComponent },
    ] 
  },
  { path: '**', component: MainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
