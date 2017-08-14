import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class IpService {
    private getLocationDetailsURL = 'http://ip-api.com/json';
    constructor(private http: Http) {}

    getLocation():Observable<any> {
        return this.http.get(this.getLocationDetailsURL)
                .map( (response: Response) => response.json())
                .catch( (error: any) => Observable.throw(error));
    }
}