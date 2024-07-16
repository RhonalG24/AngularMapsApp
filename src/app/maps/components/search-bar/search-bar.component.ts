import { Component } from '@angular/core';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { PlacesService } from '@maps/services';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [SearchResultsComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  private _debounceTimer?: NodeJS.Timeout;

  constructor( private _placeService: PlacesService ) {}

  onQueryChanged( query: string = '' ){
    if ( this._debounceTimer) clearTimeout( this._debounceTimer );

    this._debounceTimer = setTimeout( () => {
      this._placeService.getPlaceByQuery( query );
    }, 1500)
  }
}
