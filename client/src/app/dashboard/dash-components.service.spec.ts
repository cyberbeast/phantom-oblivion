/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DashComponentsService } from './dash-components.service';

describe('Service: DashComponents', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashComponentsService]
    });
  });

  it('should ...', inject([DashComponentsService], (service: DashComponentsService) => {
    expect(service).toBeTruthy();
  }));
});
