import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Coordinates } from '@maps/interfaces/places';
import { MapService, PlacesService } from '@maps/services';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zoom-range.component.html',
  styleUrl: './zoom-range.component.css'
})
export class ZoomRangePageComponent implements AfterViewInit {
  // public zoom = signal<number>(14);
  public actualZoom = computed<number>(() => this._mapService.actualZoom());
  public map?: Map;
  // public currentLngLat?: [number, number];
  public currentLngLat = computed<Coordinates>(() => this._mapService.actualLngLat());

  constructor(
    private _mapService: MapService,
    private _placesService: PlacesService,
  ) {}
  ngAfterViewInit(): void {
    if ( !this._mapService.isMapReady ) throw Error('No hay mapa cargado');
    if ( !this._placesService.userLocation ) throw Error('No hay userLocation');


    // this.updateMapProperties();
  }

  zoomIn(){
    this._mapService.zoomIn();
    // this.updateMapProperties();
  }

  zoomOut(){
    this._mapService.zoomOut();
    // this.updateMapProperties();
  }

  zoomChanged( value: string ) {
    this._mapService.zoomChanged( value );
    // this.updateMapProperties();

  }

  // private updateMapProperties(){
  //   setTimeout( () => {
  //     // this.zoom.update( () => this._mapService.actualZoom());
  //     this.currentLngLat = this._placesService.userLocation;
  //   }, 600);
  // }
}
