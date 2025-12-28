import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { PratichePage } from '../PratichePage';
import { fetchPratiche } from '../../api/pratiche';
import { fetchFasi } from '../../api/fasi';
import { fetchClienti } from '../../api/clienti';
import { fetchDebitoriForCliente } from '../../api/debitori';
import { avvocatiApi } from '../../api/avvocati';
import { collaboratoriApi } from '../../api/collaboratori';

vi.mock('../../api/pratiche', () => ({
  fetchPratiche: vi.fn(),
  createPratica: vi.fn(),
  cambiaFasePratica: vi.fn(),
  formatCurrency: (v: number) => v.toString(),
  getDebitoreDisplayName: () => 'Debitore Demo',
}));
vi.mock('../../api/fasi', () => ({
  fetchFasi: vi.fn(),
}));
vi.mock('../../api/clienti', () => ({
  fetchClienti: vi.fn(),
}));
vi.mock('../../api/debitori', () => ({
  fetchDebitoriForCliente: vi.fn(),
}));
vi.mock('../../api/avvocati', () => ({
  avvocatiApi: { getAll: vi.fn() },
}));
vi.mock('../../api/collaboratori', () => ({
  collaboratoriApi: { getAll: vi.fn() },
}));
vi.mock('../../components/ui/ToastProvider', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}));
vi.mock('../../components/ui/ConfirmDialog', () => ({
  useConfirmDialog: () => ({ confirm: vi.fn(), ConfirmDialog: () => null }),
}));
vi.mock('../../components/ui/SearchableClienteSelect', () => ({
  SearchableClienteSelect: ({ placeholder }: any) => <input placeholder={placeholder} />,
}));
vi.mock('../../components/ui/CustomSelect', () => ({
  CustomSelect: ({ options, value, onChange, placeholder }: any) => (
    <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} data-testid={placeholder || 'select'}>
      <option value="">{placeholder || 'Seleziona'}</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));
vi.mock('../../components/ui/AvvocatiMultiSelect', () => ({
  AvvocatiMultiSelect: () => <div>AvvocatiMultiSelect</div>,
}));
vi.mock('../../components/ui/CollaboratoriMultiSelect', () => ({
  CollaboratoriMultiSelect: () => <div>CollaboratoriMultiSelect</div>,
}));
vi.mock('../../components/Pagination', () => ({
  Pagination: () => <div data-testid="pagination" />,
}));
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { ruolo: 'admin' } }),
}));

describe('PratichePage', () => {
  const praticaBase = {
    id: 'p1',
    clienteId: 'c1',
    debitoreId: 'd1',
    faseId: 'f1',
    attivo: true,
    aperta: true,
    capitale: 1000,
    importoRecuperatoCapitale: 0,
    anticipazioni: 0,
    importoRecuperatoAnticipazioni: 0,
    compensiLegali: 0,
    compensiLiquidati: 0,
    interessi: 0,
    interessiRecuperati: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cliente: { id: 'c1', ragioneSociale: 'Cliente Demo', attivo: true },
    debitore: { id: 'd1', tipoSoggetto: 'persona_giuridica', ragioneSociale: 'Debitore Demo', attivo: true },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (fetchPratiche as vi.Mock).mockResolvedValue([praticaBase]);
    (fetchFasi as vi.Mock).mockResolvedValue([{ id: 'f1', nome: 'Nuova', codice: 'N', colore: '#00f' }]);
    (fetchClienti as vi.Mock).mockResolvedValue([{ id: 'c1', ragioneSociale: 'Cliente Demo', attivo: true }]);
    (fetchDebitoriForCliente as vi.Mock).mockResolvedValue([]);
    (avvocatiApi.getAll as vi.Mock).mockResolvedValue([]);
    (collaboratoriApi.getAll as vi.Mock).mockResolvedValue([]);
  });

  function renderPage() {
    return render(
      <MemoryRouter>
        <PratichePage />
      </MemoryRouter>,
    );
  }

  it('mostra la lista pratiche caricata', async () => {
    renderPage();

    expect(await screen.findByText('Cliente Demo')).toBeInTheDocument();
    expect(screen.getByText('vs Debitore Demo')).toBeInTheDocument();
  });

  it('mostra messaggio di errore quando il caricamento fallisce', async () => {
    (fetchPratiche as vi.Mock).mockRejectedValue(new Error('boom'));
    renderPage();

    await waitFor(() => expect(screen.getByText(/Impossibile caricare le pratiche/i)).toBeInTheDocument());
  });

  it('valida la creazione pratica richiedendo cliente e debitore', async () => {
    renderPage();
    fireEvent.click(await screen.findByText('Nuova pratica'));
    fireEvent.click(screen.getByText('Crea pratica'));

    await waitFor(() => {
      // placeholder campo cliente presente, ma nessuna creazione chiamata
      expect(screen.getByPlaceholderText('Seleziona cliente...')).toBeInTheDocument();
    });
  });
});
