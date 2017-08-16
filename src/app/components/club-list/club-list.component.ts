import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CoreService } from '../../core/services/core.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-club-list',
  templateUrl: './club-list.component.html',
  styleUrls: ['./club-list.component.scss']
})
export class ClubListComponent implements OnInit, OnChanges {
  @Input() places;
  pPlaces;
  authenticated = this.authService.authenticated;
  constructor(
    private coreService: CoreService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.pPlaces = this.places;
    this.authService.loggedIn$.subscribe( (data) => {
      if (data) {
        this.authenticated = true;
      } else {
        this.authenticated = false;
      }
    });
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
      this.pPlaces = this.pPlaces.map( (el) => {
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

  ngOnChanges(changes: SimpleChanges) {
    console.log('places: ', changes['places'].currentValue);
     if (changes['places'] && !changes['places'].firstChange) {
       this.pPlaces = changes['places'].currentValue;
     }
  }

}
