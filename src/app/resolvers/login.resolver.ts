import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()

export class LoginResolve implements Resolve<any> {
    constructor(
        private authService: AuthService
    ) {}
    resolve(route: ActivatedRouteSnapshot):Observable<any> {
        return Observable.of({
            "test": '22'
        });
    }
}