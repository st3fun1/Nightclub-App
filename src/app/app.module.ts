import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { Http, RequestOptions } from '@angular/http';

import { AuthHttp} from 'angular2-jwt';

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

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CallbackComponent,
    ShowTextPipe,
    TextValidator,
    SearchComponent
  ],
  imports: [
    RouterModule.forRoot(ROUTES),
    BrowserModule,
    FormsModule,
    CoreModule
  ],
  providers: [
    AuthService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    IpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
