import { Component } from '@angular/core';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-loader',
  template: `
    <div class="loading-overlay" *ngIf="loadingService.isLoading$ | async">
      <mat-spinner diameter="50"></mat-spinner>
    </div>
  `,
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  constructor(public loadingService: LoadingService) {}
}
