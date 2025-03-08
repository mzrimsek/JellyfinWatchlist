import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MediaItem } from '../../models';

@Component({
  selector: 'app-shared-media-item',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './media-item.component.html',
  styleUrls: ['./media-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaItemComponent {
  @Input() item: MediaItem | undefined;
  @Output() itemSelected = new EventEmitter<MediaItem>();

  selectItem(): void {
    this.itemSelected.emit(this.item);
  }
}
