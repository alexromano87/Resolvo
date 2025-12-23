import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, RefreshCw, FileText } from 'lucide-react';
import { fetchPratica, type Pratica } from '../api/pratiche';

export function PraticaClienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pratica, setPratica] = useState<Pratica | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPratica = async () => {
    if (!id) {
      setError('Pratica non trovata');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPratica(id);
      setPratica(data);
    } catch (err) {
      console.error('Errore caricamento pratica cliente:', err);
      setError('Impossibile caricare i dettagli della pratica');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPratica();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !pratica) {
    return (
      <div className="text-center py-12">
        <p className="text-rose-600">{error || 'Pratica non disponibile'}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna indietro
        </button>
      </div>
    );
  }

  const clienteLabel = pratica.cliente?.ragioneSociale || 'Cliente';
  const debitoreLabel = pratica.debitore?.ragioneSociale
    || `${pratica.debitore?.nome ?? ''} ${pratica.debitore?.cognome ?? ''}`.trim()
    || 'Debitore';
  const formatAmount = (value: unknown) => {
    const num = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(num)) return '€ 0,00';
    return `€ ${num.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6 wow-stagger">
      <div className="wow-card flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <span className="wow-chip">Dettaglio pratica</span>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-50 display-font">
            {clienteLabel}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Pratica #{pratica.id.slice(0, 8)} • {pratica.fase?.nome || 'Fase non disponibile'}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna alle pratiche
        </button>
      </div>

      <div className="wow-panel p-6 space-y-6">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
          <FileText className="h-5 w-5 text-indigo-600" />
          Informazioni principali
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
            <p className="text-xs uppercase tracking-wide text-slate-400">Cliente</p>
            <p className="mt-1 font-semibold">{clienteLabel}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
            <p className="text-xs uppercase tracking-wide text-slate-400">Debitore</p>
            <p className="mt-1 font-semibold">{debitoreLabel}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
            <p className="text-xs uppercase tracking-wide text-slate-400">Stato</p>
            <p className="mt-1 font-semibold">{pratica.aperta ? 'Aperta' : 'Chiusa'}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
            <p className="text-xs uppercase tracking-wide text-slate-400">Fase</p>
            <p className="mt-1 font-semibold">{pratica.fase?.nome || 'N/D'}</p>
          </div>
        </div>
      </div>

      <div className="wow-panel p-6">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
          <FileText className="h-5 w-5 text-indigo-600" />
          Dati economici
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-700">
            <p className="text-xs uppercase tracking-wide text-slate-400">Capitale</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
              {formatAmount(pratica.capitale)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-700">
            <p className="text-xs uppercase tracking-wide text-slate-400">Recuperato</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
              {formatAmount(pratica.importoRecuperatoCapitale)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 text-sm dark:border-slate-700">
            <p className="text-xs uppercase tracking-wide text-slate-400">Interessi</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
              {formatAmount(pratica.interessi)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
