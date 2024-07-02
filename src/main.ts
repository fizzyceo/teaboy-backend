import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

import "dotenv/config";
import * as swaggerUi from "swagger-ui-express";

import * as morgan from "morgan";
import * as compression from "compression";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(compression());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle("Basseer Restaurant App API")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const options = {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      defaultModelExpandDepth: -1,
      docExpansion: "none",
    },
  };
  app.use("/api", swaggerUi.serve, swaggerUi.setup(document, options));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
