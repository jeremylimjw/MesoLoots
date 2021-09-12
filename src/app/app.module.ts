import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core'
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TopBarComponent } from './main/top-bar/top-bar.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { AnalyticsComponent } from './main/analytics/analytics.component';
import { TeamComponent } from './main/team/team.component';
import { LootTableComponent } from './main/dashboard/loot-table/loot-table.component';
import { DialogDetailsComponent } from './main/dashboard/loot-table/dialog-details/dialog-details.component';
import { DateAgoPipe } from './_pipes/date-ago.pipe';
import { DialogAddComponent } from './main/dashboard/loot-table/dialog-add/dialog-add.component';
import { MetricPipe } from './_pipes/metric.pipe';
import { DistributablePipe } from './_pipes/distributable.pipe';
import { DistributableComponent } from './main/dashboard/distributable/distributable.component';
import { ConfirmDialogComponent } from './_common/confirm-dialog/confirm-dialog.component';
import { AddDialogComponent } from './main/team/add-dialog/add-dialog.component';
import { DialogViewAllComponent } from './main/dashboard/distributable/dialog-view-all/dialog-view-all.component';
import { MainComponent } from './main/main.component';
import { AutoCompleteComponent } from './_common/auto-complete/auto-complete.component';
import { LandingPageComponent } from './main/landing-page/landing-page.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    DashboardComponent,
    AnalyticsComponent,
    TeamComponent,
    LootTableComponent,
    DialogDetailsComponent,
    DateAgoPipe,
    DialogAddComponent,
    MetricPipe,
    DistributablePipe,
    DistributableComponent,
    ConfirmDialogComponent,
    AddDialogComponent,
    DialogViewAllComponent,
    MainComponent,
    AutoCompleteComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    ClipboardModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
