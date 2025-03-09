import { Column, Entity } from 'typeorm';

@Entity()
export class WatchlistItem {
  @Column()
  id: string;

  @Column()
  name: string;

  @Column()
  mediaType: string;

  @Column()
  year: number;

  @Column()
  primaryImageUrl: string;
}
