import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

import "dotenv/config";
import * as swaggerUi from "swagger-ui-express";

import * as morgan from "morgan";
import * as compression from "compression";
import helmet from "helmet";
import { HttpExceptionFilter } from "./utils/expection-filter";

import {
  UserModule,
  KitchenModule,
  SiteModule,
  OrderModule,
  OrderItemModule,
  MenuItemModule,
  MenuModule,
  CallModule,
} from "./domain"; // Import from index file
import {
  UserModuleV2,
  OrderModuleV2,
  OrderItemModuleV2,
  MenuItemModuleV2,
  MenuModuleV2,
  CallModuleV2,
} from "./v2"; // Import from index file

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");

  app.enableCors();
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );
  // const option1: SwaggerDocumentOptions = {
  //   include: [V1Module],
  //   deepScanRoutes: true,
  // };
  // const option2: SwaggerDocumentOptions = {
  //   include: [V2Module],
  //   deepScanRoutes: true,
  // };
  // // Swagger setup for V1
  // const configV1 = new DocumentBuilder()
  //   .setTitle("Teaboy API V1")
  //   .setVersion("1.0")
  //   .addBearerAuth()
  //   .build();

  // const documentV1 = SwaggerModule.createDocument(app, configV1, option1);
  // app.use("/v1", swaggerUi.serve, swaggerUi.setup(documentV1));

  // // Swagger setup for V2
  // const configV2 = new DocumentBuilder()
  //   .setTitle("Teaboy API V2")
  //   .setVersion("2.0")
  //   .addBearerAuth()
  //   .build();

  // const documentV2 = SwaggerModule.createDocument(app, configV2, option2);
  // app.use("/v2", swaggerUi.serve, swaggerUi.setup(documentV2));

  const configV1 = new DocumentBuilder()
    .setTitle("Portal Teaboy API V1")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const portalDocumentFactory = () =>
    SwaggerModule.createDocument(app, configV1, {
      include: [
        UserModule,
        KitchenModule,
        SiteModule,
        OrderModule,
        OrderItemModule,
        MenuItemModule,
        MenuModule,
        CallModule,
      ],
    });
  SwaggerModule.setup("/swagger/portal", app, portalDocumentFactory);

  const secondOptions = new DocumentBuilder()
    .setTitle("Mobile Teabpy API")
    .setVersion("2.0")
    .addBearerAuth()
    .build();

  const mobileDocumentFactory = () =>
    SwaggerModule.createDocument(app, secondOptions, {
      include: [
        UserModuleV2,
        OrderModuleV2,
        OrderItemModuleV2,
        MenuItemModuleV2,
        MenuModuleV2,
        CallModuleV2,
      ],
    });
  SwaggerModule.setup("/swagger/mobile", app, mobileDocumentFactory);

  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT || 8000);
}

bootstrap();
