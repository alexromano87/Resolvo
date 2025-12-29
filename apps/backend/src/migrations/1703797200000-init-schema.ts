import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migrazione di bootstrap schema: crea tutte le tabelle principali.
 * Usa multipleStatements=true nel DataSource (già configurato).
 */
export class InitSchema1703797200000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      SET FOREIGN_KEY_CHECKS = 0;

      DROP TABLE IF EXISTS pratiche_collaboratori;
      DROP TABLE IF EXISTS pratiche_avvocati;
      DROP TABLE IF EXISTS cartelle_closure;
      DROP TABLE IF EXISTS notifications;
      DROP TABLE IF EXISTS audit_logs;
      DROP TABLE IF EXISTS documenti;
      DROP TABLE IF EXISTS cartelle;
      DROP TABLE IF EXISTS tickets;
      DROP TABLE IF EXISTS alerts;
      DROP TABLE IF EXISTS movimenti_finanziari;
      DROP TABLE IF EXISTS pratiche;
      DROP TABLE IF EXISTS clienti_debitori;
      DROP TABLE IF EXISTS debitori;
      DROP TABLE IF EXISTS clienti;
      DROP TABLE IF EXISTS avvocati;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS studi;

      CREATE TABLE studi (
        id varchar(36) NOT NULL,
        nome varchar(255) NOT NULL,
        ragioneSociale varchar(255) DEFAULT NULL,
        partitaIva varchar(255) DEFAULT NULL,
        codiceFiscale varchar(255) DEFAULT NULL,
        indirizzo varchar(255) DEFAULT NULL,
        citta varchar(255) DEFAULT NULL,
        cap varchar(255) DEFAULT NULL,
        provincia varchar(255) DEFAULT NULL,
        telefono varchar(255) DEFAULT NULL,
        email varchar(255) DEFAULT NULL,
        pec varchar(255) DEFAULT NULL,
        attivo tinyint NOT NULL DEFAULT 1,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE users (
        id varchar(36) NOT NULL,
        email varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        nome varchar(255) NOT NULL,
        cognome varchar(255) NOT NULL,
        telefono varchar(30) DEFAULT NULL,
        ruolo enum('admin','titolare_studio','avvocato','collaboratore','segreteria','cliente') NOT NULL DEFAULT 'collaboratore',
        clienteId varchar(36) DEFAULT NULL,
        studioId varchar(36) DEFAULT NULL,
        attivo tinyint NOT NULL DEFAULT 1,
        tokenVersion int NOT NULL DEFAULT 0,
        twoFactorEnabled tinyint NOT NULL DEFAULT 0,
        twoFactorChannel varchar(10) DEFAULT NULL,
        twoFactorCode varchar(12) DEFAULT NULL,
        twoFactorCodeExpires timestamp NULL DEFAULT NULL,
        twoFactorCodePurpose varchar(12) DEFAULT NULL,
        failedLoginAttempts int NOT NULL DEFAULT 0,
        lockoutUntil timestamp NULL DEFAULT NULL,
        refreshTokenHash varchar(255) DEFAULT NULL,
        refreshTokenExpiresAt timestamp NULL DEFAULT NULL,
        settings json DEFAULT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY IDX_users_email (email),
        KEY IDX_users_cliente (clienteId),
        KEY IDX_users_studio (studioId),
        CONSTRAINT FK_users_cliente FOREIGN KEY (clienteId) REFERENCES clienti (id) ON DELETE SET NULL ON UPDATE NO ACTION,
        CONSTRAINT FK_users_studio FOREIGN KEY (studioId) REFERENCES studi (id) ON DELETE SET NULL ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE avvocati (
        id varchar(36) NOT NULL,
        nome varchar(255) NOT NULL,
        cognome varchar(255) NOT NULL,
        telefono varchar(30) DEFAULT NULL,
        email varchar(255) DEFAULT NULL,
        pec varchar(255) DEFAULT NULL,
        partitaIva varchar(255) DEFAULT NULL,
        codiceFiscale varchar(255) DEFAULT NULL,
        attivo tinyint NOT NULL DEFAULT 1,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE clienti (
        id varchar(36) NOT NULL,
        ragioneSociale varchar(255) NOT NULL,
        piva varchar(255) DEFAULT NULL,
        codiceFiscale varchar(255) DEFAULT NULL,
        indirizzo varchar(255) DEFAULT NULL,
        citta varchar(255) DEFAULT NULL,
        cap varchar(20) DEFAULT NULL,
        provincia varchar(10) DEFAULT NULL,
        telefono varchar(30) DEFAULT NULL,
        email varchar(255) DEFAULT NULL,
        pec varchar(255) DEFAULT NULL,
        attivo tinyint NOT NULL DEFAULT 1,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE debitori (
        id varchar(36) NOT NULL,
        tipoSoggetto enum('persona_fisica','persona_giuridica') NOT NULL,
        nome varchar(255) DEFAULT NULL,
        cognome varchar(255) DEFAULT NULL,
        ragioneSociale varchar(255) DEFAULT NULL,
        codiceFiscale varchar(255) DEFAULT NULL,
        partitaIva varchar(255) DEFAULT NULL,
        indirizzo varchar(255) DEFAULT NULL,
        citta varchar(255) DEFAULT NULL,
        provincia varchar(255) DEFAULT NULL,
        cap varchar(20) DEFAULT NULL,
        telefono varchar(30) DEFAULT NULL,
        email varchar(255) DEFAULT NULL,
        pec varchar(255) DEFAULT NULL,
        attivo tinyint NOT NULL DEFAULT 1,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE clienti_debitori (
        clienteId varchar(36) NOT NULL,
        debitoreId varchar(36) NOT NULL,
        UNIQUE KEY UK_cliente_debitore (clienteId,debitoreId),
        KEY IDX_cd_debitore (debitoreId),
        CONSTRAINT FK_cd_cliente FOREIGN KEY (clienteId) REFERENCES clienti (id) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT FK_cd_debitore FOREIGN KEY (debitoreId) REFERENCES debitori (id) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE pratiche (
        id varchar(36) NOT NULL,
        clienteId varchar(36) NOT NULL,
        debitoreId varchar(36) NOT NULL,
        faseId varchar(36) DEFAULT NULL,
        aperta tinyint NOT NULL DEFAULT 1,
        esito enum('positivo','negativo') DEFAULT NULL,
        capitale decimal(15,2) NOT NULL DEFAULT 0.00,
        importoRecuperatoCapitale decimal(15,2) NOT NULL DEFAULT 0.00,
        anticipazioni decimal(15,2) NOT NULL DEFAULT 0.00,
        importoRecuperatoAnticipazioni decimal(15,2) NOT NULL DEFAULT 0.00,
        compensiLegali decimal(15,2) NOT NULL DEFAULT 0.00,
        compensiLiquidati decimal(15,2) NOT NULL DEFAULT 0.00,
        interessi decimal(15,2) NOT NULL DEFAULT 0.00,
        interessiRecuperati decimal(15,2) NOT NULL DEFAULT 0.00,
        note text DEFAULT NULL,
        riferimentoCredito varchar(255) DEFAULT NULL,
        opposizione json DEFAULT NULL,
        pignoramento json DEFAULT NULL,
        storico json DEFAULT NULL,
        dataAffidamento date DEFAULT NULL,
        dataChiusura date DEFAULT NULL,
        dataScadenza date DEFAULT NULL,
        attivo tinyint NOT NULL DEFAULT 1,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        KEY IDX_pratiche_cliente (clienteId),
        KEY IDX_pratiche_debitore (debitoreId),
        CONSTRAINT FK_pratiche_cliente FOREIGN KEY (clienteId) REFERENCES clienti (id) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT FK_pratiche_debitore FOREIGN KEY (debitoreId) REFERENCES debitori (id) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE movimenti_finanziari (
        id varchar(36) NOT NULL,
        praticaId varchar(36) NOT NULL,
        tipo varchar(50) NOT NULL,
        importo decimal(15,2) NOT NULL DEFAULT 0.00,
        valuta enum('EUR') NOT NULL DEFAULT 'EUR',
        data date NOT NULL,
        note text DEFAULT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        KEY IDX_movimenti_pratica (praticaId),
        CONSTRAINT FK_movimenti_pratica FOREIGN KEY (praticaId) REFERENCES pratiche (id) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE alerts (
        id varchar(36) NOT NULL,
        praticaId varchar(36) DEFAULT NULL,
        titolo varchar(255) NOT NULL,
        descrizione text,
        stato enum('in_gestione','chiuso') NOT NULL DEFAULT 'in_gestione',
        dataScadenza date DEFAULT NULL,
        dataChiusura date DEFAULT NULL,
        assegnatarioId varchar(36) DEFAULT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        KEY IDX_alerts_pratica (praticaId),
        KEY IDX_alerts_assegnatario (assegnatarioId),
        CONSTRAINT FK_alerts_pratica FOREIGN KEY (praticaId) REFERENCES pratiche (id) ON DELETE SET NULL ON UPDATE NO ACTION,
        CONSTRAINT FK_alerts_assegnatario FOREIGN KEY (assegnatarioId) REFERENCES users (id) ON DELETE SET NULL ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE tickets (
        id varchar(36) NOT NULL,
        praticaId varchar(36) DEFAULT NULL,
        clienteId varchar(36) DEFAULT NULL,
        titolo varchar(255) NOT NULL,
        descrizione text,
        priorita enum('bassa','normale','alta','urgente') NOT NULL DEFAULT 'normale',
        stato enum('aperto','in_lavorazione','chiuso') NOT NULL DEFAULT 'aperto',
        assegnatarioId varchar(36) DEFAULT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        KEY IDX_tickets_pratica (praticaId),
        KEY IDX_tickets_cliente (clienteId),
        KEY IDX_tickets_assegnatario (assegnatarioId),
        CONSTRAINT FK_tickets_pratica FOREIGN KEY (praticaId) REFERENCES pratiche (id) ON DELETE SET NULL ON UPDATE NO ACTION,
        CONSTRAINT FK_tickets_cliente FOREIGN KEY (clienteId) REFERENCES clienti (id) ON DELETE SET NULL ON UPDATE NO ACTION,
        CONSTRAINT FK_tickets_assegnatario FOREIGN KEY (assegnatarioId) REFERENCES users (id) ON DELETE SET NULL ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE cartelle (
        id varchar(36) NOT NULL,
        nome varchar(255) NOT NULL,
        praticaId varchar(36) DEFAULT NULL,
        parentId varchar(36) DEFAULT NULL,
        path varchar(1000) DEFAULT NULL,
        createdById varchar(36) DEFAULT NULL,
        updatedById varchar(36) DEFAULT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        KEY IDX_cartelle_pratica (praticaId),
        KEY IDX_cartelle_parent (parentId),
        KEY IDX_cartelle_createdBy (createdById),
        KEY IDX_cartelle_updatedBy (updatedById),
        CONSTRAINT FK_cartelle_pratica FOREIGN KEY (praticaId) REFERENCES pratiche (id) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT FK_cartelle_parent FOREIGN KEY (parentId) REFERENCES cartelle (id) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT FK_cartelle_createdBy FOREIGN KEY (createdById) REFERENCES users (id) ON DELETE SET NULL ON UPDATE NO ACTION,
        CONSTRAINT FK_cartelle_updatedBy FOREIGN KEY (updatedById) REFERENCES users (id) ON DELETE SET NULL ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE cartelle_closure (
        ancestor varchar(36) NOT NULL,
        descendant varchar(36) NOT NULL,
        depth int NOT NULL,
        PRIMARY KEY (ancestor, descendant),
        KEY IDX_cartelle_closure_desc (descendant),
        CONSTRAINT FK_cartelle_closure_ancestor FOREIGN KEY (ancestor) REFERENCES cartelle (id) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT FK_cartelle_closure_desc FOREIGN KEY (descendant) REFERENCES cartelle (id) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE documenti (
        id varchar(36) NOT NULL,
        nome varchar(255) NOT NULL,
        path varchar(1000) NOT NULL,
        tipo varchar(100) DEFAULT NULL,
        size int NOT NULL DEFAULT 0,
        mimeType varchar(255) DEFAULT NULL,
        praticaId varchar(36) DEFAULT NULL,
        cartellaId varchar(36) DEFAULT NULL,
        createdById varchar(36) DEFAULT NULL,
        updatedById varchar(36) DEFAULT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        KEY IDX_documenti_pratica (praticaId),
        KEY IDX_documenti_cartella (cartellaId),
        KEY IDX_documenti_createdBy (createdById),
        KEY IDX_documenti_updatedBy (updatedById),
        CONSTRAINT FK_documenti_pratica FOREIGN KEY (praticaId) REFERENCES pratiche (id) ON DELETE SET NULL ON UPDATE NO ACTION,
        CONSTRAINT FK_documenti_cartella FOREIGN KEY (cartellaId) REFERENCES cartelle (id) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT FK_documenti_createdBy FOREIGN KEY (createdById) REFERENCES users (id) ON DELETE SET NULL ON UPDATE NO ACTION,
        CONSTRAINT FK_documenti_updatedBy FOREIGN KEY (updatedById) REFERENCES users (id) ON DELETE SET NULL ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE audit_logs (
        id varchar(36) NOT NULL,
        userId varchar(36) DEFAULT NULL,
        action varchar(255) NOT NULL,
        entity varchar(255) DEFAULT NULL,
        entityId varchar(36) DEFAULT NULL,
        details json DEFAULT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        KEY IDX_audit_user (userId),
        CONSTRAINT FK_audit_user FOREIGN KEY (userId) REFERENCES users (id) ON DELETE SET NULL ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE notifications (
        id varchar(36) NOT NULL,
        userId varchar(36) NOT NULL,
        titolo varchar(255) NOT NULL,
        messaggio text NOT NULL,
        letto tinyint NOT NULL DEFAULT 0,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        KEY IDX_notifications_user (userId),
        CONSTRAINT FK_notifications_user FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE pratiche_avvocati (
        praticaId varchar(36) NOT NULL,
        avvocatoId varchar(36) NOT NULL,
        ruolo enum('principale','secondario') NOT NULL DEFAULT 'principale',
        UNIQUE KEY UK_pratica_avvocato (praticaId,avvocatoId),
        KEY IDX_pa_avvocato (avvocatoId),
        CONSTRAINT FK_pa_pratica FOREIGN KEY (praticaId) REFERENCES pratiche (id) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT FK_pa_avvocato FOREIGN KEY (avvocatoId) REFERENCES avvocati (id) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE pratiche_collaboratori (
        praticaId varchar(36) NOT NULL,
        collaboratoreId varchar(36) NOT NULL,
        UNIQUE KEY UK_pratica_collaboratore (praticaId, collaboratoreId),
        KEY IDX_pc_collaboratore (collaboratoreId),
        CONSTRAINT FK_pc_pratica FOREIGN KEY (praticaId) REFERENCES pratiche (id) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT FK_pc_collaboratore FOREIGN KEY (collaboratoreId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      SET FOREIGN_KEY_CHECKS = 1;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      SET FOREIGN_KEY_CHECKS = 0;
      DROP TABLE IF EXISTS pratiche_collaboratori;
      DROP TABLE IF EXISTS pratiche_avvocati;
      DROP TABLE IF EXISTS cartelle_closure;
      DROP TABLE IF EXISTS notifications;
      DROP TABLE IF EXISTS audit_logs;
      DROP TABLE IF EXISTS documenti;
      DROP TABLE IF EXISTS cartelle;
      DROP TABLE IF EXISTS tickets;
      DROP TABLE IF EXISTS alerts;
      DROP TABLE IF EXISTS movimenti_finanziari;
      DROP TABLE IF EXISTS pratiche;
      DROP TABLE IF EXISTS clienti_debitori;
      DROP TABLE IF EXISTS debitori;
      DROP TABLE IF EXISTS clienti;
      DROP TABLE IF EXISTS avvocati;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS studi;
      SET FOREIGN_KEY_CHECKS = 1;
    `);
  }
}
