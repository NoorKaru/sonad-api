# SONAPI 🇪🇪 - An API for the Estonian language

* [Overview](#overview)
* [Installation and requirements](#installation-and-requirements)
* [Hexagonal architecture](#hexagonal-architecture)
* [Folder structure](#folder-structure)

## Overview

I am a software developer based in Tallinn, Estonia. While learning the Estonian language I figured there is no publicly available API for the language dictionary. The Estonian Language Institute provides a language portal called [Sonaveeb](https://sonaveeb.ee/) but no way to programmatically access the dictionary content.

[SONAPI](https://www.sonapi.ee/) is an API built on top of the [EKI LEX](https://ekilex.ee/) dictionary and my side project to get a deeper understanding of NodeJS, Typescript, and architectural concepts. This project is a demonstration of [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/) (also called Ports & Adapters).

Live example: [https://api.sonapi.ee/v2/tubli](https://api.sonapi.ee/v2/tubli)

## Installation and requirements

### Docker

```
git clone https://github.com/BenediktGeiger/sonad-api.git
cd sonad-api
cp .env.docker .env
docker-compose up --build
```

| URL                                                               | Information                                             |
|-------------------------------------------------------------------|---------------------------------------------------------|
| [http://localhost:8083/v2/{word}](http://localhost:8083/v2/tubli) | API Endpoint                                            |
| [http://localhost:9090/](http://localhost:9090/)                  | Prometheus instance to collect NodeJS and API metrics.  |
| [http://localhost:3000/](http://localhost:3000/)                  | Grafana Dashboard                                       |

### Local NodeJS environment

```
git clone https://github.com/BenediktGeiger/sonad-api.git
cd sonad-api
cp .env.local .env
npm install
npm run dev
```

| URL                                                               | Information  |
|-------------------------------------------------------------------|--------------|
| [http://localhost:8083/v2/{word}](http://localhost:8083/v2/tubli) | API Endpoint |

## Hexagonal architecture

The core idea: **dependencies always point inward**. The application core defines
interfaces (ports) for everything it needs. The outside world implements them (adapters).
Nothing in the core knows about Express, Redis, Ekilex, or any other infrastructure detail.

```
                    ┌──────────────────────────────────┐
                    │        PRIMARY ADAPTERS          │
                    │    (they drive the application)  │
                    │                                  │
                    │   REST Controller                │
                    │   CLI                            │
                    └─────────────────┬────────────────┘
                                      │ drives
              ┌───────────────────────▼──────────────────────────┐
              │                APPLICATION CORE                   │
              │                                                   │
              │   ┌───────────────────────────────────────────┐   │
              │   │                 PORTS                     │   │
              │   │   (interfaces defined by the core)        │   │
              │   │                                           │   │
              │   │   ExternalDictionaryV2Port                │   │
              │   │   DictionaryCachePort                     │   │
              │   │   LoggerPort                              │   │
              │   │   TranslatorPort                         │   │
              │   │   AsciiPort                              │   │
              │   └───────────────────────────────────────────┘   │
              │                                                   │
              │   ┌───────────────────────────────────────────┐   │
              │   │           SERVICES & QUERIES              │   │
              │   │                                           │   │
              │   │   DictionaryV2Service                     │   │
              │   │   TranslatorService                       │   │
              │   │   GetDictionaryEntryQueryHandler          │   │
              │   └───────────────────────────────────────────┘   │
              └───────────────────────┬──────────────────────────┘
                                      │ implemented by
                    ┌─────────────────▼────────────────┐
                    │       SECONDARY ADAPTERS         │
                    │  (driven by the application)     │
                    │                                  │
                    │   Ekilex Adapter                 │
                    │   Redis Cache Adapter            │
                    │   Winston Logger Adapter         │
                    │   Postgres Translator Adapter    │
                    │   Ascii Service Adapter          │
                    └──────────────────────────────────┘
```

The composition root (`config/service-locator.ts`) is the only place that knows about
both sides — it wires ports to adapters at startup and owns all assembly knowledge.

## Folder structure

The folder structure mirrors the architecture directly:

```
lib/
│
├── config/
│   └── service-locator.ts        ← Composition root. Wires ports to adapters.
│                                   The only file that imports from both
│                                   application/ and infrastructure/.
│
├── primary-adapters/             ← PRIMARY ADAPTERS (left side of the hexagon)
│   ├── http/
│   │   ├── controllers/          ← Drives the app via HTTP
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── ports/                ← HTTP-specific port (rate limiter)
│   │   └── infrastructure/
│   │       └── rate-limiter/     ← Redis / in-memory rate limiter adapters
│   └── cli/                      ← Drives the app via CLI
│
├── dictionary/                   ← BOUNDED CONTEXT: Dictionary
│   │
│   ├── application/              ← APPLICATION CORE (centre of the hexagon)
│   │   ├── ports/                ← Port interfaces (the boundary)
│   │   │   ├── external-dictionary-v2.interface.ts
│   │   │   ├── dictionary-cache.interface.ts
│   │   │   ├── logger.interface.ts
│   │   │   ├── translator.interface.ts
│   │   │   ├── request-logger.interface.ts
│   │   │   └── ascii.port.ts
│   │   ├── queries/              ← CQRS query handlers
│   │   ├── dictionary-v2-service.ts
│   │   └── translator-service.ts
│   │
│   └── infrastructure/           ← SECONDARY ADAPTERS (right side of the hexagon)
│       ├── ekilex/               ← Implements ExternalDictionaryV2Port
│       │   ├── dictonary-ekilex.ts
│       │   └── inMemory/         ← In-memory stub for local dev
│       ├── cache/                ← Implements DictionaryCachePort
│       │   ├── redis-cache/
│       │   └── no-cache/
│       ├── logger/               ← Implements LoggerPort
│       │   ├── winstonLogger/
│       │   ├── winstonAxiomLogger/
│       │   └── consoleLogger/
│       ├── translator/           ← Implements TranslatorPort
│       │   ├── postgres/
│       │   ├── sqlite/
│       │   └── inMemory/
│       ├── request-logger/       ← Implements RequestLoggerPort
│       │   ├── postgres/
│       │   └── console/
│       ├── ascii/                ← Implements AsciiPort
│       └── bus/                  ← RoutingBus / LoggerBus / RetryBus
│
└── shared/                       ← Truly shared, no infrastructure dependencies
    ├── bus/                      ← Bus interfaces (Command, Query, Handler)
    ├── common/                   ← Utilities (Either, Result, StopWatch)
    └── domain/                   ← Base domain classes (Entity, ValueObject)
```

Each port in `application/ports/` has one or more adapters in `infrastructure/`.
Swapping an adapter (e.g. Redis → in-memory cache) requires zero changes to the core.
