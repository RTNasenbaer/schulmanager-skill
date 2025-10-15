# 🎙️ Schulmanager Alexa Skill

Alexa Skill für die Schulmanager-Integration. Ermöglicht es Nutzern, ihren Stundenplan und Vertretungsplan per Sprache abzufragen.

## 🛠️ Technologie-Stack

- **Runtime**: Node.js 18+ (AWS Lambda)
- **Framework**: Alexa Skills Kit SDK v2
- **Sprache**: TypeScript
- **HTTP Client**: Axios
- **Testing**: Jest
- **Deployment**: AWS Lambda via ASK CLI

## 📋 Voraussetzungen

- Node.js >= 18.0.0
- Yarn >= 1.22.0
- AWS Account
- Amazon Developer Account
- ASK CLI installiert (`npm install -g ask-cli`)

## 🚀 Installation

```bash
# Dependencies installieren
yarn install

# Environment-Datei erstellen
cp .env.example .env

# .env-Datei konfigurieren
```

## 🎯 Skill-Funktionen

### Intents

- **TodayScheduleIntent**: "Welche Stunden habe ich heute?"
- **TomorrowScheduleIntent**: "Welche Stunden habe ich morgen?"
- **SubstitutionsIntent**: "Welche Stunden fallen heute aus?"
- **NextLessonIntent**: "Was habe ich als nächstes?"
- **HelpIntent**: Hilfe anfordern
- **CancelStopIntent**: Skill beenden

### Beispiel-Dialoge

```
User:  "Alexa, öffne Schulmanager"
Alexa: "Willkommen beim Schulmanager. Was möchtest du wissen?"

User:  "Was habe ich heute?"
Alexa: "Du hast heute 6 Stunden. Um 8 Uhr Mathematik bei Herr Schmidt..."

User:  "Gibt es Vertretungen?"
Alexa: "Ja, Sport in der vierten Stunde fällt aus."
```

## 🔧 Development

```bash
# TypeScript kompilieren
yarn build

# Skill deployen
yarn deploy

# Tests ausführen
yarn test
```

## 📝 Skill-Konfiguration

### skill.json

Die Skill-Manifest-Datei konfiguriert:
- Skill-Name und Beschreibung
- Invocation Name ("Schulmanager")
- Endpoints (Lambda ARN)
- Permissions
- Publishing-Informationen

### Interaction Model (de-DE.json)

Definiert:
- Intents und Sample Utterances
- Slots (falls benötigt)
- Dialog-Management

## 🚀 Deployment

### 1. ASK CLI konfigurieren

```bash
ask configure
```

### 2. Skill erstellen

```bash
ask deploy
```

### 3. Lambda-Function aktualisieren

Die Lambda-Function wird automatisch erstellt und deployed.

## 🧪 Testing

### Lokal testen (mit ask-sdk-local-debug)

```bash
yarn test
```

### Im Alexa Developer Console testen

1. Gehe zu [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Öffne deinen Skill
3. Klicke auf "Test"
4. Aktiviere Testing
5. Spreche mit dem Skill im Simulator

## 📚 Projekt-Struktur

```
alexa-skill/
├── lambda/                    # Lambda Function Code
│   ├── handlers/              # Intent Handlers
│   ├── services/              # Services (API Client)
│   ├── utils/                 # Utilities
│   └── index.ts               # Entry Point
├── skill-package/             # Skill Configuration
│   ├── interactionModels/
│   │   └── custom/
│   │       └── de-DE.json     # German Language Model
│   └── skill.json             # Skill Manifest
└── package.json
```

## 🔐 Umgebungsvariablen

```env
BACKEND_API_URL=https://your-backend-api.com/api
API_KEY=your-api-key
```

## 📄 Lizenz

MIT

## 👨‍💻 Entwickler

Finn Martin
