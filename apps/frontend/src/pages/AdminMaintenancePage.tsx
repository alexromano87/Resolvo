import { useEffect, useState } from 'react';
import { adminApi, type OrphanDataReport } from '../api/admin';
import { studiApi, type Studio } from '../api/studi';
import { CustomSelect } from '../components/ui/CustomSelect';
import { AlertTriangle, CheckCircle, Database } from 'lucide-react';

export default function AdminMaintenancePage() {
  const [orphanData, setOrphanData] = useState<OrphanDataReport | null>(null);
  const [studi, setStudi] = useState<Studio[]>([]);
  const [selectedStudio, setSelectedStudio] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [orphanDataRes, studiRes] = await Promise.all([
        adminApi.getOrphanData(),
        studiApi.getAll(),
      ]);
      setOrphanData(orphanDataRes);
      setStudi(studiRes);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Errore nel caricamento dei dati');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignOrphanData = async () => {
    if (!selectedStudio) {
      setError('Seleziona uno studio');
      return;
    }

    try {
      setAssigning(true);
      setError(null);
      setSuccess(null);

      const result = await adminApi.assignOrphanData(selectedStudio);
      setSuccess(`Dati assegnati con successo: ${JSON.stringify(result.updated)}`);

      // Ricarica i dati
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Errore nell\'assegnazione dei dati');
    } finally {
      setAssigning(false);
    }
  };

  const getTotalOrphans = () => {
    if (!orphanData) return 0;
    return (
      orphanData.praticheSenzaStudio +
      orphanData.clientiSenzaStudio +
      orphanData.debitoriSenzaStudio +
      orphanData.avvocatiSenzaStudio +
      orphanData.movimentiFinanziariSenzaStudio +
      orphanData.alertsSenzaStudio +
      orphanData.ticketsSenzaStudio +
      orphanData.documentiSenzaStudio +
      orphanData.cartelleSenzaStudio +
      orphanData.utentiSenzaStudio
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Caricamento dati...</p>
        </div>
      </div>
    );
  }

  const totalOrphans = getTotalOrphans();

  return (
    <div className="space-y-6 wow-stagger">
      <div className="wow-card p-4 md:p-5">
        <span className="wow-chip">Amministrazione</span>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 display-font">Manutenzione Dati</h1>
        <p className="mt-2 text-sm text-slate-600">Gestione dati orfani e integrità del sistema</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 px-4 py-3 rounded-2xl flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <p>{success}</p>
        </div>
      )}

      <div className="wow-panel">
        <div className="p-6 border-b border-slate-200/70">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="h-5 w-5" />
            Dati Orfani (senza studio assegnato)
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200/70 rounded-2xl bg-white/80">
            <span className="text-lg font-semibold">Totale Record Orfani</span>
            <span className={`text-2xl font-bold ${totalOrphans > 0 ? 'text-amber-600' : 'text-indigo-600'}`}>
              {totalOrphans}
            </span>
          </div>

          {orphanData && (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {[
                { label: 'Pratiche', value: orphanData.praticheSenzaStudio },
                { label: 'Clienti', value: orphanData.clientiSenzaStudio },
                { label: 'Debitori', value: orphanData.debitoriSenzaStudio },
                { label: 'Avvocati', value: orphanData.avvocatiSenzaStudio },
                { label: 'Movimenti Finanziari', value: orphanData.movimentiFinanziariSenzaStudio },
                { label: 'Alerts', value: orphanData.alertsSenzaStudio },
                { label: 'Tickets', value: orphanData.ticketsSenzaStudio },
                { label: 'Documenti', value: orphanData.documentiSenzaStudio },
                { label: 'Cartelle', value: orphanData.cartelleSenzaStudio },
                { label: 'Utenti', value: orphanData.utentiSenzaStudio },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center p-3 border border-slate-200/70 rounded-2xl bg-white/80">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className={`font-bold ${item.value > 0 ? 'text-amber-600' : 'text-indigo-600'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {totalOrphans > 0 && (
        <div className="wow-panel">
          <div className="p-6 border-b border-slate-200/70">
            <h2 className="text-xl font-semibold">Assegna Dati Orfani a uno Studio</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Seleziona Studio</label>
              <CustomSelect
                options={[
                  { value: '', label: 'Seleziona uno studio' },
                  ...studi.map((studio) => ({
                    value: studio.id,
                    label: studio.nome,
                    sublabel: studio.attivo ? undefined : 'Inattivo',
                  })),
                ]}
                value={selectedStudio}
                onChange={setSelectedStudio}
              />
            </div>

            <button onClick={handleAssignOrphanData} disabled={!selectedStudio || assigning} className="wow-button w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {assigning ? 'Assegnazione in corso...' : 'Assegna Tutti i Dati Orfani'}
            </button>

            <p className="text-sm text-slate-600">
              Attenzione: questa operazione assegnerà TUTTI i record senza studio allo studio selezionato. L'operazione è irreversibile.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
