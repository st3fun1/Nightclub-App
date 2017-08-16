import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { GlobalConfig } from '../../shared/global-config';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class GooglePlacesService {
    private googlePlacesURL = 'https://maps.googleapis.com/maps/api/place/photo?';
    private apiKey = GlobalConfig.googlePlacesAPIKey;
    constructor(private http: Http) {}

    getPhoto(ref, maxWidth) {
        this.http.get(`${this.googlePlacesURL}maxwidth=${maxWidth}&photoreference=${ref}&key=${this.apiKey}`)
            .map( (response: Response) => response.json())
            .catch( (error: any) => Observable.throw(error));
    }
}