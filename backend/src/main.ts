import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:5173'),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('SmartOps AI API')
    .setDescription(
      'SmartOps AI Platform - REST API Documentation\n\n' +
      '## Features\n' +
      '- 🔐 **Authentication** - JWT-based auth with refresh tokens\n' +
      '- 👥 **User Management** - Full CRUD operations (Admin only)\n' +
      '- 📦 **Order Management** - Complete order lifecycle\n' +
      '- 🤖 **AI Assistant** - Natural language queries and actions\n\n' +
      '## Getting Started\n' +
      '1. Register or login to get your access token\n' +
      '2. Click "Authorize" and enter your token\n' +
      '3. Start making API requests!'
    )
    .setVersion('1.0')
    .setContact('SmartOps AI Team', 'https://smartops.ai', 'support@smartops.ai')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('https://api.smartops.ai', 'Production Server')
    .addTag('health', 'Health check endpoints')
    .addTag('auth', 'Authentication & authorization endpoints')
    .addTag('users', 'User management endpoints (Admin only)')
    .addTag('orders', 'Order management endpoints')
    .addTag('ai', 'AI Assistant endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your JWT access token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'SmartOps AI - API Docs',
    customfavIcon: 'https://smartops.ai/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3b82f6 }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai',
      },
    },
  });

  const port = configService.get('PORT', 3000);
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/api`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/api/docs`);
}
bootstrap();
