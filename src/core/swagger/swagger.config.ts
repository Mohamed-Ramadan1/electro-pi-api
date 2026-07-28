import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const swaggerDarkTheme = [
  'body { background: #0b1120; }',
  '.swagger-ui { color: #e5e7eb; }',
  '.swagger-ui .scheme-container, .swagger-ui .opblock, .swagger-ui .model-box, .swagger-ui section.models, .swagger-ui .dialog-ux .modal-ux, .swagger-ui .auth-container { background: #111827; border-color: #374151; box-shadow: none; }',
  '.swagger-ui .topbar { background: #030712; border-bottom: 1px solid #1f2937; }',
  '.swagger-ui .info .title, .swagger-ui .info p, .swagger-ui .info li, .swagger-ui .opblock .opblock-summary-description, .swagger-ui .opblock .opblock-section-header h4, .swagger-ui .opblock-description-wrapper p, .swagger-ui .response-col_status, .swagger-ui .response-col_description, .swagger-ui table thead tr td, .swagger-ui table thead tr th, .swagger-ui .parameter__name, .swagger-ui .parameter__type, .swagger-ui .prop-type, .swagger-ui .model-title, .swagger-ui .model, .swagger-ui .models h4, .swagger-ui .tab li, .swagger-ui label, .swagger-ui p, .swagger-ui span { color: #e5e7eb; }',
  '.swagger-ui .opblock-tag, .swagger-ui .opblock .opblock-summary-path, .swagger-ui .opblock .opblock-summary-path__deprecated { color: #f9fafb; }',
  '.swagger-ui input, .swagger-ui textarea, .swagger-ui select { background: #030712; border-color: #4b5563; color: #f9fafb; }',
  '.swagger-ui .btn, .swagger-ui .btn.authorize { background: #1f2937; border-color: #60a5fa; color: #dbeafe; }',
  '.swagger-ui .highlight-code, .swagger-ui .microlight { background: #030712 !important; }',
].join('\n');

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Noviq-api')
    .setDescription('Noviq single place to manage your entaiyer life')
    .setVersion('1.0')
    .addBearerAuth(
      {
        bearerFormat: 'JWT',
        scheme: 'bearer',
        type: 'http',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    customCss: swaggerDarkTheme,
    customSiteTitle: 'Noviq API Docs',
    swaggerOptions: {
      displayRequestDuration: true,
      operationsSorter: 'method',
      persistAuthorization: true,
      tagsSorter: 'alpha',
    },
  });
}
