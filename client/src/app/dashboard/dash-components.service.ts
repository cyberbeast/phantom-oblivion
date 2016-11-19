import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/toPromise';

import { Tab } from './tab';
import { Project } from './project-interface';


@Injectable()
export class DashComponentsService {
	private url = 'http://localhost:8008/config/get_tabs'; //Only for development.
	private config_url = 'http://localhost:8008/config/'; //Only for development.


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

	getFirstRunStatus(): Observable<boolean>{
		return this.http.get(this.config_url + "first_run_status")
						.map(res => res.json());
	}

}