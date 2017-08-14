import { AppComponent } from './app.component';
import { CallbackComponent } from './shared/callback/callback.component';
import { Routes } from '@angular/router';
import { LoginResolve } from './resolvers/login.resolver';
import { LoginGuard } from './guards/login.guard';

export const ROUTES: Routes = [
    {path: 'callback', component: CallbackComponent}
];