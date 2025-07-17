import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';
import { WatchlistItem } from './entities';

envLoad();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(process.env.CONFIG_PATH || '', 'db.sql'),
  entities: [WatchlistItem],
  migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false,
});

function envLoad() {
  // Simple .env loader for CLI context
  const fs = require('fs');
  const dotenvPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(dotenvPath)) {
    require('dotenv').config({ path: dotenvPath });
  }
}
