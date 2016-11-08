import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/toPromise';

import { Tab } from './tab';

// UNCOMMENT FROM HERE FOR PRODUCTION
import { TABS } from './mock-tabs';

@Injectable()
export class DashComponentsService {
	private url = 'http://localhost:8008/config/get_tabs'; //Only for development.

  constructor(private http: Http) { }
	
	getTabs(): Observable<Tab[]> {
		// return tab stuff after querying the endpoint
		// '/config/get_tabs'
		// var response = TABS;
		// return Promise.resolve(response);
		return this.http.get(this.url)
										.map(res => res.json());
	}


}