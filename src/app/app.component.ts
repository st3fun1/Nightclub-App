import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CoreService } from './core/services/core.service';
import { AuthHttp } from 'angular2-jwt';

import { IpService } from './core/services/ip.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  places = [];
  authenticated = this.authService.authenticated;
  locationData = null;

  constructor(
    private coreService: CoreService, 
    public authService: AuthService, 
    private route: ActivatedRoute, 
    private authHttp: AuthHttp,
    private ipService: IpService) {}

  getList(res) {
    if (res && res.length) {
      this.places = res;
    }
  }

  ngOnInit() {
    this.authService.loggedIn$.subscribe( (data) => {
      if (data) {
        this.authenticated = true;
        // get the list of clubs for your area
        this.getLocationDetails();
      } else {
        this.authenticated = false;
      }
    });
    if (!this.authenticated) {
       this.getLocationDetails();
    }
  }

  getLocationDetails() {
    this.coreService.getListForCurrentLocation(
        (data, cityName) => {
          console.log("data: ", data);
        },
        (error) => {
          console.error("error: ", error);
        }
    );
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
