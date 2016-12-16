import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MaterialModule } from '@angular/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { DashComponentsService } from './dashboard/dash-components.service';
import { AceEditorComponent } from 'ng2-ace-editor';
import { AceEditorDirective } from 'ng2-ace-editor';
import { MaterializeModule } from 'angular2-materialize';
import { SimpleTimer } from 'ng2-simple-timer';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AceEditorComponent,
    AceEditorDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path:'dashboard',
        component: DashboardComponent
      }
    ])
  ],
  providers: [DashComponentsService, SimpleTimer],
  bootstrap: [AppComponent]
})
export class AppModule { }
