import { Injectable, signal, computed } from '@angular/core';
import { DirectionsApiClient } from '@maps/api';
import { DirectionsResponse, Route } from '@maps/interfaces/directions';
import { Coordinates, Feature } from '@maps/interfaces/places';
import { LngLatBounds, LngLatLike, Map, Marker, Popup, SourceSpecification, AnySourceData } from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map?: Map;
  private markers: Marker[] = [];
  private zoom = signal<number>(14);
  private currentLngLat = signal<Coordinates>({ lng: 0, lat: 0});

  public actualZoom = computed( () => this.zoom() )
  public actualLngLat = computed( () => this.currentLngLat());
  get isMapReady(){
    return !!this.map;
  }

  constructor( private _directionsApi: DirectionsApiClient ) { }

  setMap( map: Map ){
    this.map = map;
    this.currentLngLat.update( () => this.map!.getCenter());
  }

  flyTo( coords: LngLatLike ){
    if ( !this.isMapReady ) throw Error('El mapa no está inicializado');

    this.map?.flyTo({
      zoom: 14,
      center: coords
    })

    this.zoom.update( () => Number(14))
  }

  //zoom feature
  zoomIn(){
    this.map?.zoomIn();
    this.zoom.update( value => value = this.map!.getZoom());
  }

  zoomOut(){
    this.map?.zoomOut();
    this.zoom.update( value => value = this.map!.getZoom());
  }

  zoomChanged( value: string ) {
    this.map?.zoomTo( this.zoom());
    this.zoom.update( () => Number(value));
  }

  onZoom() {
    this.zoom.update( value => value = this.map!.getZoom());
  }

  onZoomend() {
    if ( this.map!.getZoom() < 18 ) return;
    this.map!.zoomTo(18);
    this.zoom.update( () =>  this.map!.getZoom());
  }

  onMove(){
    this.currentLngLat.update( () => this.map!.getCenter());
  }


  //end zoom feature



  createMarkerFromPlaces( places: Feature[], userLocation: Coordinates ){

    if ( !this.map ) throw Error('Mapa no inicializado');

    this.removeMarkers();

    const newMarkers = [];

    for (const place of places ){
      const [ lng, lat ] = place.geometry.coordinates;
      const popup = new Popup()
        .setHTML(`
          <h6>${ place.properties.name }</h6>
          <span>${ place.properties.full_address }</span>
        `);

      const newMarker = new Marker()
        .setLngLat([lng, lat ])
        .setPopup( popup )
        .addTo( this.map );

      newMarkers.push( newMarker );
    }

    this.markers = newMarkers;

    if ( places.length === 0 ) return;

    // Limites del mapa
    const bounds = new LngLatBounds();
    const coord = userLocation as LngLatLike
    bounds.extend( userLocation );
    newMarkers.forEach( marker => bounds.extend( marker.getLngLat() ));

    this.map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 200,
        left: 300,
        right: 200
      },
    });
  }


  getRouteBetweenPoints( start: Coordinates, end: Coordinates):void{
    const startCoords = `${ start.lng },${ start.lat }`;
    const destinationCoords = `${ end.lng },${ end.lat }`;
    this._directionsApi.get<DirectionsResponse>(`/${startCoords};${destinationCoords}`)
      .subscribe( resp => this.drawPolyline( resp.routes[0] ));
  }


  private drawPolyline( route: Route ){
    console.log({ kms: route.distance / 1000, duration: route.duration / 60 });

    if( !this.map ) throw Error('Mapa no inicializado');

    const coords = route.geometry.coordinates;

    const bounds = new LngLatBounds();
    coords.forEach( ([ lng, lat ]) => {
      bounds.extend([ lng, lat ]);
    })

    this.map?.fitBounds( bounds, {
      padding: { left:300, right: 200, top: 200, bottom: 200 }
    })

    //Polyline

    const sourceData: SourceSpecification = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]

      }
    }

    this.removeLayerAndSource();

    this.map.addSource('RouteString', sourceData );

    console.log('source added');
    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        "line-join": 'round',
        'line-cap': 'round',
      },
      paint: {
        "line-color": 'black',
        "line-width": 3
      }
    });
  }

  removeMarkers(){
    this.markers.forEach( marker => marker.remove() );
  }

  removeLayerAndSource(){
    if( !this.map ) throw Error('Mapa no inicializado');

    if ( this.map.getLayer('RouteString')) {
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    };
  }

}

