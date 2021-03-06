import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { Http, RequestOptions } from '@angular/http';

import { AuthHttp} from 'angular2-jwt';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ROUTES } from './routes';
import { SearchComponent } from './search/search.component';
import { CallbackComponent } from './shared/callback/callback.component';
import { AuthService } from './core/services/auth.service';
import { LoginResolve } from './resolvers/login.resolver';
import { LoginGuard } from './guards/login.guard';
import { ShowTextPipe } from './shared/pipes/showText.pipe';
import { authHttpServiceFactory } from './core/services/authHttpServiceFactory';
import { TextValidator} from './shared/directives/textValidator.directive';
import { IpService } from './core/services/ip.service';
import { ClubListComponent } from './components/club-list/club-list.component';
import { ClubComponent } from './components/club-list/components/club/club.component';
import { GooglePlacesService } from './core/services/google-places.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CallbackComponent,
    ShowTextPipe,
    TextValidator,
    SearchComponent,
    ClubListComponent,
    ClubComponent
  ],
  imports: [
    RouterModule.forRoot(ROUTES),
    BrowserModule,
    FormsModule,
    CoreModule,
    Angular2FontawesomeModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    IpService,
    GooglePlacesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
