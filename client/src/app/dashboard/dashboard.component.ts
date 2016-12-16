import { Component, OnInit } from '@angular/core';
import { Tab } from './tab';
import { DashComponentsService } from './dash-components.service';
import "brace";
import "brace/mode/python";
import "brace/theme/eclipse";
import { CodeEditor } from './code-editor';
import { Function } from './function-interface';
import { Router } from '@angular/router';
import { Server } from './server-interface';

import { Observable } from 'rxjs/observable';
import {SimpleTimer} from 'ng2-simple-timer';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
	// Initialize variables
	private currentQuery: string = 'something';
	private home_dashboard_tabs: Tab[];
	private firstrun: boolean;
	private current_project: string;
	private code_edits: CodeEditor[] = [];
	private function_cards: Function[];
	private server_cards: Server[];
	private saveSpinnerBool: boolean = false;
	private obliviateSpinnerBool: boolean = false;
	private disableClassBool: boolean = true;
	private disableClassBool_ServerSaveButton: boolean = true;
	private disableClassBool_compile: boolean = false;
	private disableClassBool_obliviateButton: boolean = false;
	debugToggle: boolean = false;
	serverPoolCount: number = 0;
	functionsPoolCount: number = 0;
	access_url: string = "unassigned";
	tor_status: string = "OFFLINE";
	api_status: string = "OFFLINE";

	timer2Id: string;

	tiles: any[] = [
    {text: 'Two', cols: 1, rows: 4},
    {text: 'One', cols: 3, rows: 2},
    {text: 'Three', cols: 1, rows: 2},
    {text: 'Four', cols: 2, rows: 2},
  ];

	options:any = {maxLines: 1000, printMargin: false, highlightActiveLine: true};

	constructor(
		private router: Router,
		private dashService: DashComponentsService,
		private st: SimpleTimer) {

	}

	compile(){
		this.dashService.compile().subscribe(status => {
			if (status == "success"){
				this.disableClassBool_compile = true;
			}
		});
	}

	descriptionValueChange(newDescription, id) {
		// console.log(newDescription);
		this.disableClassBool = false;

		for ( var i = 0; i < this.function_cards.length; i++){
			if (this.function_cards[i]._id["$oid"] == id["$oid"]){
				this.function_cards[i].function_description = newDescription;
			}
		}
	}

	functionNameValueChange(newName, id) {
		// console.log(newName);
		this.disableClassBool = false;
		for ( var i = 0; i < this.function_cards.length; i++){
			if (this.function_cards[i]._id["$oid"] == id["$oid"]){
				this.function_cards[i].function_name = newName;
			}
		}
	}

	serverUsernameValueChange(newUserName, id) {
		this.disableClassBool_ServerSaveButton = false;
		for (var i = 0; i < this.server_cards.length; i++){
			if (this.server_cards[i]._id["$oid"] == id["$oid"]){
				this.server_cards[i].server_username = newUserName;
			}
		}
	}

	serverPasswordValueChange(newPassword, id) {
		this.disableClassBool_ServerSaveButton = false;
		for (var i = 0; i < this.server_cards.length; i++){
			if (this.server_cards[i]._id["$oid"] == id["$oid"]){
				this.server_cards[i].server_password = newPassword;
			}
		}
	}

	serverHostValueChange(newHost, id) {
		this.disableClassBool_ServerSaveButton = false;
		for (var i = 0; i < this.server_cards.length; i++){
			if (this.server_cards[i]._id["$oid"] == id["$oid"]){
				this.server_cards[i].server_host = newHost;
			}
		}
	}

	onChange(code, id) {
		// console.log("new code", JSON.stringify(code));
		// console.log(id["$oid"]);
		this.disableClassBool = false;
		if (this.code_edits.length == 0){
			this.code_edits.push({id: id["$oid"], code:code});
		}
		else {
			for ( var i = 0; i < this.code_edits.length; i++){
				if (this.code_edits[i].id == id["$oid"]){
					this.code_edits[i].code = code;
				}
			}
		}
	}

	saveFunction(id){
		console.log("SAVE REQUEST FOR: " + JSON.stringify(id));
		var selectedObject: any;
		if (!this.disableClassBool){
			this.saveSpinnerBool = true;
		}
		console.log(this.code_edits.length);
		for (var i = 0; i < this.code_edits.length; i++){
			console.log(this.code_edits[i].id);
			console.log(i);
			// console.log(id["$oid"]);
			if (this.code_edits[i].id == id["$oid"]){
				console.log("CHANGING FOR: " + this.code_edits[i].id);
				console.log("CHANGING VALUES IN func_cards for index: " + i);
				console.log("This is the code body: " + this.code_edits[i].code);
				
				for (var j = 0; j < this.function_cards.length; j++){
					if (this.function_cards[j]._id["$oid"] == id["$oid"]){
						this.function_cards[j].function_code = this.code_edits[i].code;
						selectedObject = this.function_cards[j];
					}
				}
				// selectedObject = this.function_cards[i];
			}
		}


		this.dashService.saveFunction(selectedObject).subscribe(status => {
			console.log(status);
			if (status == 0){
				this.disableClassBool = true;
				this.saveSpinnerBool = false;
				this.disableClassBool_compile = false;

				this.getFunctions();
			}
		});

	}

	saveServer(id){
		var selectedObject: any;

		if (!this.disableClassBool){
			this.saveSpinnerBool = true;
		}

		for (var i = 0; i < this.server_cards.length; i++){
			if (this.server_cards[i]._id["$oid"] == id["$oid"]){
				selectedObject = this.server_cards[i];
			}
		}

		this.dashService.saveServer(selectedObject).subscribe(status => {
			console.log(status);
			if (status == 0){
				this.disableClassBool_ServerSaveButton = true;
				this.saveSpinnerBool = false;

				this.getServers();
			}
		});
	}

	addNewFunction() {
		var newObject = {
			_id: { $oid: "__new"},
			function_name: "",
			function_description: "",			
			function_code: "",
			request_method: "GET"
		}

		// this.disableClassBool = true;
		// this.saveSpinnerBool = true;

		this.dashService.saveNewFunction(newObject).subscribe(res_object => {
			console.log(JSON.stringify(res_object));
			this.function_cards.push(res_object);
			this.disableClassBool_compile = false;

		});
	}

	addNewServer() {
		var newObject = {
			_id: { $oid: "__new"},
			server_host: "",
			server_username: "",
			server_password: ""
		}

		this.dashService.saveNewServer(newObject).subscribe(res_object => {
			console.log(JSON.stringify(res_object));
			this.server_cards.push(res_object);
		});

	}

	pressOb(){
		this.callObliviate();
		this.timer2Id = this.st.subscribe('10sec', e => this.callObliviate());
	}

	callObliviate() {

		this.obliviateSpinnerBool = true;
		this.tor_status = "CONNECTING";
		this.api_status = "CONNECTING";


		var authObject = {
			dev: "PASS"
		};

		this.dashService.Obliviate(authObject).subscribe(
			res_object => {
				console.log(JSON.stringify(res_object));
				// insert stuff to do
				this.access_url = res_object['access_url'];
				this.tor_status = res_object['tor_status'];
				this.api_status = res_object['api_status'];
				this.obliviateSpinnerBool = false;
				this.disableClassBool_obliviateButton = true;
			});
  	}

  	stopObliviate() {
  		this.obliviateSpinnerBool = true;
  		this.access_url = "Halting..."
  		this.api_status = "DISCONNECTING"
  		this.tor_status = "DISCONNECTING"
  		var authObject = {
			dev: "PASS"
		};

		this.dashService.stopObliviate(authObject).subscribe(
			res_object => {
				console.log(JSON.stringify(res_object));
				// insert stuff to do
				this.access_url = res_object;
				this.tor_status = "OFFLINE";
				this.api_status = "OFFLINE";
				this.obliviateSpinnerBool = false;
				this.disableClassBool_obliviateButton = false;

				if (this.timer2Id) {
					// Unsubscribe if timer Id is defined
					this.st.unsubscribe(this.timer2Id);
					this.timer2Id = undefined;
				};
			});

		 
  	}


	firstRun(): void {
		this.dashService.getFirstRunStatus().subscribe(
			status => {
				if (status == '1'){
					this.firstrun = true;
				}
				else {
					this.firstrun = false;
					this.current_project = status;
				}
				
				console.log("Received first run status...");
			});	
	}

	getFunctions(): void {
		this.dashService.getFunctions().subscribe(functions => {
			this.function_cards = functions;
			this.functionsPoolCount = functions.length;
			console.log(JSON.stringify(functions));
		});
	}

	getServers(): void {
		this.dashService.getServers().subscribe(servers => {
			this.server_cards = servers;
			this.serverPoolCount = servers.length;
			console.log(JSON.stringify(servers));
		});
	}

	ngOnInit() {
		this.firstRun();

		this.st.newTimer('10sec',10);
		
		this.dashService.modeAnnounced$.subscribe(state => {
			this.debugToggle = state;
		});

		this.dashService.getTabs().subscribe(tabs => {
			this.home_dashboard_tabs = tabs;
			// console.log("Received tabs...");
		});

		this.getFunctions();

		this.getServers();
	}

	refreshPage(): void {
		this.router.navigate(['/']);
	}

	addProject(value: string) {  
		if (value) {
			var project = {value}
			this.dashService.addProjects(project).subscribe(
				msg => {
					this.current_project = msg.name;
				})
			this.firstRun();
		}
	}
}
