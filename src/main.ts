import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

Mapboxgl.accessToken = 'pk.eyJ1IjoicmhvbmFsZzI0IiwiYSI6ImNseTY3d3l1ajA3b3QyaW9hcGw3c3c1ODQifQ.aU8YDEx3Ieplhn5Q1T1BhA';

if ( !navigator.geolocation ){
  alert('El navegador no soporta la Geolocation.');
  throw new Error('El navegador no soporta la Geolocation.');
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
