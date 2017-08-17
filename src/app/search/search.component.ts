import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CoreService } from '../core/services/core.service';
import { AuthService } from '../core/services/auth.service';
import { trigger, transition, style, animate, state} from '@angular/animations';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [trigger('resize', [
      state('inactive', style({
        width: '70%'
      })),
      state('active',  style({
        width: '100%'
      })),
      transition('inactive => active', [animate(100, style({width: '80%'})),animate(100, style({width: '90%'})),animate(100, style({width: '100%'}))]),
      transition('active => inactive', [animate(100, style({width: '90%'})),animate(100, style({width: '80%'})),animate(100, style({width: '70%'}))]),      
    ]
  )]
})
export class SearchComponent implements OnInit {

  @Output() getList = new EventEmitter();
  @Output() requestWasMade = new EventEmitter();
  @Input() inputVal = '';
  isActive = 'inactive';

  constructor(
    private coreService: CoreService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  submit(searchVal: string, valid: boolean): void {
    if (searchVal && valid) {
      if (this.authService.authenticated) {
        this.getListByReqType('private', searchVal);
      } else {
        this.getListByReqType('public', searchVal);
      }
    }
  }

  getListByReqType(type: string = 'public', searchVal: string):void {
      this.coreService.callService(type, searchVal, 
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

  onFocus(event) {
    this.isActive = this.isActive === 'inactive' ? 'active' : 'inactive';
  }
}
