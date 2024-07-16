import { Injectable, signal } from '@angular/core';
import { PlacesApiClient } from '@maps/api';

import { Coordinates, Feature, PlacesResponse } from '@maps/interfaces/places';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  public userLocation?: Coordinates;
  public isLoadingPlaces = signal(false);
  public places: Feature[] = []

  get isUserLocationReady():boolean {
    return !!this.userLocation;
  }

  constructor(
    private _placesApi: PlacesApiClient,
    private _mapService: MapService,
  ) {
    this.getUserLocation();
   }

  public async getUserLocation(): Promise<Coordinates> {
    return new Promise( (resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords } ) => {
          this.userLocation = { lng: coords.longitude, lat: coords.latitude}  ;
          resolve( this.userLocation );

        },
        ( err ) => {
          alert('No se pudo obtener la geolocalización.');
          console.log( err );
          reject();
        }
      );
    })
  }
  // public async getUserLocation(): Promise<[number, number]> {
  //   return new Promise( (resolve, reject) => {
  //     navigator.geolocation.getCurrentPosition(
  //       ({ coords } ) => {
  //         this.userLocation = [ coords.longitude, coords.latitude ];
  //         resolve( this.userLocation );

  //       },
  //       ( err ) => {
  //         alert('No se pudo obtener la geolocalización.');
  //         console.log( err );
  //         reject();
  //       }
  //     );
  //   })
  // }

  getPlaceByQuery( query: string ){
    if ( query.length === 0 ){
      this.isLoadingPlaces.update( () => false );
      this.places = [];
      this._mapService.removeMarkers();
      this._mapService.removeLayerAndSource();
      return;
    }

    if ( !this.userLocation ) throw Error('No hay userLocation');

    this.isLoadingPlaces.update( () => true );
    this._placesApi.get<PlacesResponse>(`/forward?q=${ query }`, {
      params: {
        proximity: `${this.userLocation.lng},${this.userLocation.lat}`
        // proximity: this.userLocation.join(',')
      }
    })
      .subscribe( resp => {
        this.isLoadingPlaces.update( () => false);
        this.places = resp.features;

        this._mapService.createMarkerFromPlaces( this.places, this.userLocation! );
      } )
  }
}
