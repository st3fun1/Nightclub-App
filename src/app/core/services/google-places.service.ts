import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { GlobalConfig } from '../../shared/global-config';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class GooglePlacesService {
    private getPhotoURL = GlobalConfig.serverURL + '/externalApi/public/photo/';
    constructor(private http: Http) {}

    getPhoto(ref: string, clubName: string, maxWidth: number = 400) {
        return this.http.get(`${this.getPhotoURL}${clubName}?maxwidth=${maxWidth || 400}&ref=${ref}`)
            .map( (response: Response) => response.json())
            .catch( (error: any) => Observable.throw(error));
    }
}