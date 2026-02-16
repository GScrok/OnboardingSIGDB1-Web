import { Component } from '@angular/core';

import { AppRoutes } from './shared/app-routes.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Onboarding SIG';
  protected routes = AppRoutes;
}
