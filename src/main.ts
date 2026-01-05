import { INestApplication, Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import { json, urlencoded } from 'express';
import { IConfigService } from './common/config/config.interface';
import { ConfigService } from './common/config/config.service';
import { connectToDB } from './common/db/connect.db';
import { CommonException } from './common/filter/common.error';
import { AllExceptionFilter } from './common/filter/http-exception.filter';
import { TransformInterceptor } from './common/interceptor/response.interceptor';
import { UserAppModule } from './modules/user/user-app.module';

class App {
    private userApp: INestApplication;
    constructor(private readonly config: IConfigService) {}

    async bootstrap() {
        await connectToDB(this.config);

        const nestOptions: NestApplicationOptions = {
            logger: ['error', 'warn', 'debug', 'verbose', 'log'],
        };
        this.userApp = await NestFactory.create(UserAppModule, nestOptions);

        const apps = [this.userApp];
        for (const app of apps) {
            app.useGlobalPipes(
                new ValidationPipe({
                    whitelist: true,
                    transform: true,
                    exceptionFactory: (errors) => {
                        throw CommonException.Validation(errors);
                    },
                }),
            )
                .setGlobalPrefix('v1')
                .useGlobalFilters(new AllExceptionFilter())
                .useGlobalInterceptors(new TransformInterceptor())
                .enableCors();

            app.use(json({ limit: '10mb' }));
            app.use(urlencoded({ extended: true, limit: '10mb' }));

            app.use(compression());
        }

        const userDocument = await UserAppModule.createSwaggerDocument(this.userApp, this.config);
        SwaggerModule.setup('/docs', this.userApp, userDocument, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });

        await this.userApp.listen(this.config.get('USER_PORT'));
        Logger.log(this.config.get('USER_PORT'), 'USER_PORT');

        if (process && process.send) {
            console.log('APPLICATION IS READY');
            process.send('ready');
        }
    }
}

const app = new App(new ConfigService());

app.bootstrap();
