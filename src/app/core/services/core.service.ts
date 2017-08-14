import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Observable';
import { GlobalConfig } from '../../shared/global-config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw'

@Injectable()
export class CoreService {

  private googlePlacesAPIkey = 'AIzaSyCEgPg35YC5JpCmQyP9hFrJHIRUpTFe5Yk';
  private publicGetClubsURL = `${GlobalConfig.serverURL}/api/public/nightclubs`;
  private privateGetClubsURL =  `${GlobalConfig.serverURL}/api/private/nightclubs`;
  private subscribeToClubURL = `${GlobalConfig.serverURL}/api/private/nightclubs/subscribe`;
  private unsubscribeFromClubURL = `${GlobalConfig.serverURL}/api/private/nightclubs/unsubscribe`;

  constructor(private http: Http, private authHttp: AuthHttp) { }

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
}
