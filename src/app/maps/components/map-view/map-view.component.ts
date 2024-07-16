import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Coordinates } from '@maps/interfaces/places';
import { MapService, PlacesService } from '@maps/services';
import { Map, Marker, Popup } from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent implements AfterViewInit{

  @ViewChild('mapDiv')
  mapDivElement!: ElementRef;

  public zoom: number = 14;
  public map?: Map;
  // public currentLngLat?: [number,number];
  public currentLngLat?: Coordinates;

  constructor(
    private _placesService: PlacesService,
    private _mapService: MapService,
  ){}

  ngAfterViewInit(): void {

    if( !this._placesService.userLocation ) throw Error('No hay placeService.userLocation');

    this.currentLngLat = this._placesService.userLocation;
    this.zoom = this._mapService.actualZoom();

    this.map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this._placesService.userLocation, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });

    const popup = new Popup()
      .setHTML(`
          <h6>Aquí estoy</h6>
          <span>Estoy en este lugar del mundo</span>
      `);

    new Marker({ color: 'red' })
        .setLngLat( this._placesService.userLocation )
        .setPopup( popup )
        .addTo( this.map );

    this._mapService.setMap( this.map );

    this.mapListener();
  }

  mapListener() {
    if( !this.map ) throw 'Mapa no inicializado.';

    this.map.on('zoom', (ev) => {
      this._mapService.onZoom();
    })

    this.map.on('zoomend', (ev) => {
      if ( this.map!.getZoom() < 18 ) return;
      this._mapService.onZoomend();
    })

    this.map.on('move', () => {
      this._mapService.onMove();
    })
  }


}

