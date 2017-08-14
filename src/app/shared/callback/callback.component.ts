import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  template: ''
})
export class CallbackComponent implements OnInit {

  constructor(private authService: AuthService) { 
    this.authService.handleAuth();
  }

  ngOnInit() {
  }

}
