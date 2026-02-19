import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject } from 'rxjs';

import { LoaderComponent } from './loader.component';
import { LoadingService } from '../loading.service';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject<boolean>(false);

    const mockLoadingService = {
      isLoading$: loadingSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      imports: [
        MatProgressSpinnerModule
      ],
      providers: [
        { provide: LoadingService, useValue: mockLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('não deve renderizar a div overlay e o spinner quando isLoading$ emitir false', () => {
    loadingSubject.next(false);

    fixture.detectChanges();

    const overlayElement = fixture.nativeElement.querySelector('.loading-overlay');

    expect(overlayElement).toBeNull();
  });

  it('deve renderizar a div overlay e o spinner quando isLoading$ emitir true', () => {
    loadingSubject.next(true);

    fixture.detectChanges();

    const overlayElement = fixture.nativeElement.querySelector('.loading-overlay');
    const spinnerElement = fixture.nativeElement.querySelector('mat-spinner');

    expect(overlayElement).toBeTruthy();
    expect(spinnerElement).toBeTruthy();
  });
});
