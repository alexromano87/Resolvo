"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const auth_service_1 = require("./auth/auth.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const authService = app.get(auth_service_1.AuthService);
    try {
        console.log('🔐 Test login admin...');
        const result = await authService.login({
            email: 'admin@studio.it',
            password: 'admin123',
        });
        if ('access_token' in result && result.access_token) {
            console.log('✅ Login successful!');
            console.log('Token:', result.access_token.substring(0, 20) + '...');
            console.log('User:', result.user);
        }
        else {
            console.log('⚠️ 2FA required before issuing a token.');
            console.log('Channel:', result.channel);
            console.log('User ID:', result.userId);
        }
    }
    catch (error) {
        console.error('❌ Login failed:', error.message);
        console.error('Stack:', error.stack);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=test-login.js.map