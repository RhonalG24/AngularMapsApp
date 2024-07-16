import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Coordinates, Feature } from '@maps/interfaces/places';
import { MapService, PlacesService } from '@maps/services';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {

  public isLoadingPlaces = computed<boolean>( () => this._placesService.isLoadingPlaces() );
  public selectedId: string = '';

  constructor(
    private _placesService: PlacesService,
    private _mapService: MapService,
  ) {  }

  // get isLoadingPlaces() {
  //   return this._placesService.isLoadingPlaces();
  // }

  get places(): Feature[] {
    return this._placesService.places;
  }

  flyTo( place: Feature ) {
    this.selectedId = place.id;

    const [ lng, lat ] = place.geometry.coordinates;
    this._mapService.flyTo([ lng, lat]);
  }

  getDirections( place: Feature ) {
    if ( !this._placesService.userLocation ) throw Error('No hay userLocation');

    const start = this._placesService.userLocation;
    // const end = place.geometry.coordinates as [number, number];
    const end = { lng: place.geometry.coordinates[0], lat: place.geometry.coordinates[1]};

    this._mapService.getRouteBetweenPoints(start, end);
  }

  public hidden = signal<boolean>(false);

  toggleResults(){
    this.hidden.update( () => !this.hidden() )
  }
}
