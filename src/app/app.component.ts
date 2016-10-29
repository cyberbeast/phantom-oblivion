import { Component } from '@angular/core';
import { Tool } from './tool';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title_one = 'Phantom';
  title_two = 'Oblivion';

  home_dashboard_tools = [
  	new Tool(1, 'VM Manager', 'Tab for VM Manager'),
  	new Tool(2, 'TOR Manager', 'Tab for TOR Manager'),
  	new Tool(3, 'WebApp Manager', 'Tab for WebApp Manager')
  ];
}

