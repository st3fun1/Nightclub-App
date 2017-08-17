import { Component, OnInit, Input } from '@angular/core';

import { GooglePlacesService } from '../../../../core/services/google-places.service';
import { GlobalConfig } from '../../../../shared/global-config';
import { Nightclub, NightclubExtended } from '../../../../shared/interfaces/nightclub';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss'],
})
export class ClubComponent implements OnInit {
  @Input() place: Nightclub;
  _place;
  constructor(private googlePlacesService: GooglePlacesService) { }

  ngOnInit() {
    this.getIcon();
  }

  getIcon() {
    if (this.place.photos && this.place.photos[0]) {
      this.googlePlacesService.getPhoto(this.place.photos[0].photo_reference, this.place.name, 400)
          .subscribe( (data) => {
            let place2 = <NightclubExtended>this.place;
            place2.src = GlobalConfig.serverURL + data.image;
            this._place = place2;
          });
    } else {
      this._place = this.place;
    }
  }
}
