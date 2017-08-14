import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AUTH_CONFIG } from './auth0-variables';
import { tokenNotExpired } from 'angular2-jwt';
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {
    auth0 = new auth0.WebAuth({
        clientID: AUTH_CONFIG.CLIENT_ID,
        domain: AUTH_CONFIG.CLIENT_DOMAIN,
        responseType: 'token id_token',
        audience: AUTH_CONFIG.AUDIENCE,
        redirectUri: AUTH_CONFIG.REDIRECT,
        scope: AUTH_CONFIG.SCOPE
    });
    
    // stream of logged in status to communicate throughout the app
    loggedIn: boolean;
    loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

    constructor(private router: Router) {
        if (this.authenticated) {
            this.setLoggedIn(true);
        }
    }

    setLoggedIn(value: boolean) {
        // Update login status subject
        this.loggedIn$.next(value);
        this.loggedIn = value;
    }

    login() {
        // Auth0 authorise request
        this.auth0.authorize();
    }

    handleAuth() {
        // When Auth0 hash parsed, get profile
        this.auth0.parseHash( (err, authResult) => {
            console.log("err", err);
            console.log("authREsult: ", authResult);
            if (authResult  && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                this._getProfile(authResult);
                this.router.navigate(['/']);
            } else if(err) {
                this.router.navigate(['/']);
                console.error(`Error: ${err.error}`);
            }
        })
    }

    private _getProfile(authResult) {
        this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
            this._setSession(authResult, profile);
        });
    }

    private _setSession(authResult, profile) {
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        localStorage.setItem('expires_at', expiresAt);
        this.setLoggedIn(true);
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
        localStorage.removeItem('expires_at');
        this.router.navigate(['/']);
        this.setLoggedIn(false);
    }

    get authenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }
}