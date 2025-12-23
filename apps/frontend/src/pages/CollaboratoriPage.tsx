// apps/frontend/src/pages/CollaboratoriPage.tsx
import { useEffect, useState } from 'react';
import {
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Users,
  X,
  Eye,
  EyeOff,
  Edit,
  Power,
  PowerOff,
  Trash2,
} from 'lucide-react';
import {
  collaboratoriApi,
  type CreateCollaboratoreDto,
  type UpdateCollaboratoreDto,
} from '../api/collaboratori';
import type { User as Collaboratore } from '../api/auth';
import { useToast } from '../components/ui/ToastProvider';
import { useConfirmDialog } from '../components/ui/ConfirmDialog';
import { Pagination } from '../components/Pagination';
import { useAuth } from '../contexts/AuthContext';

export function CollaboratoriPage() {
  const { user } = useAuth();
  const [collaboratori, setCollaboratori] = useState<Collaboratore[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedCollaboratore, setSelectedCollaboratore] = useState<Collaboratore | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { success, error: toastError } = useToast();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  if (!['admin', 'titolare_studio', 'segreteria'].includes(user?.ruolo ?? '')) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
        <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-slate-100">
          Accesso negato
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Non hai i permessi per accedere a questa sezione.
        </p>
      </div>
    );
  }

  const [formData, setFormData] = useState<CreateCollaboratoreDto>({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
  });

  const loadCollaboratori = async () => {
    try {
      setLoading(true);
      const data = await collaboratoriApi.getAll(showInactive);
      setCollaboratori(data);
      setError(null);
    } catch (err: any) {
      console.error('Errore caricamento collaboratori:', err);
      setError(err?.message || 'Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollaboratori();
  }, [showInactive]);

  const resetForm = () => {
    setFormData({
      nome: '',
      cognome: '',
      email: '',
      telefono: '',
    });
    setSubmitAttempted(false);
  };

  const handleCreate = async () => {
    if (!formData.nome || !formData.cognome || !formData.email) {
      setSubmitAttempted(true);
      toastError('Nome, cognome ed email sono obbligatori', 'Validazione');
      return;
    }

    if (await confirm({
      title: 'Conferma creazione',
      message: `Creare collaboratore ${formData.nome} ${formData.cognome}?`,
      confirmText: 'Crea',
      variant: 'info',
    })) {
      try {
        setSaving(true);
        await collaboratoriApi.create({
          nome: formData.nome,
          cognome: formData.cognome,
          email: formData.email,
          telefono: formData.telefono || undefined,
        });
        success('Collaboratore creato con successo');
        setShowInactive(true);
        await loadCollaboratori();
        setShowNewForm(false);
        setSubmitAttempted(false);
        resetForm();
      } catch (err: any) {
        setSubmitAttempted(true);
        toastError(err.message || 'Errore nella creazione');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleUpdate = async () => {
    if (!selectedCollaboratore) return;
    if (!formData.nome || !formData.cognome || !formData.email) {
      setSubmitAttempted(true);
      toastError('Nome, cognome ed email sono obbligatori', 'Validazione');
      return;
    }

    if (await confirm({
      title: 'Conferma modifica',
      message: `Salvare le modifiche per ${selectedCollaboratore.nome} ${selectedCollaboratore.cognome}?`,
      confirmText: 'Salva',
      variant: 'info',
    })) {
      try {
        setSaving(true);
        const updateDto: UpdateCollaboratoreDto = {
          nome: formData.nome,
          cognome: formData.cognome,
          email: formData.email,
          telefono: formData.telefono || undefined,
        };

        await collaboratoriApi.update(selectedCollaboratore.id, updateDto);
        success('Collaboratore aggiornato con successo');
        await loadCollaboratori();
        setIsEditing(false);
        setIsViewing(true);
        const updated = await collaboratoriApi.getAll(showInactive).then((data) =>
          data.find((c) => c.id === selectedCollaboratore.id),
        );
        if (updated) {
          setSelectedCollaboratore(updated);
          setFormData({
            nome: updated.nome,
            cognome: updated.cognome,
            email: updated.email,
            telefono: updated.telefono || '',
          });
        }
      } catch (err: any) {
        setSubmitAttempted(true);
        toastError(err.message || 'Errore nell\'aggiornamento');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDeactivate = async (collaboratore: Collaboratore) => {
    if (await confirm({
      title: 'Disattiva collaboratore',
      message: `Disattivare ${collaboratore.nome} ${collaboratore.cognome}?`,
      confirmText: 'Disattiva',
      variant: 'warning',
    })) {
      try {
        await collaboratoriApi.deactivate(collaboratore.id);
        success('Collaboratore disattivato');
        await loadCollaboratori();
      } catch (err: any) {
        toastError(err.message || 'Errore durante la disattivazione');
      }
    }
  };

  const handleReactivate = async (collaboratore: Collaboratore) => {
    try {
      await collaboratoriApi.reactivate(collaboratore.id);
      success('Collaboratore riattivato');
      await loadCollaboratori();
    } catch (err: any) {
      toastError(err.message || 'Errore durante la riattivazione');
    }
  };

  const handleDelete = async (collaboratore: Collaboratore) => {
    if (await confirm({
      title: 'Elimina collaboratore',
      message: `Eliminare definitivamente ${collaboratore.nome} ${collaboratore.cognome}? Questa operazione è irreversibile.`,
      confirmText: 'Elimina',
      variant: 'danger',
    })) {
      try {
        await collaboratoriApi.remove(collaboratore.id);
        success('Collaboratore eliminato');
        await loadCollaboratori();
      } catch (err: any) {
        toastError(err.message || 'Errore durante l\'eliminazione');
      }
    }
  };

  const handleRowClick = (collaboratore: Collaboratore) => {
    setSelectedCollaboratore(collaboratore);
    setFormData({
      nome: collaboratore.nome,
      cognome: collaboratore.cognome,
      email: collaboratore.email,
      telefono: collaboratore.telefono || '',
    });
    setIsViewing(true);
    setIsEditing(false);
  };

  const handleCloseDetail = () => {
    setSelectedCollaboratore(null);
    setIsViewing(false);
    setIsEditing(false);
    resetForm();
  };

  const handleStartEditing = () => {
    setIsViewing(false);
    setIsEditing(true);
    setSubmitAttempted(false);
  };

  const handleCancelEditing = () => {
    if (selectedCollaboratore) {
      setFormData({
        nome: selectedCollaboratore.nome,
        cognome: selectedCollaboratore.cognome,
        email: selectedCollaboratore.email,
        telefono: selectedCollaboratore.telefono || '',
      });
      setIsViewing(true);
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6 wow-stagger">
      <ConfirmDialog />

      <div className="wow-card flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-2">
          <span className="wow-chip">Studio</span>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50 display-font">Collaboratori</h1>
          <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
            Gestisci i collaboratori dello studio e il loro accesso alle pratiche.
          </p>
        </div>
        <button
          onClick={() => {
            setShowNewForm(true);
            setSubmitAttempted(false);
          }}
          className="wow-button"
        >
          <Plus className="h-4 w-4" />
          Nuovo Collaboratore
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-xs text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-400">
          {error}
        </div>
      )}

      <div className="wow-panel flex items-center gap-2 p-4">
        <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="flex items-center gap-1">
            {showInactive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            Mostra disattivati
          </span>
        </label>
        <button
          onClick={loadCollaboratori}
          disabled={loading}
          className="ml-auto p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-2xl"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="wow-panel overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-500">
            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            <span className="text-xs">Caricamento...</span>
          </div>
        ) : !collaboratori || collaboratori.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Users className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-xs">Nessun collaboratore</p>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full wow-stagger-rows">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Collaboratore</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Contatti</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Stato</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {collaboratori
                  .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                  .map((collaboratore) => (
                  <tr
                    key={collaboratore.id}
                    onClick={() => handleRowClick(collaboratore)}
                    className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${!collaboratore.attivo ? 'opacity-50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {collaboratore.nome} {collaboratore.cognome}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{collaboratore.ruolo}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <Mail className="h-3 w-3" />
                          {collaboratore.email}
                        </div>
                        {collaboratore.telefono && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                            <Phone className="h-3 w-3" />
                            {collaboratore.telefono}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        collaboratore.attivo
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                      }`}>
                        {collaboratore.attivo ? 'Attivo' : 'Disattivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {collaboratore.attivo ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeactivate(collaboratore);
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                            title="Disattiva"
                          >
                            <PowerOff className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReactivate(collaboratore);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            title="Riattiva"
                          >
                            <Power className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(collaboratore);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Elimina"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(collaboratori.length / ITEMS_PER_PAGE)}
              totalItems={collaboratori.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {(showNewForm || isEditing || isViewing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              if (isViewing) {
                handleCloseDetail();
              } else {
                setShowNewForm(false);
                setIsEditing(false);
                resetForm();
              }
            }}
          />
          <div className="relative z-10 w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl dark:bg-slate-900 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {isViewing ? 'Dettaglio Collaboratore' : isEditing ? 'Modifica Collaboratore' : 'Nuovo Collaboratore'}
              </h2>
              <div className="flex items-center gap-2">
                {isViewing && (
                  <button
                    onClick={handleStartEditing}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    title="Modifica"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                )}
                {isEditing && selectedCollaboratore && (
                  <button
                    onClick={handleCancelEditing}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-700"
                  >
                    Annulla
                  </button>
                )}
                <button
                  onClick={() => {
                    if (isViewing) {
                      handleCloseDetail();
                    } else {
                      setShowNewForm(false);
                      setIsEditing(false);
                      resetForm();
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    disabled={isViewing}
                    className={[
                      'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed',
                      submitAttempted && !formData.nome ? '!border-rose-400 !focus:border-rose-500 !focus:ring-rose-200' : '',
                    ].join(' ')}
                    placeholder="Marco"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Cognome *
                  </label>
                  <input
                    type="text"
                    value={formData.cognome}
                    onChange={(e) => setFormData({ ...formData, cognome: e.target.value })}
                    disabled={isViewing}
                    className={[
                      'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed',
                      submitAttempted && !formData.cognome ? '!border-rose-400 !focus:border-rose-500 !focus:ring-rose-200' : '',
                    ].join(' ')}
                    placeholder="Bianchi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isViewing}
                  className={[
                    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed',
                    submitAttempted && !formData.email ? '!border-rose-400 !focus:border-rose-500 !focus:ring-rose-200' : '',
                  ].join(' ')}
                  placeholder="marco.bianchi@studio.it"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Telefono
                </label>
                <input
                  type="text"
                  value={formData.telefono || ''}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  disabled={isViewing}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="+39 333 123 4567"
                />
              </div>

              {isViewing && selectedCollaboratore && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
                    <span className="block text-[11px] uppercase tracking-wide text-slate-400">Stato</span>
                    {selectedCollaboratore.attivo ? 'Attivo' : 'Disattivo'}
                  </div>
                </div>
              )}
            </div>

            {!isViewing && (
              <div className="flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-700 p-4">
                <button
                  onClick={() => {
                    setShowNewForm(false);
                    setIsEditing(false);
                    resetForm();
                  }}
                  className="wow-button-ghost"
                >
                  Annulla
                </button>
                <button
                  onClick={isEditing ? handleUpdate : handleCreate}
                  disabled={saving}
                  className="wow-button"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Salvataggio...
                    </>
                  ) : (
                    <>
                      {isEditing ? 'Salva modifiche' : 'Crea collaboratore'}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
