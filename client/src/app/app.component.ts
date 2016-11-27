import { Component, OnInit } from '@angular/core';
import { DashComponentsService } from './dashboard/dash-components.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[DashComponentsService]
})
export class AppComponent{
  title_one = 'Phantom';
  title_two = 'Oblivion';

  constructor(private dashService: DashComponentsService){

  }

  announce(state: boolean){
  	this.dashService.announceMode(state);
  }

  ngOnInit() {
  	this.announce(false);
  }
  
}

