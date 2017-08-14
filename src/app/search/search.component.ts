import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CoreService } from '../core/services/core.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() getList = new EventEmitter();
  constructor(
    private coreService: CoreService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  submit(searchVal) {
    if (searchVal) {
      if (this.authService.authenticated) {
        this.coreService.privateGetClubs(searchVal).subscribe(
          (data) => {
            if (typeof data.places !== 'string') {
              this.getList.emit(data.places);
            }
          },
          (error) => {
             this.getList.emit({'error': true});
          }
        )
      } else {
        this.coreService.publicGetClubs(searchVal).subscribe(
          (data) => {
            if (typeof data.places !== 'string') {
              this.getList.emit(data.places);
            }
          },
          (error) => {
             this.getList.emit({'error': true});
          }
        );
      }
    }
  }
}
