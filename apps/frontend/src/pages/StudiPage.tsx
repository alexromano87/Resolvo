import { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2, Power, PowerOff, X, Save } from 'lucide-react';
import { studiApi, type Studio, type CreateStudioDto } from '../api/studi';
import { useToast } from '../components/ui/ToastProvider';
import { useConfirmDialog } from '../components/ui/ConfirmDialog';
import { Pagination } from '../components/Pagination';
import { useAuth } from '../contexts/AuthContext';

export function StudiPage() {
  const { user: currentUser } = useAuth();
  const [studi, setStudi] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const [formData, setFormData] = useState<CreateStudioDto>({
    nome: '',
    ragioneSociale: '',
    partitaIva: '',
    codiceFiscale: '',
    indirizzo: '',
    citta: '',
    cap: '',
    provincia: '',
    telefono: '',
    email: '',
    pec: '',
  });

  const { success, error: toastError } = useToast();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    loadStudi();
  }, []);

  const loadStudi = async () => {
    setLoading(true);
    try {
      const data = await studiApi.getAll();
      setStudi(data);
    } catch (err: any) {
      toastError(err.message || 'Errore durante il caricamento degli studi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setSelectedStudio(null);
    setSubmitAttempted(false);
    setFormData({
      nome: '',
      ragioneSociale: '',
      partitaIva: '',
      codiceFiscale: '',
      indirizzo: '',
      citta: '',
      cap: '',
      provincia: '',
      telefono: '',
      email: '',
      pec: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (studio: Studio) => {
    setIsEditing(true);
    setSelectedStudio(studio);
    setSubmitAttempted(false);
    setFormData({
      nome: studio.nome,
      ragioneSociale: studio.ragioneSociale || '',
      partitaIva: studio.partitaIva || '',
      codiceFiscale: studio.codiceFiscale || '',
      indirizzo: studio.indirizzo || '',
      citta: studio.citta || '',
      cap: studio.cap || '',
      provincia: studio.provincia || '',
      telefono: studio.telefono || '',
      email: studio.email || '',
      pec: studio.pec || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudio(null);
    setSubmitAttempted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) {
      setSubmitAttempted(true);
      return;
    }

    try {
      if (isEditing && selectedStudio) {
        await studiApi.update(selectedStudio.id, formData);
        success('Studio aggiornato con successo');
      } else {
        await studiApi.create(formData);
        success('Studio creato con successo');
      }
      loadStudi();
      handleCloseModal();
    } catch (err: any) {
      setSubmitAttempted(true);
      toastError(err.message || 'Errore durante il salvataggio');
    }
  };

  const handleToggleActive = async (studio: Studio) => {
    const confirmed = await confirm({
      title: studio.attivo ? 'Disattivare studio?' : 'Attivare studio?',
      message: `Sei sicuro di voler ${studio.attivo ? 'disattivare' : 'attivare'} ${studio.nome}?`,
      confirmText: studio.attivo ? 'Disattiva' : 'Attiva',
      variant: 'warning',
    });

    if (confirmed) {
      try {
        await studiApi.toggleActive(studio.id);
        success(studio.attivo ? 'Studio disattivato' : 'Studio attivato');
        loadStudi();
      } catch (err: any) {
        toastError(err.message || "Errore durante l'operazione");
      }
    }
  };

  const handleDelete = async (studio: Studio) => {
    const confirmed = await confirm({
      title: 'Eliminare studio?',
      message: `Sei sicuro di voler eliminare ${studio.nome}? Questa azione è irreversibile.`,
      confirmText: 'Elimina',
      variant: 'danger',
    });

    if (confirmed) {
      try {
        await studiApi.remove(studio.id);
        success('Studio eliminato');
        loadStudi();
      } catch (err: any) {
        toastError(err.message || "Errore durante l'eliminazione");
      }
    }
  };

  if (currentUser?.ruolo !== 'admin') {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
        <Building2 className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-slate-100">
          Accesso negato
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Solo gli amministratori possono accedere a questa pagina.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 wow-stagger">
      {/* Header */}
      <div className="wow-card flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <span className="wow-chip">Amministrazione</span>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100 display-font">
            Gestione Studi Legali
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Gestisci gli studi legali della piattaforma
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="wow-button"
        >
          <Plus size={16} />
          Nuovo studio
        </button>
      </div>

      {/* Studios Table */}
      <div className="wow-panel overflow-hidden">
        <table className="min-w-full wow-stagger-rows divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Contatti
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300">
                P.IVA / CF
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Stato
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">
                  Caricamento...
                </td>
              </tr>
            ) : studi.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">
                  Nessuno studio trovato
                </td>
              </tr>
            ) : (
              studi
                .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                .map((studio) => (
                <tr key={studio.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-semibold text-white">
                        {studio.nome.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {studio.nome}
                        </div>
                        {studio.ragioneSociale && (
                          <div className="text-xs text-slate-500">{studio.ragioneSociale}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900 dark:text-slate-100">
                      {studio.email || '-'}
                    </div>
                    {studio.telefono && (
                      <div className="text-xs text-slate-500">{studio.telefono}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 dark:text-slate-100">
                      {studio.partitaIva || '-'}
                    </div>
                    {studio.codiceFiscale && (
                      <div className="text-xs text-slate-500">{studio.codiceFiscale}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        studio.attivo
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-400'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-400'
                      }`}
                    >
                      {studio.attivo ? 'Attivo' : 'Disattivato'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(studio)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Modifica"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(studio)}
                        className={studio.attivo ? 'text-amber-600 hover:text-amber-900' : 'text-indigo-600 hover:text-indigo-900'}
                        title={studio.attivo ? 'Disattiva' : 'Attiva'}
                      >
                        {studio.attivo ? <PowerOff size={16} /> : <Power size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(studio)}
                        className="text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300"
                        title="Elimina"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(studi.length / ITEMS_PER_PAGE)}
          totalItems={studi.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white p-6 dark:bg-slate-800 flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {isEditing ? 'Modifica studio' : 'Nuovo studio'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nome Studio *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className={`mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 ${
                    submitAttempted && !formData.nome.trim()
                      ? '!border-rose-400 !focus:border-rose-500 !focus:ring-rose-200'
                      : ''
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Ragione Sociale
                  </label>
                  <input
                    type="text"
                    value={formData.ragioneSociale}
                    onChange={(e) => setFormData({ ...formData, ragioneSociale: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Partita IVA
                  </label>
                  <input
                    type="text"
                    value={formData.partitaIva}
                    onChange={(e) => setFormData({ ...formData, partitaIva: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Codice Fiscale
                </label>
                <input
                  type="text"
                  value={formData.codiceFiscale}
                  onChange={(e) => setFormData({ ...formData, codiceFiscale: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Indirizzo
                </label>
                <input
                  type="text"
                  value={formData.indirizzo}
                  onChange={(e) => setFormData({ ...formData, indirizzo: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Città
                  </label>
                  <input
                    type="text"
                    value={formData.citta}
                    onChange={(e) => setFormData({ ...formData, citta: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    CAP
                  </label>
                  <input
                    type="text"
                    value={formData.cap}
                    onChange={(e) => setFormData({ ...formData, cap: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Provincia
                  </label>
                  <input
                    type="text"
                    value={formData.provincia}
                    onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  PEC
                </label>
                <input
                  type="email"
                  value={formData.pec}
                  onChange={(e) => setFormData({ ...formData, pec: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Save size={16} />
                  {isEditing ? 'Aggiorna' : 'Crea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog />
    </div>
  );
}
