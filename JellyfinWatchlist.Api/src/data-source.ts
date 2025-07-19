import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { WatchlistItem } from './entities';

envLoad();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(process.env.CONFIG_PATH || '', 'db.sql'),
  entities: [WatchlistItem],
  migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false,
});

function envLoad(): void {
  // Simple .env loader for CLI context
  const dotenvPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(dotenvPath)) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    require('dotenv').config({ path: dotenvPath });
  }
}
