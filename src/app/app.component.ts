import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { CoreService } from './core/services/core.service';
import { AuthHttp } from 'angular2-jwt';
import { IpService } from './core/services/ip.service';
import { Nightclub } from './shared/interfaces/nightclub';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
  trigger('rotateStraight', [
      state('prone', style({
        transform: 'rotate(45deg)'
      })),
      state('straight', style({
        transform: 'rotate(-45deg)'
      })),
      transition('prone => straight', animate('100ms ease'))
    ]),
  trigger('rotateProne', [
      state('straight', style({
        transform: 'rotate(45deg)'
      })),
      state('prone', style({
        transform: 'rotate(-45deg)'
      })),
      transition('straight => prone', animate('100ms ease'))])
  ,trigger('shake', [
    state('shakeIt', style({
      transform: 'rotate(0deg) translate(2px 1px)'
    })),
    state('workTime', style({
      transform: 'rotate(-1deg) translate(1px -2px)'
    })),
    transition('shakeIt => workTime', [
      animate('100ms', style({transform: 'translate(-1px, -2px) rotate(-1deg)'})),
      animate('100ms', style({transform: 'translate(-3px, 0px) rotate(1deg)'})),
      animate('100ms', style({transform: 'translate(0px, 2px) rotate(0deg)'})),
      animate('100ms', style({transform: 'translate(1px, -1px) rotate(1deg)'})),
      animate('100ms', style({transform: 'translate(-3px, 1px) rotate(0deg)'})),
      animate('100ms', style({transform: 'translate(2px, 1px) rotate(-1deg)'})),
      animate('100ms', style({transform: 'translate(-1px, -1px) rotate(1deg)'})),
      animate('100ms', style({transform: '-webkit-transform: translate(2px, 2px) rotate(0deg)'})),
    ])
  ])
 ]
})

export class AppComponent {

  places: Nightclub[] = [];
  currentYear = new Date().getFullYear();
  authenticated = this.authService.authenticated;
  locationData = null;
  defaultInputVal: string = '';
  contentLoading = true;
  animateLogin = 'prone';
  animateGlass = 'prone';
  animateFace = 'shakeIt';

  constructor(
    private coreService: CoreService, 
    public authService: AuthService, 
    private route: ActivatedRoute, 
    private authHttp: AuthHttp,
    private ipService: IpService) {}

  getList(res: Nightclub[]) {
    this.contentLoading = false;
    if (res && res.length) {
      this.places = res.map ( (res) => {
        res["state"] = 'inactive';
        return res;
      })
    }
  }

  ngOnInit() {
    this.authService.loggedIn$.subscribe( (data) => {
      if (data) {
        this.authenticated = true;
        this.animateLogin = 'prone';
        // get the list of clubs for your area
        this.getLocationDetails();
      } else {
        this.animateLogin = 'straight';
        this.authenticated = false;
      }
    });
    if (!this.authenticated) {
       this.getLocationDetails();
    }
  }

  // TODO: error handling + ui notifications
  getLocationDetails() {
    this.coreService.getListForCurrentLocation(
        (data, cityName) => {
          if (data.places.length) {
            this.contentLoading = false;
            this.places = data.places;
            this.defaultInputVal = cityName;
          }
        },
        (error) => {
          console.error("error: ", error);
        }
    );
  }

  login(event) {
    this.authService.login();
  }

  mouseoverLogin(event) {
    this.animateLogin = this.animateLogin  === 'straight' ? 'prone' : 'straight';
  }

  mouseoverGlass(event) {
    let htmlElement = document.documentElement;
    if (this.animateGlass == 'prone') {
      htmlElement.style.webkitTransform = 'rotate(0deg)';
      htmlElement.style.transform = 'rotate(0deg)';
      this.animateGlass = 'straight';
      this.animateFace = 'workTime';
    } else {
      htmlElement.style.webkitTransform = 'rotate(-45deg)';
      htmlElement.style.transform = 'rotate(-45deg)';
      this.animateGlass = 'prone';
    }
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
                  this.updateList(place);
              }
          },
          (error) => {

          }
        );
      } else {
        this.coreService.unsubscribeFromClub(place).subscribe( 
          (data) => {
            if (data.message) {
              this.updateList(place, true);
            }
          },
          (error) => {

          }
        );
      }
  }

  updateList(club, unsubscribe = false):void {
      this.places = this.places.map( (el) => {
          if (club.name === el.name) {
            if (!unsubscribe) {
                el.currentUserGoing = true;
                el.peopleGoing += 1;
            } else {
                el.currentUserGoing = false;
                el.peopleGoing -= 1;
            }
          }
          return el;
      });
  }

  onRequest(event) {
    this.contentLoading = true;
  }
}
