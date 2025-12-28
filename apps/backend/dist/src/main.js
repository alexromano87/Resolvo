"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const express_1 = require("express");
function sanitizeObject(obj) {
    if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach((key) => {
            if (key.startsWith('$') || key.includes('.')) {
                delete obj[key];
            }
            else {
                sanitizeObject(obj[key]);
            }
        });
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use((0, express_1.json)({ limit: '2mb' }));
    app.use((0, express_1.urlencoded)({ limit: '2mb', extended: true }));
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('Referrer-Policy', 'no-referrer');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        sanitizeObject(req.body);
        sanitizeObject(req.query);
        sanitizeObject(req.params);
        next();
    });
    const nodeEnv = configService.get('NODE_ENV', 'development');
    const isProduction = nodeEnv === 'production';
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        configService.get('FRONTEND_URL'),
    ];
    if (isProduction) {
        const serverIp = '3.120.81.201';
        allowedOrigins.push(`http://${serverIp}`, `https://${serverIp}`, 'http://resolvo.com', 'https://resolvo.com');
    }
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.some(allowed => allowed && origin.startsWith(allowed))) {
                callback(null, true);
            }
            else {
                console.warn(`⚠️  CORS blocked origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Resolvo API')
        .setDescription('Documentazione automatica per i servizi REST di Resolvo')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'Bearer Auth')
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api-docs', app, swaggerDocument, {
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'list',
        },
    });
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🚀 RESOLVO Backend Started`);
    console.log(`${'='.repeat(50)}`);
    console.log(`🌍 Environment: ${nodeEnv}`);
    console.log(`🔗 Running on: http://localhost:${port}`);
    console.log(`📡 CORS Origins: ${allowedOrigins.filter(Boolean).join(', ')}`);
    console.log(`📊 Database: ${configService.get('DB_HOST')}:${configService.get('DB_PORT')}`);
    console.log(`${'='.repeat(50)}\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map