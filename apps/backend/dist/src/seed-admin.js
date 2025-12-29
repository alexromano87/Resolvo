"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const users_service_1 = require("./users/users.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(users_service_1.UsersService);
    try {
        console.log('🔐 Creazione utente admin...');
        const adminUser = await usersService.create({
            email: 'admin@resolvo.it',
            password: 'admin123',
            nome: 'Admin',
            cognome: 'Resolvo',
            ruolo: 'admin',
            clienteId: null,
        });
        console.log('✅ Utente admin creato con successo!');
        console.log('📧 Email: admin@resolvo.it');
        console.log('🔑 Password: admin123');
        console.log('⚠️  Cambia la password dopo il primo accesso!');
        console.log('\nDettagli utente:', {
            id: adminUser.id,
            email: adminUser.email,
            nome: adminUser.nome,
            cognome: adminUser.cognome,
            ruolo: adminUser.ruolo,
        });
    }
    catch (error) {
        if (error.message?.includes('Email già registrata')) {
            console.log('ℹ️  Utente admin già esistente');
            console.log('📧 Email: admin@resolvo.it');
            console.log('🔑 Password: admin123 (se non è stata cambiata)');
        }
        else {
            console.error('❌ Errore durante la creazione dell\'utente admin:', error.message);
        }
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=seed-admin.js.map