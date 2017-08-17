import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { CoreService } from '../../core/services/core.service';
import { AuthService } from '../../core/services/auth.service';
import { trigger, transition, style, animate, state} from '@angular/animations';
import { ClubComponent } from './components/club/club.component';

@Component({
  selector: 'app-club-list',
  templateUrl: './club-list.component.html',
  styleUrls: ['./club-list.component.scss'],
  animations: [
    trigger('grow', [
      state('inactive', style({
        background: 'inherit',
        transform: 'scale(1)',
        zIndex: '1',
        cursor: 'initial'
      })),
      state('active', style({
        background: 'black',
        transform:'scale(1.04)',
        zIndex: '9999',
        cursor: 'pointer'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ],
})
export class ClubListComponent implements OnInit, OnChanges {
  @Input() places;
  @ViewChildren(ClubComponent) clubs: QueryList<ClubComponent>;

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
     if (changes['places'] && !changes['places'].firstChange) {
       this.pPlaces = changes['places'].currentValue;
     }
  }

  ngAfterViewInit() {
    let clubs: ClubComponent[] = this.clubs.toArray();
    console.log("clubs: ", clubs, this.clubs);
  }

}
