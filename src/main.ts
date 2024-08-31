import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Water and Gas Meter Reading API')
    .setDescription(
      'API para gerenciar leituras de medidores de água e gás, incluindo upload de imagens, confirmação de leituras e consulta de dados.',
    )
    .setVersion('1.1')
    .addTag('Medidas', 'Endpoints relacionados às medidas registradas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
