import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('../../api/documenti', () => ({
  documentiApi: {
    getAll: vi.fn().mockResolvedValue([]),
    getAllByCartella: vi.fn().mockResolvedValue([]),
    upload: vi.fn().mockResolvedValue({}),
    download: vi.fn().mockResolvedValue({}),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../api/cartelle', () => ({
  cartelleApi: {
    getAll: vi.fn().mockResolvedValue([]),
    getAncestors: vi.fn().mockResolvedValue([]),
    update: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../api/pratiche', () => ({
  fetchPratiche: vi.fn().mockResolvedValue([]),
  getDebitoreDisplayName: vi.fn().mockReturnValue(''),
}));

vi.mock('../../components/ui/ToastProvider', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

import { DocumentiPage } from '../DocumentiPage';
import { documentiApi } from '../../api/documenti';
import { cartelleApi } from '../../api/cartelle';

describe('DocumentiPage upload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(globalThis, 'confirm').mockReturnValue(true);
  });

  it('carica un documento dopo la selezione del file', async () => {
    render(<DocumentiPage />);

    await screen.findByRole('heading', { name: 'Documenti', level: 1 });

    fireEvent.click(screen.getByRole('button', { name: /Carica Documento/i }));

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeTruthy();

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByRole('button', { name: /^Carica$/i });
    expect(uploadButton).toBeEnabled();
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(documentiApi.upload).toHaveBeenCalled();
    });

    const payload = (documentiApi.upload as unknown as { mock: { calls: Array<[any]> } }).mock.calls[0][0];
    expect(payload.file).toBe(file);
    expect(payload.nome).toBe('test.pdf');
  });
});

describe('DocumentiPage actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(globalThis, 'confirm').mockReturnValue(true);
  });

  it('scarica un documento', async () => {
    (documentiApi.getAll as unknown as { mockResolvedValue: (v: any) => void }).mockResolvedValue([
      {
        id: 'doc-1',
        nome: 'Doc A',
        nomeOriginale: 'doc-a.pdf',
        tipo: 'pdf',
        dimensione: 1024,
      },
    ]);

    render(<DocumentiPage />);

    await waitFor(() => {
      expect(documentiApi.getAll).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.getByText('Doc A')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTitle('Scarica'));

    await waitFor(() => {
      expect(documentiApi.download).toHaveBeenCalledWith('doc-1');
    });
  });

  it('elimina un documento', async () => {
    (documentiApi.getAll as unknown as { mockResolvedValue: (v: any) => void }).mockResolvedValue([
      {
        id: 'doc-2',
        nome: 'Doc B',
        nomeOriginale: 'doc-b.pdf',
        tipo: 'pdf',
        dimensione: 2048,
      },
    ]);

    render(<DocumentiPage />);

    await waitFor(() => {
      expect(documentiApi.getAll).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.getByText('Doc B')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTitle('Elimina'));

    await waitFor(() => {
      expect(documentiApi.delete).toHaveBeenCalledWith('doc-2');
    });
  });

  it('crea una cartella', async () => {
    render(<DocumentiPage />);

    await screen.findByRole('heading', { name: 'Documenti', level: 1 });

    fireEvent.click(screen.getByRole('button', { name: /Nuova Cartella/i }));

    fireEvent.change(screen.getByLabelText('Nome *'), { target: { value: 'Cartella Test' } });

    fireEvent.click(screen.getByRole('button', { name: /^Crea$/i }));

    await waitFor(() => {
      expect(cartelleApi.create).toHaveBeenCalledWith(expect.objectContaining({ nome: 'Cartella Test' }));
    });
  });

  it('elimina una cartella', async () => {
    (cartelleApi.getAll as unknown as { mockResolvedValue: (v: any) => void }).mockResolvedValue([
      {
        id: 'cart-1',
        nome: 'Cartella Uno',
        colore: '#3b82f6',
        cartellaParent: null,
        documenti: [],
      },
    ]);

    render(<DocumentiPage />);

    await waitFor(() => {
      expect(cartelleApi.getAll).toHaveBeenCalled();
    });
    await screen.findByText('Cartella Uno');

    fireEvent.click(screen.getByTitle('Elimina cartella'));

    await waitFor(() => {
      expect(cartelleApi.delete).toHaveBeenCalledWith('cart-1');
    });
  });

  it('sposta un documento in un\'altra cartella', async () => {
    (documentiApi.getAll as unknown as { mockResolvedValue: (v: any) => void }).mockResolvedValue([
      {
        id: 'doc-3',
        nome: 'Doc C',
        nomeOriginale: 'doc-c.pdf',
        tipo: 'pdf',
        dimensione: 1024,
        cartellaId: null,
      },
    ]);
    (cartelleApi.getAll as unknown as { mockResolvedValue: (v: any) => void }).mockResolvedValue([
      { id: 'cart-1', nome: 'Cartella Origine' },
      { id: 'cart-2', nome: 'Cartella Destinazione' },
    ]);

    render(<DocumentiPage />);

    await waitFor(() => {
      expect(documentiApi.getAll).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.getByText('Doc C')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTitle('Sposta documento'));

    const label = await screen.findByText('Cartella di destinazione');
    const selectButton = label.parentElement?.querySelector('button');
    expect(selectButton).toBeTruthy();
    if (selectButton) {
      fireEvent.click(selectButton);
    }

    await screen.findByRole('button', { name: 'Cartella Destinazione' });
    fireEvent.click(screen.getByRole('button', { name: 'Cartella Destinazione' }));

    const moveButtons = screen.getAllByRole('button', { name: /^Sposta$/i });
    fireEvent.click(moveButtons[moveButtons.length - 1]);

    await waitFor(() => {
      expect(documentiApi.update).toHaveBeenCalledWith('doc-3', { cartellaId: 'cart-2' });
    });
  });
});
