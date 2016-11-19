import { Component, OnInit, ViewChild } from '@angular/core';
import { Tab } from './tab';
import { DashComponentsService } from './dash-components.service';
import "brace";
import "brace/mode/python";
import "brace/theme/eclipse";
import { CodeEditor } from './code-editor';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers:[DashComponentsService]
})

export class DashboardComponent implements OnInit {
  // Initialize variables
  private home_dashboard_tabs: Tab[];
  private firstrun: boolean;
  private current_project: string;
  text_editor_id: number = 0;
  private function_cards: CodeEditor[] = [{
  	id: 0,
  	description: "This is the description for this function. You can edit this however you want.",
  	code: ""
  },
  {
  	id: 1,
  	description: " This is the description for this function. You can edit this however you want. ",
  	code: ""
  },
  {
  	id: 2,
  	description: " This is the description for this function. You can edit this however you want. ",
  	code: ""
  }];

  
  text:string = "#This is a code editor! ";
  options:any = {maxLines: 1000, printMargin: false, highlightActiveLine: true};

  onChange(code, id) {
    console.log("new code", id);
    this.function_cards[id].code = code;
  }

  addNewFunction() {
  	this.function_cards.push({
  		id: 3,
  		description: "something",
  		code: " "
  	});
  }

  constructor(private dashService: DashComponentsService) {
  	
  }

  ngOnInit() {
  	this.dashService.getFirstRunStatus().subscribe(
  			status => {
  				this.firstrun = status;
  				console.log("Received first run status...");
  			});

    this.dashService.getTabs().subscribe(tabs => {
  		this.home_dashboard_tabs = tabs;
  		// console.log("Received tabs...");
  	});
  }

  addProject(value: string) {  
  	if (value) {
  		var project = {value}
  		this.dashService.addProjects(project).subscribe(
  			msg => {
  				this.current_project = msg.name;
  			})
  	}
  }
}
