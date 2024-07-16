import { Component } from '@angular/core';
import { MapService, PlacesService } from '@maps/services';

@Component({
  selector: 'app-btn-my-location',
  standalone: true,
  imports: [],
  templateUrl: './btn-my-location.component.html',
  styleUrl: './btn-my-location.component.css'
})
export class BtnMyLocationComponent {

  constructor (
    private _mapService: MapService,
    private _placesService: PlacesService,
  ) {}

  goToMyLocation(){
    if( !this._placesService.isUserLocationReady ) throw Error('No hay ubicación de usuario.');
    if( !this._mapService.isMapReady ) throw Error('No se ha inicializado el mapa.');

    this._mapService.flyTo( this._placesService.userLocation! );
  }
}
