import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CoreService } from './core/services/core.service';
import { AuthHttp } from 'angular2-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  places = [];
  authenticated = this.authService.authenticated;

  constructor(
    private coreService: CoreService, 
    public authService: AuthService, 
    private route: ActivatedRoute, 
    private authHttp: AuthHttp) {}

  getList(res) {
    console.log("RES: ", res);
    if (res && res.length) {
      this.places = res;
    }
  }

  ngOnInit() {
    this.authService.loggedIn$.subscribe( (data) => {
      if (data) {
        this.authenticated = true;
      } else {
        this.authenticated = false;
      }
    });
  }

  login(event) {
    this.authService.login();
  }

  logout(event) {
    this.places = [];
    this.authService.logout();
  }

  changeState(place) {
      // let currentPlaceIndx = this.places.findIndex( (el) => el.name === place.name);
      // this.places[currentPlaceIndx] = this.places
      if (!place.currentUserGoing) {
        this.coreService.subscribeToClub(place).subscribe( 
          (data) => {
              if (data.message) {
                  this.places = this.places.map( (el) => {
                    if (place.name === el.name) {
                      el.currentUserGoing = true;
                      el.peopleGoing += 1;
                    }
                    return el;
                  });
              }
          },
          (error) => {

          }
        );
      } else {
        this.coreService.unsubscribeFromClub(place).subscribe( 
          (data) => {
            if (data.message) {
              this.places = this.places.map( (el) => {
                if (place.name === el.name) {
                  el.currentUserGoing = false;
                  el.peopleGoing -= 1;
                }
                return el;
              });
            }
          },
          (error) => {

          }
        );
      }
  }
}
