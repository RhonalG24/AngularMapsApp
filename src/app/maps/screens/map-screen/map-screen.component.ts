import { Component } from '@angular/core';
import {
  LoadingComponent,
  MapViewComponent,
  AngularLogoComponent,
  BtnMyLocationComponent,
  SearchBarComponent,
  SearchResultsComponent,
  } from '@maps/components';
import { PlacesService } from '@maps/services';
import { ZoomRangePageComponent } from '../../components/zoom-range/zoom-range.component';

@Component({
  selector: 'app-map-screen',
  standalone: true,
  imports: [
    LoadingComponent,
    MapViewComponent,
    AngularLogoComponent,
    BtnMyLocationComponent,
    SearchBarComponent,
    SearchResultsComponent,
    ZoomRangePageComponent,
],
  templateUrl: './map-screen.component.html',
  styleUrl: './map-screen.component.css'
})
export class MapScreenComponent {

  constructor( private placesService: PlacesService) {}

  get isUserLocationReady() {
    return this.placesService.isUserLocationReady;
  }
}
