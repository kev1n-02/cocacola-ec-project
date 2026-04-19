import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';

appConfig.providers.push(provideHttpClient());
bootstrapApplication(App, appConfig);