import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { headersInterceptor } from './core/interceptor/headers-interceptor';
import { errorInterceptor } from './core/interceptor/error-interceptor';
import { NgxSpinnerModule } from "ngx-spinner";


export const appConfig: ApplicationConfig = {
  providers: [
    
    provideHttpClient(withFetch(),withInterceptors([headersInterceptor , errorInterceptor ])),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(CookieService , NgxSpinnerModule

    )
  ]
};
