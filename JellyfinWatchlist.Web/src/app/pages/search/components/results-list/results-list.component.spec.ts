import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { MatCardModule } from '@angular/material/card';
import { MediaItemComponent } from '../../../../shared/components/media-item/media-item.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ResultsListComponent } from './results-list.component';
import { WatchlistItem } from '../../../../shared/models';

describe('ResultsListComponent', () => {
  let spectator: Spectator<ResultsListComponent>;
  let component: ResultsListComponent;

  const mockResults: WatchlistItem[] = [
    { id: '1', name: 'Movie 1', year: 2023, mediaType: 'Movie', primaryImageUrl: 'url1' },
    { id: '2', name: 'Movie 2', year: 2022, mediaType: 'Series', primaryImageUrl: 'url2' },
    { id: '3', name: 'Movie 3', year: 2021, mediaType: 'Movie', primaryImageUrl: 'url3' },
  ];

  const createComponent = createComponentFactory({
    component: ResultsListComponent,
    imports: [MatCardModule, NoopAnimationsModule],
    mocks: [MediaItemComponent],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('component inputs', () => {
    it('should accept results input', () => {
      spectator.setInput('results', mockResults);
      expect(component.results).toEqual(mockResults);
    });

    it('should accept watchlistIds input', () => {
      const watchlistIds = ['1', '3'];
      spectator.setInput('watchlistIds', watchlistIds);
      expect(component.watchlistIds).toEqual(watchlistIds);
    });

    it('should default to empty arrays', () => {
      expect(component.results).toEqual([]);
      expect(component.watchlistIds).toEqual([]);
    });
  });

  describe('itemIsPartOfWatchlist', () => {
    beforeEach(() => {
      spectator.setInput('watchlistIds', ['1', '3']);
    });

    it('should return true if item id is in watchlist', () => {
      const item = mockResults[0]; // id: '1'
      expect(component.itemIsPartOfWatchlist(item)).toBe(true);
    });

    it('should return false if item id is not in watchlist', () => {
      const item = mockResults[1]; // id: '2'
      expect(component.itemIsPartOfWatchlist(item)).toBe(false);
    });

    it('should return false for empty watchlist', () => {
      spectator.setInput('watchlistIds', []);
      const item = mockResults[0];
      expect(component.itemIsPartOfWatchlist(item)).toBe(false);
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      spectator.detectChanges();
    });

    it('should render mat-card', () => {
      expect(spectator.query('mat-card')).toExist();
      expect(spectator.query('mat-card-content')).toExist();
    });

    it('should show "No results found" when results array is empty', () => {
      spectator.setInput('results', []);
      spectator.detectChanges();

      expect(spectator.query('p')).toContainText('No results found.');
    });

    it('should render results count when results exist', () => {
      spectator.setInput('results', mockResults);
      spectator.detectChanges();

      expect(spectator.query('.list-header p')).toContainText(`${mockResults.length} results`);
    });

    it('should render media item components for each result', () => {
      spectator.setInput('results', mockResults);
      spectator.setInput('watchlistIds', ['1']);
      spectator.detectChanges();

      const mediaItems = spectator.queryAll(MediaItemComponent);
      expect(mediaItems).toHaveLength(mockResults.length);

      // Check first item
      expect(mediaItems[0].item).toEqual(mockResults[0]);
      expect(mediaItems[0].isPartOfWatchlist).toBe(true);

      // Check second item (not in watchlist)
      expect(mediaItems[1].item).toEqual(mockResults[1]);
      expect(mediaItems[1].isPartOfWatchlist).toBe(false);
    });

    it('should emit itemSelected when media item emits itemSelected', () => {
      spectator.setInput('results', mockResults);
      spectator.detectChanges();

      spyOn(component.itemSelected, 'emit');

      const mediaItem = spectator.query(MediaItemComponent);
      mediaItem!.itemSelected.emit(mockResults[0]);

      expect(component.itemSelected.emit).toHaveBeenCalledWith(mockResults[0]);
    });

    it('should not render result list when no results', () => {
      spectator.setInput('results', []);
      spectator.detectChanges();

      expect(spectator.query('.result-list')).not.toExist();
      expect(spectator.query('.list-header')).not.toExist();
      expect(spectator.query('.items')).not.toExist();
    });

    it('should render correct structure when results exist', () => {
      spectator.setInput('results', mockResults);
      spectator.detectChanges();

      expect(spectator.query('.result-list')).toExist();
      expect(spectator.query('.list-header')).toExist();
      expect(spectator.query('.items')).toExist();
      expect(spectator.queryAll('.item')).toHaveLength(mockResults.length);
    });
  });
});
