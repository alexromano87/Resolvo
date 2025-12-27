# Guida: Creare una Nuova Repository Git

Guida completa per creare una repository Git da zero, sia localmente che su GitHub/GitLab.

---

## Indice

1. [Scenario 1: Progetto Nuovo da Zero](#scenario-1-progetto-nuovo-da-zero)
2. [Scenario 2: Progetto Esistente Locale](#scenario-2-progetto-esistente-locale)
3. [Scenario 3: Fork di Repository Esistente](#scenario-3-fork-di-repository-esistente)
4. [Scenario 4: Template Repository](#scenario-4-template-repository)
5. [Setup Repository Completo](#setup-repository-completo)
6. [Best Practices Iniziali](#best-practices-iniziali)

---

## Scenario 1: Progetto Nuovo da Zero

### Opzione A: Prima GitHub, Poi Locale

**Passo 1: Crea Repository su GitHub**

1. Vai su [GitHub.com](https://github.com)
2. Click sul pulsante **"+"** in alto a destra > **"New repository"**
3. Compila il form:

```
Repository name: nome-progetto
Description: Breve descrizione del progetto
Public/Private: Scegli visibilità
☑ Add a README file
☑ Add .gitignore (scegli template: Node)
☑ Choose a license (es. MIT)
```

4. Click **"Create repository"**

**Passo 2: Clone in Locale**

```bash
# Clone via SSH (raccomandato)
git clone git@github.com:tuo-username/nome-progetto.git

# Oppure via HTTPS
git clone https://github.com/tuo-username/nome-progetto.git

# Entra nella directory
cd nome-progetto

# Verifica
git status
git remote -v
```

**Passo 3: Inizia a Lavorare**

```bash
# Crea struttura progetto
mkdir -p src tests docs
touch src/index.ts
touch README.md

# Primo commit
git add .
git commit -m "chore: setup iniziale progetto"
git push origin main
```

### Opzione B: Prima Locale, Poi GitHub

**Passo 1: Crea Directory e Inizializza Git**

```bash
# Crea directory progetto
mkdir nome-progetto
cd nome-progetto

# Inizializza Git
git init

# Output: Initialized empty Git repository in /path/to/nome-progetto/.git/
```

**Passo 2: Crea Struttura Base**

```bash
# Crea .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*

# Environment
.env
.env.local

# Build
dist/
build/
*.tsbuildinfo

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
EOF

# Crea README
cat > README.md << 'EOF'
# Nome Progetto

Descrizione breve del progetto.

## Installazione

```bash
npm install
```

## Utilizzo

```bash
npm start
```

## License

MIT
EOF

# Crea package.json (per progetti Node.js)
npm init -y
```

**Passo 3: Primo Commit Locale**

```bash
# Aggiungi tutti i file
git add .

# Primo commit
git commit -m "chore: initial commit"

# Verifica
git log --oneline
# Output: abc1234 (HEAD -> main) chore: initial commit
```

**Passo 4: Crea Repository su GitHub**

1. Vai su [GitHub.com](https://github.com)
2. Click **"+"** > **"New repository"**
3. **IMPORTANTE**: NON selezionare README, .gitignore o license (già creati localmente)
4. Solo nome e descrizione:

```
Repository name: nome-progetto
Description: Breve descrizione
Public/Private: Scegli
```

5. Click **"Create repository"**

**Passo 5: Collega Locale a GitHub**

GitHub ti mostra i comandi, eseguili:

```bash
# Aggiungi remote
git remote add origin git@github.com:tuo-username/nome-progetto.git

# Verifica remote
git remote -v
# Output:
# origin  git@github.com:tuo-username/nome-progetto.git (fetch)
# origin  git@github.com:tuo-username/nome-progetto.git (push)

# Rinomina branch in main (se necessario)
git branch -M main

# Push iniziale
git push -u origin main

# Output: Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**Passo 6: Verifica su GitHub**

Apri browser e vai a `https://github.com/tuo-username/nome-progetto`

Dovresti vedere:
- File README.md visualizzato
- Tutti i file committati
- 1 commit nella storia

---

## Scenario 2: Progetto Esistente Locale

Hai già un progetto sul tuo computer senza Git.

### Passo 1: Inizializza Git nella Directory Esistente

```bash
# Vai nella directory del progetto
cd /path/to/progetto-esistente

# Inizializza Git
git init

# Verifica
ls -la
# Dovresti vedere directory .git/
```

### Passo 2: Crea .gitignore

```bash
# Importante: escludi file che non vanno tracciati
touch .gitignore

# Apri in editor
nano .gitignore
# Oppure
code .gitignore
```

Esempio per progetto Node.js/NestJS:

```bash
# .gitignore
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
uploads/
```

### Passo 3: Staging e Commit Iniziale

```bash
# Verifica cosa verrà committato
git status

# Se ci sono troppi file, aggiungi a .gitignore prima!

# Stage tutti i file
git add .

# Verifica staging
git status

# Primo commit
git commit -m "chore: initial commit - progetto esistente"
```

### Passo 4: Crea Repository Remota

Vai su GitHub e crea repository vuota (come sopra).

### Passo 5: Connetti e Push

```bash
# Aggiungi remote
git remote add origin git@github.com:tuo-username/nome-progetto.git

# Push
git branch -M main
git push -u origin main
```

### Caso Speciale: Progetto Grande

Se il progetto è molto grande (molti file):

```bash
# Verifica dimensione
du -sh .

# Verifica numero file
git ls-files | wc -l

# Se > 10,000 file, considera:
1. Migliorare .gitignore per escludere più file
2. Usare Git LFS per file grandi (>50MB)
3. Committare in gruppi invece di tutto insieme

# Commit per gruppi
git add src/
git commit -m "chore: add source files"

git add tests/
git commit -m "chore: add tests"

git add docs/
git commit -m "chore: add documentation"
```

---

## Scenario 3: Fork di Repository Esistente

Vuoi creare una copia di un progetto esistente per modificarlo.

### Passo 1: Fork su GitHub

1. Vai alla repository originale: `https://github.com/original-owner/project`
2. Click pulsante **"Fork"** in alto a destra
3. Scegli il tuo account come destinazione
4. Click **"Create fork"**

### Passo 2: Clone del Tuo Fork

```bash
# Clone del TUO fork (non l'originale!)
git clone git@github.com:tuo-username/project.git
cd project
```

### Passo 3: Aggiungi Upstream

```bash
# Aggiungi repository originale come upstream
git remote add upstream git@github.com:original-owner/project.git

# Verifica
git remote -v
# Output:
# origin    git@github.com:tuo-username/project.git (fetch)
# origin    git@github.com:tuo-username/project.git (push)
# upstream  git@github.com:original-owner/project.git (fetch)
# upstream  git@github.com:original-owner/project.git (push)
```

### Passo 4: Workflow con Fork

```bash
# Sincronizza con upstream regolarmente
git fetch upstream
git checkout main
git merge upstream/main
git push origin main

# Crea branch per feature
git checkout -b feature/mia-modifica

# Lavora e commit
git add .
git commit -m "feat: mia modifica"

# Push al TUO fork
git push origin feature/mia-modifica

# Apri PR su GitHub verso repository originale
```

---

## Scenario 4: Template Repository

Vuoi creare un progetto partendo da un template.

### Opzione A: GitHub Template

1. Vai a repository template: `https://github.com/owner/template-repo`
2. Click pulsante **"Use this template"** (verde)
3. Compila form:
   - Repository name: `mio-nuovo-progetto`
   - Description: `Progetto basato su template X`
   - Public/Private
4. Click **"Create repository from template"**
5. Clone:

```bash
git clone git@github.com:tuo-username/mio-nuovo-progetto.git
```

### Opzione B: Clone e Modifica Remote

```bash
# Clone template
git clone git@github.com:owner/template-repo.git mio-progetto
cd mio-progetto

# Rimuovi remote originale
git remote remove origin

# Crea nuova repository su GitHub

# Aggiungi nuovo remote
git remote add origin git@github.com:tuo-username/mio-progetto.git

# Push
git push -u origin main
```

---

## Setup Repository Completo

Una volta creata la repository, configura correttamente:

### 1. Branch Protection Rules (GitHub)

```
Settings > Branches > Add rule

Branch name pattern: main

☑ Require a pull request before merging
  ☑ Require approvals: 1
☑ Require status checks to pass before merging
☑ Require conversation resolution before merging
☑ Do not allow bypassing the above settings
```

### 2. Crea Branch Develop

```bash
# Crea e push branch develop
git checkout -b develop
git push -u origin develop

# Su GitHub, vai a Settings > Branches
# Imposta 'develop' come default branch (opzionale)
```

### 3. Setup GitHub Actions (CI/CD)

Crea `.github/workflows/ci.yml`:

```bash
mkdir -p .github/workflows
touch .github/workflows/ci.yml
```

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build
```

```bash
git add .github/
git commit -m "ci: setup GitHub Actions"
git push
```

### 4. Crea Labels (GitHub)

Settings > Labels > New label:

```
feature       - #0052CC - Nuove funzionalità
bug           - #D73A4A - Bug da correggere
documentation - #0075CA - Documentazione
enhancement   - #A2EEEF - Miglioramenti
urgent        - #E99695 - Richiede attenzione immediata
wontfix       - #FFFFFF - Non verrà implementato
```

### 5. Setup Issue Templates

Crea `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug Report
about: Segnala un bug
title: '[BUG] '
labels: bug
assignees: ''
---

## Descrizione Bug
Descrizione chiara del problema.

## Steps per Riprodurre
1. Vai a '...'
2. Click su '...'
3. Vedi errore

## Comportamento Atteso
Cosa dovrebbe succedere.

## Screenshot
Se applicabile, aggiungi screenshot.

## Environment
- OS: [es. macOS, Windows, Linux]
- Browser: [es. Chrome, Safari]
- Versione: [es. 1.0.0]
```

Crea `.github/ISSUE_TEMPLATE/feature_request.md`:

```markdown
---
name: Feature Request
about: Suggerisci nuova funzionalità
title: '[FEATURE] '
labels: feature
assignees: ''
---

## Descrizione Feature
Descrizione chiara della funzionalità richiesta.

## Problema da Risolvere
Quale problema risolve questa feature?

## Soluzione Proposta
Come vorresti che funzionasse?

## Alternative Considerate
Hai considerato altre soluzioni?
```

### 6. Setup Pull Request Template

Crea `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Descrizione
Descrizione breve delle modifiche.

## Tipo di Modifica
- [ ] Bug fix
- [ ] Nuova feature
- [ ] Breaking change
- [ ] Documentazione

## Testing
- [ ] Test unitari aggiunti/aggiornati
- [ ] Test manuali effettuati
- [ ] Build passa senza errori

## Checklist
- [ ] Codice segue style guide del progetto
- [ ] Self-review effettuato
- [ ] Commenti aggiunti dove necessario
- [ ] Documentazione aggiornata
- [ ] Nessun warning generato

## Screenshots (se applicabile)
Aggiungi screenshot per modifiche UI.

## Issue Collegate
Closes #123
```

### 7. Crea README Completo

```markdown
# Nome Progetto

[![CI](https://github.com/username/project/workflows/CI/badge.svg)](https://github.com/username/project/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Descrizione del progetto in 1-2 frasi.

## Features

- Feature 1
- Feature 2
- Feature 3

## Prerequisiti

- Node.js 20+
- npm 9+
- Database MySQL 8+

## Installazione

```bash
# Clone repository
git clone git@github.com:username/project.git
cd project

# Installa dipendenze
npm install

# Configura environment
cp .env.example .env
# Modifica .env con i tuoi valori

# Avvia database
docker-compose up -d mysql

# Run migrations
npm run migration:run

# Avvia applicazione
npm run dev
```

## Utilizzo

```bash
# Development
npm run dev

# Build
npm run build

# Test
npm run test

# Lint
npm run lint
```

## Struttura Progetto

```
project/
├── apps/
│   ├── backend/       # NestJS backend
│   └── frontend/      # React frontend
├── docs/              # Documentazione
├── .github/           # GitHub config
└── README.md
```

## Contribuire

Vedi [CONTRIBUTING.md](CONTRIBUTING.md) per linee guida.

## License

MIT - Vedi [LICENSE](LICENSE) file.

## Contatti

- Email: email@example.com
- GitHub: [@username](https://github.com/username)
```

### 8. Aggiungi LICENSE

```bash
# Crea LICENSE file (esempio MIT)
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 Tuo Nome

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

git add LICENSE
git commit -m "docs: add MIT license"
git push
```

---

## Best Practices Iniziali

### 1. .gitignore Completo da Subito

Non committare mai:

```bash
# Dependencies
node_modules/
vendor/

# Environment variables
.env
.env.local
.env.*.local

# Logs
*.log
logs/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build outputs
dist/
build/
*.tsbuildinfo

# Testing
coverage/

# Temporary
*.tmp
*.temp
```

### 2. Commit Iniziale Significativo

```bash
# ❌ MALE
git commit -m "first commit"

# ✅ BENE
git commit -m "chore: initial project setup

- Setup Node.js project structure
- Configure TypeScript and build tools
- Add linting and formatting
- Setup testing framework
- Add CI/CD pipeline"
```

### 3. README Fin dall'Inizio

Anche se minimo, crea README con:
- Nome progetto
- Breve descrizione
- Come installare
- Come eseguire
- License

### 4. Branch Strategy da Subito

```bash
# Crea develop dopo primo commit
git checkout -b develop
git push -u origin develop

# Workflow:
# main = production
# develop = development
# feature/* = nuove funzionalità
```

### 5. Semantic Versioning

```bash
# Tagga prime versioni
git tag -a v0.1.0 -m "Initial development version"
git push --tags

# Versioning:
# v0.x.x = development
# v1.0.0 = first stable release
# v1.1.0 = new features
# v1.1.1 = bug fixes
```

### 6. .env.example

```bash
# Non committare .env, ma crea .env.example
cat > .env.example << 'EOF'
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=user
DB_PASSWORD=password_here
DB_DATABASE=database_name

# JWT
JWT_SECRET=your-secret-here
JWT_EXPIRATION=7d

# Application
NODE_ENV=development
PORT=3000
EOF

git add .env.example
git commit -m "docs: add environment variables template"
```

### 7. CONTRIBUTING.md

```markdown
# Contributing to Project

## Development Setup

1. Fork repository
2. Clone your fork
3. Create feature branch
4. Make changes
5. Test thoroughly
6. Submit Pull Request

## Commit Guidelines

Use Conventional Commits:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code refactoring
- test: Tests
- chore: Maintenance

## Pull Request Process

1. Update README if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update documentation
5. Request review
```

---

## Comandi Rapidi

```bash
# NUOVO PROGETTO - Locale prima
mkdir mio-progetto && cd mio-progetto
git init
touch README.md .gitignore
git add .
git commit -m "chore: initial commit"
git remote add origin git@github.com:username/mio-progetto.git
git push -u origin main

# NUOVO PROGETTO - GitHub prima
git clone git@github.com:username/mio-progetto.git
cd mio-progetto
# ... lavora ...
git add .
git commit -m "feat: add feature"
git push

# PROGETTO ESISTENTE
cd progetto-esistente
git init
git add .
git commit -m "chore: initial commit"
git remote add origin git@github.com:username/progetto.git
git push -u origin main

# FORK
# (click Fork su GitHub)
git clone git@github.com:username/forked-project.git
cd forked-project
git remote add upstream git@github.com:original/project.git
```

---

## Troubleshooting

### Repository già esiste su GitHub

```bash
# Errore: repository already exists

# Soluzione 1: Usa nome diverso
git remote add origin git@github.com:username/altro-nome.git

# Soluzione 2: Elimina repository su GitHub e ricrea
```

### Push rejected

```bash
# Errore: ! [rejected] main -> main (fetch first)

# Soluzione: Pull prima
git pull origin main --rebase
git push origin main
```

### File troppo grande

```bash
# Errore: file exceeds GitHub's file size limit of 100 MB

# Soluzione 1: Rimuovi file
git rm --cached file-grande.zip
git commit --amend

# Soluzione 2: Usa Git LFS
git lfs install
git lfs track "*.zip"
git add .gitattributes
git commit -m "chore: add Git LFS"
```

---

## Resources

- [GitHub Guides](https://guides.github.com/)
- [Git Documentation](https://git-scm.com/doc)
- [Choose a License](https://choosealicense.com/)
- [.gitignore Templates](https://github.com/github/gitignore)

---

**Ultima modifica**: 2025-12-23
**Versione**: 1.0.0
