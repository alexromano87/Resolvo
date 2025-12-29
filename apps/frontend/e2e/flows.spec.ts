import { test, expect } from '@playwright/test';

async function mockAuth(page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ id: 'u1', nome: 'Mario', cognome: 'Rossi', ruolo: 'admin', email: 'admin@example.com' }),
    );
    localStorage.setItem('auth_token', 'test-token');
  });
}

test.describe('Flussi principali (mock API)', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuth(page);
  });

  test('Documenti: lista, spostamento (mock)', async ({ page }) => {
    await page.route('**/documenti', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'doc-1',
            nome: 'Contratto Demo',
            nomeOriginale: 'contratto.pdf',
            tipo: 'pdf',
            dimensione: 1024,
          },
        ]),
      });
    });

    await page.route('**/cartelle**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'cart-1', nome: 'Cartella A' },
          { id: 'cart-2', nome: 'Cartella B' },
        ]),
      });
    });

    await page.route('**/pratiche**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    await page.goto('/documenti');

    await expect(page.getByRole('heading', { name: /Documenti/i })).toBeVisible();
    await expect(page.getByText('Contratto Demo')).toBeVisible();

    await page.getByTitle(/Sposta documento/i).click();
    await expect(page.getByText(/Cartella di destinazione/i)).toBeVisible();
  });

  test('Tickets e Alerts: carica liste (mock)', async ({ page }) => {
    await page.route('**/tickets**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 't1',
            numeroTicket: 'TK-1',
            oggetto: 'Richiesta supporto',
            descrizione: 'Dettagli',
            categoria: 'richiesta_informazioni',
            priorita: 'normale',
            stato: 'aperto',
            attivo: true,
            autore: 'Cliente',
            dataCreazione: new Date().toISOString(),
          },
        ]),
      });
    });

    await page.route('**/alerts**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'a1',
            titolo: 'Alert Demo',
            stato: 'in_gestione',
            descrizione: 'Promemoria',
            dataScadenza: new Date().toISOString(),
          },
        ]),
      });
    });

    await page.goto('/tickets');
    await expect(page.getByText(/TK-1/)).toBeVisible();
    await expect(page.getByText(/Richiesta supporto/)).toBeVisible();

    await page.goto('/alerts');
    await expect(page.getByText(/Alert Demo/)).toBeVisible();
  });

  test('Pratiche: apertura form creazione (mock clienti/debitori)', async ({ page }) => {
    await page.route('**/pratiche**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'p1',
            clienteId: 'c1',
            debitoreId: 'd1',
            faseId: 'f1',
            aperta: true,
            attivo: true,
            capitale: 1000,
            cliente: { id: 'c1', ragioneSociale: 'Cliente Demo', attivo: true },
            debitore: { id: 'd1', ragioneSociale: 'Debitore Demo', tipoSoggetto: 'persona_giuridica', attivo: true },
          },
        ]),
      });
    });

    await page.route('**/clienti**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'c1', ragioneSociale: 'Cliente Demo', attivo: true }]),
      });
    });

    await page.route('**/debitori**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'd1', ragioneSociale: 'Debitore Demo', tipoSoggetto: 'persona_giuridica', attivo: true }]),
      });
    });

    await page.goto('/pratiche');

    await expect(page.getByRole('heading', { name: /Pratiche/i })).toBeVisible();
    await page.getByRole('button', { name: /Nuova pratica/i }).click();
    await expect(page.getByText(/Nuova pratica/)).toBeVisible();
  });
});
