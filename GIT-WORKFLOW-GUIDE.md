# RESOLVO - Guida Completa Git Workflow

Guida pratica per la gestione del progetto RESOLVO con Git: branching strategy, workflow, comandi essenziali e best practices.

---

## Indice

1. [Cos'è Git e Perché Usarlo](#1-cosè-git-e-perché-usarlo)
2. [Setup Iniziale Git](#2-setup-iniziale-git)
3. [Concetti Fondamentali](#3-concetti-fondamentali)
4. [Branching Strategy per RESOLVO](#4-branching-strategy-per-resolvo)
5. [Workflow Completo](#5-workflow-completo)
6. [Comandi Git Essenziali](#6-comandi-git-essenziali)
7. [Gestione Branch](#7-gestione-branch)
8. [Commit Best Practices](#8-commit-best-practices)
9. [Collaborazione in Team](#9-collaborazione-in-team)
10. [Risoluzione Conflitti](#10-risoluzione-conflitti)
11. [Git con GitHub](#11-git-con-github)
12. [Scenari Comuni e Soluzioni](#12-scenari-comuni-e-soluzioni)
13. [Git Hooks per RESOLVO](#13-git-hooks-per-resolvo)
14. [Comandi Avanzati](#14-comandi-avanzati)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Cos'è Git e Perché Usarlo

### 1.1 Cos'è Git

Git è un **sistema di controllo versione distribuito** che ti permette di:

- 📝 Tracciare tutte le modifiche al codice nel tempo
- 🔄 Tornare a versioni precedenti quando necessario
- 👥 Collaborare con altri sviluppatori senza conflitti
- 🌿 Lavorare su più funzionalità in parallelo (branches)
- 🔍 Vedere chi ha modificato cosa e quando
- 🚀 Deployare versioni specifiche del codice

### 1.2 Vantaggi per RESOLVO

Per un progetto come RESOLVO:

- **Backup automatico**: Ogni commit è un punto di ripristino
- **Sviluppo parallelo**: Lavora su nuove feature senza rompere la versione stabile
- **Testing sicuro**: Testa modifiche su branch dedicati
- **Release gestite**: Versioni chiare (v1.0.0, v1.1.0, etc.)
- **Audit trail**: Traccia completa di tutte le modifiche al sistema

### 1.3 Terminologia Base

```
Repository (Repo): Progetto con storia completa delle modifiche
Commit: Snapshot del codice in un momento specifico
Branch: Linea di sviluppo indipendente
Merge: Unire modifiche da un branch ad un altro
Remote: Repository remoto (es. GitHub)
Clone: Copia locale di un repository remoto
Push: Inviare commit locali al remote
Pull: Scaricare commit dal remote
```

---

## 2. Setup Iniziale Git

### 2.1 Installazione Git

**macOS:**
```bash
# Verifica se già installato
git --version

# Installa con Homebrew (se non presente)
brew install git

# Oppure scarica da git-scm.com
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install git
git --version
```

**Windows:**
```bash
# Scarica da: https://git-scm.com/download/win
# Oppure usa Git Bash
```

### 2.2 Configurazione Identità

```bash
# Configura nome (sarà visibile nei commit)
git config --global user.name "Tuo Nome"

# Configura email
git config --global user.email "tua.email@example.com"

# Verifica configurazione
git config --list

# Editor preferito per commit messages
git config --global core.editor "code --wait"  # VS Code
# Oppure
git config --global core.editor "vim"          # Vim
```

### 2.3 Configurazioni Utili

```bash
# Colori nei comandi Git
git config --global color.ui auto

# Default branch name 'main' invece di 'master'
git config --global init.defaultBranch main

# Pull strategy (rebase invece di merge)
git config --global pull.rebase true

# Autocorrect comandi Git
git config --global help.autocorrect 20

# Alias utili
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.lg "log --oneline --graph --all --decorate"
```

### 2.4 Setup SSH per GitHub (Raccomandato)

```bash
# Genera chiave SSH
ssh-keygen -t ed25519 -C "tua.email@example.com"

# Premi Enter per path default e inserisci passphrase (opzionale)

# Copia chiave pubblica
cat ~/.ssh/id_ed25519.pub

# Aggiungi a GitHub:
# 1. Vai su GitHub.com > Settings > SSH and GPG keys
# 2. Click "New SSH key"
# 3. Incolla la chiave pubblica
# 4. Salva

# Testa connessione
ssh -T git@github.com
# Output: "Hi username! You've successfully authenticated..."
```

---

## 3. Concetti Fondamentali

### 3.1 Le Tre Aree di Git

```
┌──────────────────┐
│  Working Directory│  ← File sul tuo computer
│  (modifiche)     │
└────────┬─────────┘
         │ git add
         ↓
┌──────────────────┐
│  Staging Area    │  ← File pronti per commit
│  (Index)         │
└────────┬─────────┘
         │ git commit
         ↓
┌──────────────────┐
│  Repository      │  ← Storia permanente
│  (.git directory)│
└──────────────────┘
```

### 3.2 Stati dei File

```bash
# Untracked: File nuovo, Git non lo traccia ancora
# Modified: File modificato ma non staged
# Staged: File pronto per essere committato
# Committed: File salvato nel repository

# Verifica stato corrente
git status
```

### 3.3 Lifecycle dei File

```
Untracked ──(git add)──> Staged ──(git commit)──> Committed
                            ↑                          │
                            │                          │
Modified ────(git add)──────┘                          │
   ↑                                                    │
   └──────────────────(modifica file)──────────────────┘
```

---

## 4. Branching Strategy per RESOLVO

### 4.1 Strategia Consigliata: Git Flow Semplificato

```
main (production)
  │
  ├─── develop (sviluppo attivo)
  │      │
  │      ├─── feature/nuova-funzionalita
  │      ├─── feature/dashboard-miglioramenti
  │      ├─── bugfix/correzione-login
  │      └─── hotfix/security-patch
  │
  └─── release/v1.0.0 (preparazione release)
```

### 4.2 Branch Principali

#### **main** (Production)
- Codice in produzione
- Sempre stabile e deployabile
- Solo merge da `release` o `hotfix`
- Taggato con versioni (v1.0.0, v1.1.0)

```bash
# Visualizza branch main
git checkout main
git log --oneline
```

#### **develop** (Development)
- Branch di integrazione principale
- Contiene ultime modifiche completate
- Base per nuove feature
- Periodicamente diventa `release`

```bash
# Crea e passa a develop
git checkout -b develop
```

### 4.3 Branch di Supporto

#### **feature/** (Nuove Funzionalità)
- Base: `develop`
- Merge in: `develop`
- Naming: `feature/nome-funzionalita`

```bash
# Esempi per RESOLVO
feature/dashboard-analytics
feature/export-excel
feature/notifiche-email
feature/gestione-avvocati
```

#### **bugfix/** (Correzioni Bug)
- Base: `develop`
- Merge in: `develop`
- Naming: `bugfix/descrizione-bug`

```bash
# Esempi
bugfix/fix-login-timeout
bugfix/correzione-calcolo-importi
```

#### **hotfix/** (Correzioni Urgenti Produzione)
- Base: `main`
- Merge in: `main` E `develop`
- Naming: `hotfix/descrizione-problema`

```bash
# Esempio
hotfix/security-jwt-vulnerability
```

#### **release/** (Preparazione Release)
- Base: `develop`
- Merge in: `main` E `develop`
- Naming: `release/v1.0.0`

```bash
# Esempio
release/v1.0.0
release/v1.1.0
```

### 4.4 Convenzioni Naming

```bash
# Feature branches
feature/nome-funzionalita-breve         # ✅ Buono
feature/RESOLVO-123-nuova-dashboard     # ✅ Con ticket ID
feat/dashboard                          # ✅ Abbreviato
nuova-dashboard                         # ❌ No prefix

# Bugfix branches
bugfix/fix-login-error                  # ✅ Buono
fix/login-timeout                       # ✅ Abbreviato
bugfix/RESOLVO-456-login               # ✅ Con ticket ID

# Hotfix branches
hotfix/v1.0.1-security-patch           # ✅ Con versione
hotfix/critical-db-error               # ✅ Descrittivo

# Release branches
release/v1.0.0                         # ✅ Semantic versioning
release/1.0.0                          # ✅ Anche ok
release-1.0                            # ❌ No dash invece di slash
```

---

## 5. Workflow Completo

### 5.1 Workflow Nuova Feature

```bash
# 1. Assicurati di essere aggiornato
git checkout develop
git pull origin develop

# 2. Crea branch feature
git checkout -b feature/export-documenti

# 3. Lavora sulla feature, fai commit regolari
git add apps/backend/src/export/
git commit -m "feat: aggiungi service export documenti"

git add apps/frontend/src/pages/ExportPage.tsx
git commit -m "feat: crea pagina export documenti"

# 4. Push del branch (primo push)
git push -u origin feature/export-documenti

# 5. Continua a lavorare e push
git add .
git commit -m "feat: aggiungi filtri export"
git push

# 6. Quando completo, aggiorna da develop
git checkout develop
git pull origin develop
git checkout feature/export-documenti
git merge develop
# Risolvi eventuali conflitti

# 7. Push finale
git push

# 8. Crea Pull Request su GitHub/GitLab
# Oppure merge locale:
git checkout develop
git merge feature/export-documenti
git push origin develop

# 9. Elimina branch feature (dopo merge)
git branch -d feature/export-documenti
git push origin --delete feature/export-documenti
```

### 5.2 Workflow Bugfix

```bash
# 1. Parti da develop aggiornato
git checkout develop
git pull origin develop

# 2. Crea branch bugfix
git checkout -b bugfix/fix-pratica-validation

# 3. Correggi il bug
# ... modifica codice ...
git add apps/backend/src/pratiche/dto/create-pratica.dto.ts
git commit -m "fix: correggi validazione importo pratica"

# 4. Test
npm run test
npm run build

# 5. Push e merge
git push -u origin bugfix/fix-pratica-validation
# Crea PR o merge diretto in develop
```

### 5.3 Workflow Hotfix (Emergenza Produzione)

```bash
# 1. Parti da main (IMPORTANTE!)
git checkout main
git pull origin main

# 2. Crea branch hotfix
git checkout -b hotfix/v1.0.1-jwt-security

# 3. Applica fix critico
# ... modifica codice ...
git add apps/backend/src/auth/jwt.strategy.ts
git commit -m "security: fix JWT token validation"

# 4. Test approfondito
npm run test
npm run build

# 5. Merge in main
git checkout main
git merge hotfix/v1.0.1-jwt-security
git tag -a v1.0.1 -m "Hotfix: JWT security patch"
git push origin main --tags

# 6. Merge anche in develop (IMPORTANTE!)
git checkout develop
git merge hotfix/v1.0.1-jwt-security
git push origin develop

# 7. Elimina branch hotfix
git branch -d hotfix/v1.0.1-jwt-security
git push origin --delete hotfix/v1.0.1-jwt-security

# 8. Deploy urgente in produzione
```

### 5.4 Workflow Release

```bash
# 1. Quando develop è pronto per release
git checkout develop
git pull origin develop

# 2. Crea branch release
git checkout -b release/v1.1.0

# 3. Aggiorna versione in package.json
# Modifica apps/backend/package.json e apps/frontend/package.json
git add apps/*/package.json
git commit -m "chore: bump version to 1.1.0"

# 4. Test finali e bugfix minori
# ... eventuali ultimi fix ...
git commit -am "fix: correzioni minori pre-release"

# 5. Merge in main
git checkout main
git merge release/v1.1.0
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin main --tags

# 6. Merge in develop
git checkout develop
git merge release/v1.1.0
git push origin develop

# 7. Elimina branch release
git branch -d release/v1.1.0
git push origin --delete release/v1.1.0

# 8. Deploy in produzione
```

---

## 6. Comandi Git Essenziali

### 6.1 Inizializzazione e Clone

```bash
# Inizializza nuovo repository
git init

# Clone repository esistente
git clone https://github.com/username/recupero-crediti.git
git clone git@github.com:username/recupero-crediti.git  # SSH

# Clone in directory specifica
git clone git@github.com:username/recupero-crediti.git myproject

# Clone solo branch specifico
git clone -b develop git@github.com:username/recupero-crediti.git
```

### 6.2 Status e Info

```bash
# Status corrente (file modificati, staged, etc.)
git status

# Status conciso
git status -s

# Mostra branch corrente
git branch --show-current

# Lista tutti i branch (locali e remoti)
git branch -a

# Log commit
git log
git log --oneline
git log --graph --oneline --all --decorate

# Mostra modifiche specifico commit
git show <commit-hash>

# Mostra chi ha modificato ogni riga di un file
git blame <file>
```

### 6.3 Modifiche e Staging

```bash
# Aggiungi file specifico allo staging
git add <file>

# Aggiungi tutti i file modificati
git add .

# Aggiungi solo file .ts
git add "*.ts"

# Aggiungi interattivo (scegli cosa stageare)
git add -p

# Rimuovi file dallo staging (mantieni modifiche)
git reset <file>

# Rimuovi tutti i file dallo staging
git reset

# Scarta modifiche file (ATTENZIONE: irreversibile)
git checkout -- <file>

# Scarta tutte le modifiche non staged
git checkout -- .
```

### 6.4 Commit

```bash
# Commit con messaggio
git commit -m "feat: aggiungi nuova funzionalità"

# Commit con messaggio multi-linea
git commit -m "feat: aggiungi export Excel" -m "Implementa export documenti in formato Excel con filtri per data e tipo pratica"

# Commit di tutti i file modificati (skip staging)
git commit -am "fix: correggi bug validazione"

# Modifica ultimo commit (messaggio o file)
git commit --amend -m "feat: nuovo messaggio corretto"

# Aggiungi file dimenticato all'ultimo commit
git add file-dimenticato.ts
git commit --amend --no-edit
```

### 6.5 Push e Pull

```bash
# Push branch corrente al remote
git push

# Primo push di nuovo branch (set upstream)
git push -u origin feature/nuova-funzionalita

# Push tutti i branch
git push --all

# Push tags
git push --tags

# Pull (fetch + merge)
git pull

# Pull con rebase invece di merge
git pull --rebase

# Pull da branch specifico
git pull origin develop

# Fetch (scarica senza merge)
git fetch origin

# Fetch e prune (rimuovi branch remoti eliminati)
git fetch --prune
```

---

## 7. Gestione Branch

### 7.1 Creazione e Switch

```bash
# Crea nuovo branch (resta sul branch corrente)
git branch feature/nuova-feature

# Crea e passa al nuovo branch
git checkout -b feature/nuova-feature

# Nuovo comando switch (Git 2.23+)
git switch -c feature/nuova-feature

# Passa a branch esistente
git checkout develop
git switch develop  # Alternativa moderna

# Passa al branch precedente
git checkout -
git switch -
```

### 7.2 Visualizzazione Branch

```bash
# Lista branch locali
git branch

# Lista branch remoti
git branch -r

# Lista tutti i branch (locali e remoti)
git branch -a

# Visualizza branch con ultimo commit
git branch -v

# Branch già mergiati in develop
git checkout develop
git branch --merged

# Branch non ancora mergiati
git branch --no-merged
```

### 7.3 Eliminazione Branch

```bash
# Elimina branch locale (se già mergiato)
git branch -d feature/completata

# Forza eliminazione branch (anche se non mergiato)
git branch -D feature/da-eliminare

# Elimina branch remoto
git push origin --delete feature/vecchia

# Elimina branch locale di tracking remoto eliminato
git fetch --prune
```

### 7.4 Merge Branch

```bash
# Merge feature in develop
git checkout develop
git merge feature/nuova-funzionalita

# Merge con messaggio custom
git merge feature/nuova-funzionalita -m "Merge nuova funzionalità export"

# Merge senza fast-forward (crea sempre commit merge)
git merge --no-ff feature/nuova-funzionalita

# Abort merge in caso di conflitti
git merge --abort
```

### 7.5 Rebase (Alternativa a Merge)

```bash
# Rebase feature su develop (applica commit feature sopra develop)
git checkout feature/nuova-funzionalita
git rebase develop

# Se ci sono conflitti, risolvili e:
git add .
git rebase --continue

# Salta commit conflittuale
git rebase --skip

# Abort rebase
git rebase --abort

# Rebase interattivo (riordina, squash, edit commit)
git rebase -i HEAD~3  # Ultimi 3 commit
```

---

## 8. Commit Best Practices

### 8.1 Formato Commit Messages (Conventional Commits)

```bash
# Formato:
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
```bash
feat:      # Nuova funzionalità
fix:       # Bug fix
docs:      # Documentazione
style:     # Formattazione, missing semicolons, etc
refactor:  # Refactoring codice
perf:      # Performance improvements
test:      # Aggiunta test
chore:     # Manutenzione (deps, build, etc)
ci:        # CI/CD changes
build:     # Build system changes
revert:    # Revert commit precedente
```

**Esempi per RESOLVO:**

```bash
# Feature
git commit -m "feat(pratiche): aggiungi filtro per fase pratica"
git commit -m "feat(export): implementa export Excel documenti"
git commit -m "feat(auth): aggiungi autenticazione 2FA"

# Bug fix
git commit -m "fix(login): correggi validazione email case-sensitive"
git commit -m "fix(dashboard): risolvi errore calcolo totali"
git commit -m "fix(api): gestisci correttamente errori timeout DB"

# Refactoring
git commit -m "refactor(users): estrai logic validation in service separato"
git commit -m "refactor(frontend): converti class components in functional"

# Documentation
git commit -m "docs: aggiungi guida deployment Lightsail"
git commit -m "docs(api): documenta endpoint pratiche con esempi"

# Chore
git commit -m "chore: aggiorna dipendenze backend"
git commit -m "chore(deps): bump @nestjs/core da 11.0.0 a 11.0.1"

# Breaking changes
git commit -m "feat(auth)!: cambia formato JWT payload"
# Oppure
git commit -m "feat(auth): cambia formato JWT payload

BREAKING CHANGE: Il payload JWT ora include campo 'studioId' obbligatorio"
```

### 8.2 Regole Commit Messages

1. **Usa imperativo**: "add" non "added" o "adds"
   ```bash
   ✅ "feat: add user validation"
   ❌ "feat: added user validation"
   ```

2. **Prima riga max 50 caratteri**
   ```bash
   ✅ "feat: add Excel export"
   ❌ "feat: aggiungi funzionalità di export dei documenti in formato Excel con filtri"
   ```

3. **Body opzionale max 72 caratteri per riga**
   ```bash
   git commit -m "feat: add document export" -m "Implementa export documenti PDF e Excel.

   - Aggiungi service ExportService
   - Crea endpoint GET /api/export/documenti
   - Implementa UI pagina export con filtri"
   ```

4. **Separatore tra subject e body**
   ```bash
   feat: add user management

   Implementa CRUD completo per gestione utenti.
   Include validazione email e controllo permessi.
   ```

5. **Riferimenti issue/ticket in footer**
   ```bash
   fix: correggi calcolo importi

   Risolve bug nel calcolo degli importi recuperati
   per pratiche con più movimenti finanziari.

   Closes #123
   Ref #456
   ```

### 8.3 Quando Committare

```bash
# ✅ COMMIT FREQUENTI
- Ogni funzionalità completa e testata
- Ogni bug fix funzionante
- Fine giornata lavorativa
- Prima di switch branch

# ❌ NON COMMITTARE
- Codice che non compila
- Codice con console.log/debugger
- File generati (node_modules, dist, .env)
- Segreti o password
```

### 8.4 Atomic Commits

Ogni commit dovrebbe essere **atomico** (una modifica logica):

```bash
# ❌ MALE - Commit troppo grande
git add .
git commit -m "feat: varie modifiche"

# ✅ BENE - Commit separati logicamente
git add apps/backend/src/pratiche/pratiche.service.ts
git commit -m "feat(pratiche): aggiungi metodo filtraggio per fase"

git add apps/backend/src/pratiche/pratiche.controller.ts
git commit -m "feat(pratiche): esponi endpoint GET /pratiche/filter"

git add apps/frontend/src/pages/PratichePage.tsx
git commit -m "feat(frontend): aggiungi UI filtri pratiche"
```

---

## 9. Collaborazione in Team

### 9.1 Fork e Pull Request (GitHub Flow)

```bash
# 1. Fork repository su GitHub (click Fork button)

# 2. Clone il TUO fork
git clone git@github.com:tuo-username/recupero-crediti.git
cd recupero-crediti

# 3. Aggiungi upstream (repository originale)
git remote add upstream git@github.com:original-owner/recupero-crediti.git

# 4. Verifica remotes
git remote -v
# origin    git@github.com:tuo-username/recupero-crediti.git (fetch)
# origin    git@github.com:tuo-username/recupero-crediti.git (push)
# upstream  git@github.com:original-owner/recupero-crediti.git (fetch)
# upstream  git@github.com:original-owner/recupero-crediti.git (push)

# 5. Crea branch per feature
git checkout -b feature/mia-nuova-feature

# 6. Lavora e commit
git add .
git commit -m "feat: aggiungi nuova funzionalità"

# 7. Push sul TUO fork
git push origin feature/mia-nuova-feature

# 8. Apri Pull Request su GitHub
# Vai su GitHub > tuo fork > "Compare & pull request"

# 9. Sincronizza con upstream regolarmente
git fetch upstream
git checkout develop
git merge upstream/develop
git push origin develop
```

### 9.2 Code Review Process

```bash
# Dopo aver ricevuto feedback su PR:

# 1. Applica modifiche richieste
# ... modifica codice ...

# 2. Commit modifiche
git add .
git commit -m "refactor: applica feedback code review"

# 3. Push aggiornamenti (aggiorna PR automaticamente)
git push

# 4. Se richiesto di squashare commit:
git rebase -i HEAD~3  # Ultimi 3 commit
# Cambia 'pick' in 'squash' per commit da unire
git push --force
```

### 9.3 Protezione Branch Main/Develop

Su GitHub/GitLab, configura **branch protection rules**:

```yaml
Branch: main
- Require pull request before merging
- Require approvals: 1
- Require status checks to pass:
  - CI/CD build
  - Tests
  - Lint
- Require conversation resolution before merging
- Do not allow bypassing

Branch: develop
- Require pull request before merging
- Require status checks to pass
```

### 9.4 Sincronizzazione Team

```bash
# Prima di iniziare lavoro ogni giorno:
git checkout develop
git pull origin develop

# Prima di creare nuovo branch:
git fetch origin
git checkout develop
git pull

# Prima di aprire PR:
git fetch origin
git checkout develop
git pull
git checkout feature/mia-feature
git merge develop  # Risolvi conflitti qui, non nella PR
```

---

## 10. Risoluzione Conflitti

### 10.1 Cosa Sono i Conflitti

I conflitti accadono quando due branch modificano le stesse righe di codice:

```bash
# Situazione:
git checkout develop
git merge feature/export-excel

# Output:
Auto-merging apps/backend/src/export/export.service.ts
CONFLICT (content): Merge conflict in apps/backend/src/export/export.service.ts
Automatic merge failed; fix conflicts and then commit the result.
```

### 10.2 Identificare Conflitti

```bash
# Verifica file in conflitto
git status

# Output:
# Unmerged paths:
#   both modified:   apps/backend/src/export/export.service.ts
```

### 10.3 Marker Conflitti

I file in conflitto contengono marker speciali:

```typescript
export class ExportService {
  async exportData(format: string) {
<<<<<<< HEAD (develop - branch corrente)
    if (format === 'pdf') {
      return this.exportPDF();
    }
=======
    if (format === 'excel') {
      return this.exportExcel();
    }
>>>>>>> feature/export-excel (branch da mergare)
  }
}
```

**Legenda:**
- `<<<<<<< HEAD`: Inizio modifiche branch corrente
- `=======`: Separatore
- `>>>>>>> feature/export-excel`: Fine modifiche branch da mergare

### 10.4 Risoluzione Manuale

```typescript
// Rimuovi marker e scegli versione corretta:

// OPZIONE 1: Mantieni solo develop (HEAD)
export class ExportService {
  async exportData(format: string) {
    if (format === 'pdf') {
      return this.exportPDF();
    }
  }
}

// OPZIONE 2: Mantieni solo feature
export class ExportService {
  async exportData(format: string) {
    if (format === 'excel') {
      return this.exportExcel();
    }
  }
}

// OPZIONE 3: Combina entrambe (MIGLIORE)
export class ExportService {
  async exportData(format: string) {
    if (format === 'pdf') {
      return this.exportPDF();
    }
    if (format === 'excel') {
      return this.exportExcel();
    }
  }
}
```

### 10.5 Completare il Merge

```bash
# 1. Dopo aver risolto i conflitti manualmente
git add apps/backend/src/export/export.service.ts

# 2. Verifica che tutti i conflitti siano risolti
git status

# 3. Completa il merge
git commit -m "merge: risolvi conflitti tra develop e feature/export-excel"

# 4. Push
git push
```

### 10.6 Tool Visuali per Conflitti

```bash
# Usa merge tool (VS Code, Meld, KDiff3, etc.)
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd "code --wait $MERGED"

# Quando c'è conflitto:
git mergetool

# Apre VS Code con interfaccia visuale per risolvere conflitti
```

### 10.7 Abort Merge

```bash
# Se confuso e vuoi annullare il merge:
git merge --abort

# Torna allo stato pre-merge
```

### 10.8 Prevenire Conflitti

```bash
# ✅ BEST PRACTICES
1. Pull frequente da develop
2. Merge develop nella tua feature prima di aprire PR
3. Commit atomici e frequenti
4. Comunica con team su file condivisi
5. Usa branch piccoli e short-lived
```

---

## 11. Git con GitHub

### 11.1 Creazione Repository GitHub

```bash
# 1. Crea repo su GitHub.com (web interface)

# 2. Connetti repository locale esistente
cd /path/to/recupero-crediti
git remote add origin git@github.com:username/recupero-crediti.git
git branch -M main
git push -u origin main

# 3. Oppure inizia da zero
git init
git add .
git commit -m "chore: initial commit"
git remote add origin git@github.com:username/recupero-crediti.git
git push -u origin main
```

### 11.2 Pull Request Workflow

```bash
# 1. Crea branch feature
git checkout -b feature/nuova-funzionalita

# 2. Lavora e commit
git add .
git commit -m "feat: implementa nuova funzionalità"

# 3. Push branch
git push -u origin feature/nuova-funzionalita

# 4. Apri PR su GitHub
# - Vai su repository GitHub
# - Click "Compare & pull request"
# - Compila descrizione PR:

Title: feat: Implementa export documenti Excel

Description:
## Descrizione
Implementa funzionalità export documenti in formato Excel con filtri.

## Modifiche
- Aggiungi ExportService per generazione Excel
- Crea endpoint GET /api/export/documenti
- Implementa UI pagina export con filtri data/tipo

## Testing
- [ ] Test unitari ExportService
- [ ] Test integrazione endpoint
- [ ] Test manuale UI

## Screenshot
[Aggiungi screenshot se rilevante]

Closes #123

# 5. Request review
# - Assegna reviewer
# - Aggiungi labels (feature, backend, frontend)
# - Collega issue

# 6. Dopo approvazione, merge PR
# - Opzione 1: Merge commit (mantiene storia)
# - Opzione 2: Squash and merge (combina commit)
# - Opzione 3: Rebase and merge (linearizza storia)
```

### 11.3 GitHub Issues

```bash
# Linking commit a issue
git commit -m "feat: aggiungi export

Closes #123
Fixes #456
Ref #789"

# Keywords che chiudono automaticamente issue:
# - close, closes, closed
# - fix, fixes, fixed
# - resolve, resolves, resolved
```

### 11.4 GitHub Actions (CI/CD)

Crea `.github/workflows/ci.yml`:

```yaml
name: CI/CD RESOLVO

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd apps/backend
          npm ci

      - name: Lint
        run: |
          cd apps/backend
          npm run lint

      - name: Build
        run: |
          cd apps/backend
          npm run build

      - name: Test
        run: |
          cd apps/backend
          npm run test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd apps/frontend
          npm ci

      - name: Build
        run: |
          cd apps/frontend
          npm run build
```

### 11.5 GitHub Releases

```bash
# 1. Crea tag per versione
git tag -a v1.0.0 -m "Release version 1.0.0 - Initial production release"
git push origin v1.0.0

# 2. Crea Release su GitHub
# - Vai su repository > Releases > "Draft a new release"
# - Seleziona tag v1.0.0
# - Titolo: "RESOLVO v1.0.0"
# - Descrizione:

## RESOLVO v1.0.0

### Nuove Funzionalità
- Gestione completa pratiche recupero crediti
- Dashboard analytics con grafici
- Sistema autenticazione con JWT
- Export documenti PDF/Excel

### Bug Fixes
- Corretto calcolo importi recuperati
- Risolto timeout login

### Breaking Changes
Nessuno

### Deployment
Vedi [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)

# - Allega build artifacts (opzionale)
# - Publish release
```

---

## 12. Scenari Comuni e Soluzioni

### 12.1 Ho committato sul branch sbagliato

```bash
# Situazione: commit su main invece che feature
git checkout main
git log  # Vedo il commit sbagliato

# Soluzione:
# 1. Salva hash del commit
git log --oneline  # Es: abc1234

# 2. Torna indietro di 1 commit su main
git reset --hard HEAD~1

# 3. Passa a branch corretto (o crealo)
git checkout -b feature/nuova-funzionalita

# 4. Applica il commit
git cherry-pick abc1234
```

### 12.2 Voglio annullare l'ultimo commit (non ancora pushed)

```bash
# Opzione 1: Mantieni modifiche (unstage commit)
git reset --soft HEAD~1
# File restano modificati e staged

# Opzione 2: Mantieni modifiche (unstage tutto)
git reset HEAD~1
# File restano modificati ma non staged

# Opzione 3: ELIMINA modifiche (ATTENZIONE!)
git reset --hard HEAD~1
# File tornano allo stato del commit precedente
```

### 12.3 Voglio annullare commit già pushed

```bash
# NON usare reset se già pushed!

# Opzione 1: Revert (crea nuovo commit che annulla)
git revert <commit-hash>
git push

# Opzione 2: Revert multipli commit
git revert HEAD~3..HEAD  # Ultimi 3 commit

# Opzione 3: Revert ultimo commit
git revert HEAD
```

### 12.4 Ho committato file sensibili (.env, passwords)

```bash
# IMMEDIATO - Prima di push
git reset --soft HEAD~1
git restore --staged .env
git commit -m "feat: aggiungi configurazione"

# Se già pushed - ATTENZIONE: riscrive storia
git rm --cached .env
git commit -m "chore: rimuovi .env da git"
git push

# Aggiungi a .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: aggiungi .env a .gitignore"

# Se credenziali compromesse: CAMBIALE IMMEDIATAMENTE!
```

### 12.5 Voglio unire ultimi 3 commit in uno solo

```bash
# Rebase interattivo
git rebase -i HEAD~3

# Editor si apre con:
pick abc1234 feat: aggiungi export
pick def5678 fix: correggi export
pick ghi9012 refactor: migliora export

# Cambia in:
pick abc1234 feat: aggiungi export
squash def5678 fix: correggi export
squash ghi9012 refactor: migliora export

# Salva, editor si riapre per messaggio finale
# Scrivi nuovo messaggio:
feat: implementa export documenti Excel completo

# Force push se già pushed
git push --force
```

### 12.6 Voglio recuperare branch eliminato

```bash
# Trova hash ultimo commit del branch
git reflog

# Output:
# abc1234 HEAD@{2}: checkout: moving from feature/old to develop
# def5678 HEAD@{3}: commit: feat: ultima modifica

# Ricrea branch
git checkout -b feature/old def5678
```

### 12.7 Ho modifiche non committed e devo switchare branch

```bash
# Opzione 1: Stash (salva temporaneamente)
git stash
git checkout altro-branch
# ... lavora ...
git checkout branch-originale
git stash pop  # Riapplica modifiche

# Opzione 2: Stash con messaggio
git stash save "WIP: modifiche export in corso"
git stash list
git stash apply stash@{0}

# Opzione 3: Commit temporaneo
git add .
git commit -m "WIP: work in progress"
# Poi quando torni:
git reset --soft HEAD~1
```

### 12.8 Pull con conflitti

```bash
# Situazione:
git pull origin develop
# CONFLICT ...

# Opzione 1: Risolvi conflitti
git status  # Vedi file in conflitto
# Risolvi manualmente
git add .
git commit -m "merge: risolvi conflitti"

# Opzione 2: Abort e usa rebase
git merge --abort
git pull --rebase origin develop
# Risolvi conflitti se presenti
git add .
git rebase --continue
```

### 12.9 Voglio aggiornare fork con upstream

```bash
# Aggiungi upstream (una volta)
git remote add upstream git@github.com:original-owner/recupero-crediti.git

# Fetch upstream
git fetch upstream

# Merge upstream/main nel tuo main
git checkout main
git merge upstream/main

# Push al tuo fork
git push origin main

# Stesso per develop
git checkout develop
git merge upstream/develop
git push origin develop
```

### 12.10 File continua a essere tracked nonostante .gitignore

```bash
# Problema: file già committed prima di aggiungerlo a .gitignore

# Soluzione:
git rm --cached <file>
git commit -m "chore: untrack file"

# Per directory:
git rm -r --cached apps/backend/uploads/
git commit -m "chore: untrack uploads directory"
```

---

## 13. Git Hooks per RESOLVO

### 13.1 Cos'è un Git Hook

Hook = Script che si eseguono automaticamente a certi eventi Git.

```bash
# Hooks disponibili:
.git/hooks/
  ├── pre-commit        # Prima di ogni commit
  ├── commit-msg        # Valida messaggio commit
  ├── pre-push          # Prima di push
  ├── post-merge        # Dopo merge
  └── ...
```

### 13.2 Pre-commit Hook (Lint + Format)

```bash
# Crea file .git/hooks/pre-commit
nano .git/hooks/pre-commit
```

```bash
#!/bin/bash

echo "🔍 Running pre-commit checks..."

# Backend lint
echo "Linting backend..."
cd apps/backend
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Backend lint failed. Fix errors and try again."
  exit 1
fi

# Frontend lint (se presente)
echo "Linting frontend..."
cd ../frontend
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Frontend lint failed. Fix errors and try again."
  exit 1
fi

# Backend build
echo "Building backend..."
cd ../backend
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Backend build failed. Fix errors and try again."
  exit 1
fi

echo "✅ All pre-commit checks passed!"
exit 0
```

```bash
# Rendi eseguibile
chmod +x .git/hooks/pre-commit
```

### 13.3 Commit-msg Hook (Conventional Commits)

```bash
# Crea file .git/hooks/commit-msg
nano .git/hooks/commit-msg
```

```bash
#!/bin/bash

commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

# Pattern Conventional Commits
pattern="^(feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert)(\(.+\))?: .{1,50}"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "❌ Commit message non valido!"
  echo ""
  echo "Formato richiesto: <type>(<scope>): <subject>"
  echo ""
  echo "Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert"
  echo ""
  echo "Esempi:"
  echo "  feat(pratiche): aggiungi filtro per fase"
  echo "  fix(auth): correggi validazione JWT"
  echo "  docs: aggiorna README"
  echo ""
  exit 1
fi

echo "✅ Commit message valido"
exit 0
```

```bash
chmod +x .git/hooks/commit-msg
```

### 13.4 Pre-push Hook (Tests)

```bash
nano .git/hooks/pre-push
```

```bash
#!/bin/bash

echo "🧪 Running tests before push..."

# Backend tests
cd apps/backend
npm run test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Push aborted."
  exit 1
fi

echo "✅ All tests passed!"
exit 0
```

```bash
chmod +x .git/hooks/pre-push
```

### 13.5 Husky (Hook Manager - Raccomandato)

```bash
# Installa Husky nel root del progetto
npm install --save-dev husky
npx husky init

# Crea hook pre-commit
echo "npm run lint && npm run build" > .husky/pre-commit

# Crea hook commit-msg
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg

# Installa commitlint
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Crea commitlint.config.js
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

---

## 14. Comandi Avanzati

### 14.1 Cherry-pick (Applicare Commit Specifico)

```bash
# Applica commit da altro branch
git checkout feature/destinazione
git cherry-pick abc1234

# Cherry-pick multipli commit
git cherry-pick abc1234 def5678 ghi9012

# Cherry-pick range
git cherry-pick abc1234..ghi9012
```

### 14.2 Bisect (Trova Commit che ha Introdotto Bug)

```bash
# Inizia bisect
git bisect start

# Marca commit corrente come bad (ha il bug)
git bisect bad

# Marca commit buono (senza bug)
git bisect good v1.0.0

# Git checkout commit nel mezzo, testa:
# Se bug presente:
git bisect bad
# Se bug assente:
git bisect good

# Ripeti finché Git trova il commit colpevole
# Quando trovato:
git bisect reset  # Torna a HEAD
```

### 14.3 Reflog (Storia Completa)

```bash
# Mostra tutti i movimenti HEAD (anche reset, rebase, etc.)
git reflog

# Recupera commit "perso"
git reflog
# Trova hash del commit
git checkout -b recupero abc1234
```

### 14.4 Filter-branch (Riscrittura Storia)

```bash
# ATTENZIONE: Riscrive storia completa!

# Rimuovi file da tutta la storia
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Alternativa moderna: git-filter-repo
pip install git-filter-repo
git filter-repo --path .env --invert-paths
```

### 14.5 Worktree (Multiple Working Directories)

```bash
# Crea worktree per hotfix mentre lavori su feature
git worktree add ../resolvo-hotfix hotfix/security-patch

# Ora hai due directory:
# - recupero-crediti/ (feature/export)
# - resolvo-hotfix/ (hotfix/security-patch)

# Lavora nel worktree
cd ../resolvo-hotfix
# ... fix bug ...
git commit -am "fix: security patch"
git push

# Torna al worktree principale
cd ../recupero-crediti

# Rimuovi worktree
git worktree remove ../resolvo-hotfix
```

### 14.6 Submodules (Dipendenze Git)

```bash
# Aggiungi submodule
git submodule add git@github.com:org/shared-lib.git libs/shared

# Clone repo con submodules
git clone --recurse-submodules git@github.com:user/recupero-crediti.git

# Update submodules
git submodule update --remote

# Rimuovi submodule
git submodule deinit libs/shared
git rm libs/shared
rm -rf .git/modules/libs/shared
```

---

## 15. Troubleshooting

### 15.1 "Permission denied (publickey)"

```bash
# Problema: SSH key non configurata

# Soluzione:
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# Copia e aggiungi a GitHub > Settings > SSH keys
```

### 15.2 "fatal: not a git repository"

```bash
# Problema: Non sei in una directory Git

# Soluzione:
git init
# Oppure
cd /path/to/git/repo
```

### 15.3 "Your branch and 'origin/main' have diverged"

```bash
# Problema: Storia locale diversa da remoto

# Soluzione 1: Pull e merge
git pull origin main

# Soluzione 2: Pull con rebase
git pull --rebase origin main

# Soluzione 3: Force push (ATTENZIONE: sovrascrivi remote)
git push --force origin main
```

### 15.4 "Merge conflict in ..."

```bash
# Vedi sezione 10 "Risoluzione Conflitti"

# Quick fix:
git status  # Vedi file in conflitto
# Modifica file, risolvi marker <<<<<<< =======  >>>>>>>
git add <file-risolto>
git commit -m "merge: risolvi conflitti"
```

### 15.5 "fatal: refusing to merge unrelated histories"

```bash
# Problema: Due repository separati

# Soluzione:
git pull origin main --allow-unrelated-histories
```

### 15.6 File troppo grande per GitHub (>100MB)

```bash
# Problema: GitHub limita file a 100MB

# Soluzione 1: Rimuovi file
git rm --cached file-grande.zip
git commit -m "chore: rimuovi file troppo grande"

# Soluzione 2: Usa Git LFS
git lfs install
git lfs track "*.zip"
git add .gitattributes
git commit -m "chore: configura Git LFS"
```

### 15.7 "detached HEAD state"

```bash
# Problema: Checkout di commit specifico invece di branch

# Soluzione 1: Torna a branch
git checkout main

# Soluzione 2: Crea branch da qui
git checkout -b new-branch-name
```

### 15.8 Commit con autore sbagliato

```bash
# Ultimo commit:
git commit --amend --author="Nome Corretto <email@corretta.com>"

# Commit precedenti:
git rebase -i HEAD~3
# Cambia 'pick' in 'edit' per commit da modificare
# Per ognuno:
git commit --amend --author="Nome Corretto <email@corretta.com>"
git rebase --continue
```

---

## 16. .gitignore per RESOLVO

Crea `.gitignore` nel root del progetto:

```bash
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.development
.env.production
.env.test

# Database
*.sqlite
*.db

# Uploads (production usa S3)
apps/backend/uploads/

# Logs
logs/
*.log

# OS
.DS_Store
Thumbs.db
.vscode/
.idea/

# Testing
coverage/
.nyc_output/

# Temporary files
*.tmp
*.temp
*.swp
*~

# Secrets
*.pem
*.key
secrets/
credentials.json
```

---

## 17. Cheat Sheet Rapido

```bash
# SETUP
git config --global user.name "Nome"
git config --global user.email "email@example.com"
git clone <url>

# STATUS & INFO
git status
git log --oneline --graph --all
git diff

# BRANCH
git branch                    # Lista branch
git branch -a                 # Tutti (remoti inclusi)
git checkout -b feature/nome  # Crea e switch
git branch -d feature/nome    # Elimina

# COMMIT
git add .
git commit -m "type: message"
git commit --amend

# SYNC
git pull
git push
git push -u origin branch-name

# MERGE
git merge feature/nome
git merge --abort

# STASH
git stash
git stash pop
git stash list

# UNDO
git reset HEAD~1              # Undo commit
git checkout -- file          # Scarta modifiche
git revert <commit>           # Undo commit pushed

# REMOTE
git remote -v
git remote add origin <url>
git fetch origin
```

---

## 18. Resources

### Documentazione Ufficiale
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)

### Tools Utili
- [GitKraken](https://www.gitkraken.com/) - GUI Git
- [Sourcetree](https://www.sourcetreeapp.com/) - GUI Git
- [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) - VS Code extension
- [commitizen](https://github.com/commitizen/cz-cli) - Conventional commits helper

### Best Practices
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

**Ultima modifica**: 2025-12-23
**Versione**: 1.0.0
**Progetto**: RESOLVO - Recupero Crediti Management System
