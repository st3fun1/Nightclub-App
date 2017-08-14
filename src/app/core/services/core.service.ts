import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Observable';
import { GlobalConfig } from '../../shared/global-config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { IpService } from './ip.service';

@Injectable()
export class CoreService {

  private googlePlacesAPIkey = 'AIzaSyCEgPg35YC5JpCmQyP9hFrJHIRUpTFe5Yk';
  private publicGetClubsURL = `${GlobalConfig.serverURL}/api/public/nightclubs`;
  private privateGetClubsURL =  `${GlobalConfig.serverURL}/api/private/nightclubs`;
  private subscribeToClubURL = `${GlobalConfig.serverURL}/api/private/nightclubs/subscribe`;
  private unsubscribeFromClubURL = `${GlobalConfig.serverURL}/api/private/nightclubs/unsubscribe`;

  constructor(
    private http: Http, 
    private authHttp: AuthHttp,
    private ipService: IpService
  ) { }

  publicGetClubs(cityName){
    let body = {cityName};
    return this.http.post(this.publicGetClubsURL, body)
                .map( (response: Response) => {
                  return response.json();
                })
                .catch( (error: any) => Observable.throw(error.status));
  }

  privateGetClubs(cityName) {
    let body = {cityName};
    return this.authHttp.post(this.privateGetClubsURL, body)
                .map( (response: Response) => response.json())
                .catch( (error:any) => Observable.throw(error.status));
  }

  subscribeToClub(club): Observable<any> {
    return this.authHttp.post(this.subscribeToClubURL, {club})
      .map((response: Response) => response.json())
      .catch( (error: any) => Observable.throw(error));
  }

  unsubscribeFromClub(club): Observable<any> {
    return this.authHttp.post(this.unsubscribeFromClubURL, {club})
            .map( (response: Response) => response.json())
            .catch( (error: any) => Observable.throw(error));
  }

  getListForCurrentLocation(doneCb: Function, errCb: Function, completeCb: Function = null): void {
    let cityName = '';
    this.ipService.getLocation()
        .flatMap( (data) => {
          console.log('data: ', data);
          cityName = data.city;
          return this.publicGetClubs(cityName);
        }).subscribe( 
          (data) => {
            doneCb(data, cityName);
          },
          (error) => {
            errCb(error);
          },
          () => {
            if (completeCb) {
              completeCb();
            }
          }
        );
  }

  getFunction(serviceType: string): Function {
    let func = null;
    if (serviceType === 'private') {
      func = this.privateGetClubs.bind(this);
    } else {
      func = this.publicGetClubs.bind(this);
    }

    return func;
  }

  callService(serviceType = 'public', searchVal: string, doneCb: Function, errorCb: Function = null):void {
    let func = this.getFunction(serviceType);

    if (typeof func === 'function') {
      func(searchVal)
        .debounceTime(0)
        .distinctUntilChanged()
        .subscribe(
          (data) => {
            doneCb(data);
          },
          (error) => {
             if (errorCb) {
               errorCb(error);
             }
          }
        )
    }
    
  }
}
