import { Component, OnInit } from '@angular/core';
import { Tab } from './tab';
import { DashComponentsService } from './dash-components.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers:[DashComponentsService]
})
export class DashboardComponent implements OnInit {
  // Initialize variables
  private home_dashboard_tabs: Tab[];
  private firstrun: boolean = true;

  constructor(private dashService: DashComponentsService) {

  }

  ngOnInit() {

    this.dashService.getTabs().subscribe(tabs => {
  		this.home_dashboard_tabs = tabs;
  		// console.log("Received tabs...");
  	});
  }

}
