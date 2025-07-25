import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

declare const module: {
  hot: { accept: () => void; dispose: (callback: () => any) => void };
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('JellyfinWatchlist API')
    .setDescription('The JellyfinWatchlist API')
    .setVersion('1.0')
    .addTag('Jellyfin')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors();

  // Serve static files from the Angular build (in production)
  if (process.env.NODE_ENV === 'production') {
    // Serve static files
    app.useStaticAssets(join(__dirname, '..', 'public'), {
      index: false, // Don't serve index.html automatically
    });

    // Fallback to index.html for client-side routing (SPA)
    app.use('*', (req: any, res: any, next: any) => {
      if (req.originalUrl.startsWith('/api/')) {
        next(); // Let API routes handle their own responses
      } else {
        res.sendFile(join(__dirname, '..', 'public', 'index.html'));
      }
    });
  }

  await app.listen(process.env.PORT ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
void bootstrap();
