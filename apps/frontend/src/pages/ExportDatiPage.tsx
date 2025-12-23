// apps/frontend/src/pages/ExportDatiPage.tsx
import { useState, useEffect } from 'react';
import { Download, Database, FileDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CustomSelect } from '../components/ui/CustomSelect';
import { studiApi, type Studio } from '../api/studi';
import { useAuth } from '../contexts/AuthContext';
import {
  exportData,
  backupStudio,
  ExportFormat,
  ExportEntity,
  ENTITY_LABELS,
  FORMAT_LABELS,
  type ExportRequest,
  type BackupStudioRequest,
} from '../api/export';

export function ExportDatiPage() {
  const { token } = useAuth();
  const [studi, setStudi] = useState<Studio[]>([]);
  const [loadingStudi, setLoadingStudi] = useState(true);

  // Export form state
  const [exportType, setExportType] = useState<'selective' | 'backup'>('selective');
  const [selectedStudioId, setSelectedStudioId] = useState<string>('');
  const [selectedEntity, setSelectedEntity] = useState<ExportEntity>(ExportEntity.PRATICHE);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(ExportFormat.CSV);
  const [dataInizio, setDataInizio] = useState('');
  const [dataFine, setDataFine] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Backup options
  const [includeDocuments, setIncludeDocuments] = useState(true);
  const [includeAuditLogs, setIncludeAuditLogs] = useState(false);

  // Status
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudi();
  }, []);

  const loadStudi = async () => {
    try {
      setLoadingStudi(true);
      const data = await studiApi.getAll();
      setStudi(data);
    } catch (err) {
      console.error('Errore caricamento studi:', err);
    } finally {
      setLoadingStudi(false);
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    setError(null);
    setSuccess(false);

    try {
      const request: ExportRequest = {
        entity: selectedEntity,
        format: selectedFormat,
        studioId: selectedStudioId || undefined,
        dataInizio: dataInizio || undefined,
        dataFine: dataFine || undefined,
        includeInactive,
        searchTerm: searchTerm || undefined,
      };

      await exportData(request, token || undefined);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Errore export:', err);
      setError(err.message || 'Errore durante l\'esportazione');
    } finally {
      setExporting(false);
    }
  };

  const handleBackupStudio = async () => {
    if (!selectedStudioId) {
      setError('Seleziona uno studio per il backup');
      return;
    }

    setExporting(true);
    setError(null);
    setSuccess(false);

    try {
      const request: BackupStudioRequest = {
        studioId: selectedStudioId,
        includeDocuments,
        includeAuditLogs,
      };

      await backupStudio(request, token || undefined);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Errore backup:', err);
      setError(err.message || 'Errore durante il backup');
    } finally {
      setExporting(false);
    }
  };

  const entityOptions = Object.entries(ENTITY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const formatOptions = Object.entries(FORMAT_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const studioOptions = [
    { value: '', label: 'Tutti gli studi' },
    ...studi.map((s) => ({
      value: s.id,
      label: s.nome,
      sublabel: s.partitaIva,
    })),
  ];

  return (
    <div className="space-y-6 wow-stagger">
      {/* Header */}
      <div className="wow-card space-y-2 p-5 md:p-6">
        <span className="wow-chip">Amministrazione</span>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50 display-font">
          Esportazione Dati
        </h1>
        <p className="max-w-3xl text-sm text-slate-500 dark:text-slate-400">
          Esporta dati delle tabelle in formato CSV, Excel o JSON per scopi legali, backup o analisi.
          Tutti gli export vengono registrati nell'audit log.
        </p>
      </div>

      {/* Status Messages */}
      {success && (
        <div className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Export completato con successo! Il file è stato scaricato.
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-400 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Export Type Selection */}
      <div className="wow-panel p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          Tipo di Esportazione
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setExportType('selective')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              exportType === 'selective'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            <FileDown className={`h-8 w-8 mb-3 ${exportType === 'selective' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
              Export Selettivo
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Esporta una tabella specifica con filtri personalizzati
            </p>
          </button>

          <button
            onClick={() => setExportType('backup')}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              exportType === 'backup'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            <Database className={`h-8 w-8 mb-3 ${exportType === 'backup' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
              Backup Completo Studio
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Backup completo di tutti i dati di uno studio in formato JSON
            </p>
          </button>
        </div>
      </div>

      {/* Export Selective Form */}
      {exportType === 'selective' && (
        <div className="wow-panel p-6 space-y-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Configurazione Export Selettivo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Studio Legale
              </label>
              <CustomSelect
                options={studioOptions}
                value={selectedStudioId}
                onChange={setSelectedStudioId}
                placeholder="Seleziona studio..."
                loading={loadingStudi}
              />
              <p className="mt-1 text-xs text-slate-500">
                Lascia vuoto per esportare da tutti gli studi
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tabella *
              </label>
              <CustomSelect
                options={entityOptions}
                value={selectedEntity}
                onChange={(value) => setSelectedEntity(value as ExportEntity)}
                placeholder="Seleziona tabella..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Formato *
              </label>
              <CustomSelect
                options={formatOptions}
                value={selectedFormat}
                onChange={(value) => setSelectedFormat(value as ExportFormat)}
                placeholder="Seleziona formato..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Ricerca
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-white/70 bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.12)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Termine di ricerca..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Data Inizio
              </label>
              <input
                type="date"
                value={dataInizio}
                onChange={(e) => setDataInizio(e.target.value)}
                className="w-full rounded-2xl border border-white/70 bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.12)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Data Fine
              </label>
              <input
                type="date"
                value={dataFine}
                onChange={(e) => setDataFine(e.target.value)}
                className="w-full rounded-2xl border border-white/70 bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.12)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={includeInactive}
                onChange={(e) => setIncludeInactive(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Includi record disattivati
            </label>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleExportData}
              disabled={exporting}
              className="wow-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-5 w-5" />
              {exporting ? 'Esportazione...' : 'Esporta Dati'}
            </button>
          </div>
        </div>
      )}

      {/* Backup Studio Form */}
      {exportType === 'backup' && (
        <div className="wow-panel p-6 space-y-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Configurazione Backup Completo
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Studio Legale *
              </label>
              <CustomSelect
                options={studi.map((s) => ({
                  value: s.id,
                  label: s.nome,
                  sublabel: s.partitaIva,
                }))}
                value={selectedStudioId}
                onChange={setSelectedStudioId}
                placeholder="Seleziona studio..."
                loading={loadingStudi}
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Opzioni Backup
              </p>

              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDocuments}
                  onChange={(e) => setIncludeDocuments(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Includi metadati documenti
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAuditLogs}
                  onChange={(e) => setIncludeAuditLogs(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Includi audit logs
              </label>
            </div>

            <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Nota:</strong> Il backup completo include tutte le tabelle con le relative
                relazioni in formato JSON. Questo file può essere utilizzato per il ripristino dei dati
                o per conformità legale (GDPR, audit).
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleBackupStudio}
              disabled={exporting || !selectedStudioId}
              className="wow-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Database className="h-5 w-5" />
              {exporting ? 'Creazione backup...' : 'Crea Backup Completo'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
