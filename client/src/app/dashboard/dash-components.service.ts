import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/toPromise';

import { Tab } from './tab';
import { Project } from './project-interface';
import { Function } from './function-interface';
import { Server } from './server-interface';
import { Obliviate } from './obliviate-interface';

import { Subject } from 'rxjs/Subject';


@Injectable()
export class DashComponentsService {
	// Observable string sources
  	private debugMode = new Subject<boolean>();

  	// Observable string streams
  	modeAnnounced$ = this.debugMode.asObservable();

  	// Service message commands
  	announceMode(value: boolean) {
    	this.debugMode.next(value);
  	}

	private url = 'http://localhost:8008/config/get_tabs'; //Only for development.
	private config_url = 'http://localhost:8008/config/'; //Only for development.
	private web_services_url = 'http://localhost:8008/webservices/'; //Only for development.
	private vm_management_url = 'http://localhost:8008/vm/'; //Only for development.


  constructor(private http: Http) { }
	
	getTabs(): Observable<Tab[]> {
		// return tab stuff after querying the endpoint
		// '/config/get_tabs'
		return this.http.get(this.url)
						.map(res => res.json());
	}

	addProjects(body: Object): Observable<Project>{
		return this.http.post(this.config_url + "new_project", JSON.stringify(body))
						.map(res => res.json());
	}

	saveFunction(body: Object): Observable<number>{
		return this.http.post(this.web_services_url + "save_function", JSON.stringify(body))
						.map(res => res.json());
	}

	saveServer(body: Object): Observable<number>{
		return this.http.post(this.vm_management_url + "save_server", JSON.stringify(body))
						.map(res => res.json());
	}

	saveNewFunction(body: Object): Observable<Function>{
		return this.http.post(this.web_services_url + "save_function", JSON.stringify(body))
						.map(res => res.json());
	}

	saveNewServer(body: Object): Observable<Server>{
		return this.http.post(this.vm_management_url + "save_server", JSON.stringify(body))
						.map(res => res.json());
	}

	getFirstRunStatus(): Observable<string>{
		return this.http.get(this.config_url + "first_run_status")
						.map(res => res.json());
	}

	getFunctions(): Observable<Function[]> {
		return this.http.get(this.web_services_url + "get_functions")
						.map(res => res.json());
	}

	getServers(): Observable<Server[]> {
		return this.http.get(this.vm_management_url + "get_servers")
						.map(res => res.json());
	}

	compile(): Observable<string> {
		return this.http.get(this.web_services_url + "compile")
						.map(res => res.json());
	}

	Obliviate(body: Object): Observable<Obliviate> {
		
		return this.http.post(this.vm_management_url + "obliviate", JSON.stringify(body))
						.map(res =>  res.json());
	}

	stopObliviate(body: Object): Observable<string> {
		return this.http.post(this.vm_management_url + "stop_obliviate", JSON.stringify(body))
						.map(res =>  res.json());
	}
}