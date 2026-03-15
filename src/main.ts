import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest JS Master class - Blog App API')
    .setDescription('Use the base API URL as http:/localhost:3000')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .setLicense(
      'MIT License',
      'https://github.com/git/git-scm.com/blob/main/MIT-LICENCE.txt',
    )
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();
  // Instantiate Document
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Setup the aws sdk used uploading the files to aws s3 bucket
  const configService = app.get(ConfigService)
  config.update({
    credentials: {
      accessKeyId: configService.get('appConfig.awsAccessKeyId')!,
      secretAccessKey: configService.get('appConfig.awsSecretAccessKey')!,
    },
    region: configService.get('appConfig.awsRegion')
  });


  // enable cors
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
