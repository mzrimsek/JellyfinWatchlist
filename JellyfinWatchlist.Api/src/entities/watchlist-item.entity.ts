import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class WatchlistItem {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  mediaType: string;

  @Column()
  year: number;

  @Column()
  primaryImageUrl: string;

  @Column()
  jellyfinUserId: string;
}
