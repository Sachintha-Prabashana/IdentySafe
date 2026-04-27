<p align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Asgardeo-OAuth2-FF7300?style=for-the-badge&logo=wso2&logoColor=white" alt="Asgardeo"/>
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
</p>

<h1 align="center">🛡️ IdentySafe</h1>

<p align="center">
  <strong>A secure, full-stack digital document vault for storing, managing, and safely sharing sensitive files.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-license">License</a>
</p>

---

## 📖 Overview

**IdentySafe** is a production-ready, enterprise-grade document management platform that allows users to securely upload, store, and organize sensitive documents in a personal vault. Built as a monorepo with a decoupled frontend and backend, it leverages **Asgardeo (WSO2)** for enterprise-grade OAuth2/OpenID Connect authentication and **Cloudinary** for secure, scalable cloud storage.

Users can generate **temporary, revokable share links** to grant controlled public access to specific documents — without exposing their entire vault or requiring recipients to create an account.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **OAuth2 Authentication** | Enterprise-grade login via Asgardeo (WSO2) with OpenID Connect |
| 📤 **Secure Upload** | Upload any file type (PDF, images, docs) with automatic Cloudinary storage |
| 🗂️ **Document Vault** | Personal, per-user encrypted vault with file metadata and previews |
| 🔗 **Controlled Sharing** | Generate unique, time-limited (7-day) shareable links for any document |
| 🚫 **Revokable Access** | Instantly revoke any shared link to cut off public access |
| 👁️ **Public Viewer** | Recipients can view/download shared files without logging in |
| ⏰ **Auto-Expiry** | Shared links automatically expire and are cleaned up on access |
| 📱 **Responsive UI** | Premium, modern dashboard that works on desktop and mobile |
| 🐳 **Fully Dockerized** | One-command deployment with Docker Compose |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          CLIENT BROWSER                                 │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                    React 19 + TypeScript                          │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │  │
│  │  │  Login   │  │  Vault Page  │  │ Shared Links │  │  Public   │ │  │
│  │  │  Page    │  │  (Upload/    │  │   Dashboard  │  │  Viewer   │ │  │
│  │  │         │  │   View/Del)  │  │  (Revoke)    │  │  Page     │ │  │
│  │  └────┬─────┘  └──────┬───────┘  └──────┬───────┘  └─────┬─────┘ │  │
│  │       │               │                 │                │       │  │
│  │  ┌────▼───────────────▼─────────────────▼────────────────▼─────┐ │  │
│  │  │              Axios HTTP Client + Token Interceptor          │ │  │
│  │  └────────────────────────────┬───────────────────────────────┘ │  │
│  └───────────────────────────────┼──────────────────────────────────┘  │
└──────────────────────────────────┼──────────────────────────────────────┘
                                   │ REST API (JSON)
                                   │ Bearer Token (JWT)
┌──────────────────────────────────┼──────────────────────────────────────┐
│                     SPRING BOOT 3 BACKEND                              │
│  ┌───────────────────────────────▼──────────────────────────────────┐  │
│  │                     Security Filter Chain                        │  │
│  │              OAuth2 Resource Server (JWT Validation)              │  │
│  │         ┌──────────────────────────────────────────┐             │  │
│  │         │  Public: /api/public/**, /api/docs/pub/** │             │  │
│  │         │  Protected: Everything else               │             │  │
│  │         └──────────────────────────────────────────┘             │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    REST Controller Layer                          │  │
│  │  ┌─────────────────────────────────────────────────────────────┐ │  │
│  │  │                  DocumentController                         │ │  │
│  │  │  GET    /api/documents          → List user's documents     │ │  │
│  │  │  POST   /api/documents/upload   → Upload a new file        │ │  │
│  │  │  DELETE /api/documents/{id}     → Delete a document        │ │  │
│  │  │  POST   /api/documents/{id}/share → Generate share link    │ │  │
│  │  │  GET    /api/documents/shared   → List shared documents    │ │  │
│  │  │  DELETE /api/documents/{id}/share → Revoke share link      │ │  │
│  │  │  GET    /api/documents/public/share/{token} → Public view  │ │  │
│  │  └─────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     Service Layer                                │  │
│  │  DocumentServiceImpl → Business logic, token generation,        │  │
│  │                        Cloudinary upload, expiry management     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     Data Layer (JPA + MySQL)                     │  │
│  │  DocumentRepository → Spring Data JPA queries                   │  │
│  │  Document Entity    → id, fileName, fileType, fileUrl,          │  │
│  │                       ownerEmail, uploadedAt, shareToken,       │  │
│  │                       expiryDate                                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────┬───────────────────────────────┬────────────────────┘
                     │                               │
          ┌──────────▼──────────┐          ┌─────────▼─────────┐
          │    MySQL 8.0        │          │    Cloudinary      │
          │  (Document metadata)│          │  (File storage)    │
          │  Docker Volume      │          │  Cloud CDN         │
          └─────────────────────┘          └───────────────────┘

          ┌─────────────────────────────────────────────────────┐
          │               Asgardeo (WSO2)                       │
          │  Identity Provider — OAuth2 / OpenID Connect        │
          │  JWT Issuer & JWKS endpoint                         │
          └─────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User → Login Page → Asgardeo OAuth2 → Redirect with Auth Code
     → Exchange for Access Token (JWT) → Stored in localStorage
     → Every API call → Axios Interceptor attaches Bearer Token
     → Backend validates JWT via Asgardeo JWKS endpoint
     → Extracts user email from JWT claims → Scopes data per user
```

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Java 17** | Core language |
| **Spring Boot 3.3.4** | Application framework |
| **Spring Security** | OAuth2 Resource Server with JWT validation |
| **Spring Data JPA** | ORM & database access |
| **MySQL 8.0** | Relational database |
| **Cloudinary SDK** | Cloud file storage & CDN delivery |
| **ModelMapper** | DTO ↔ Entity mapping |
| **Lombok** | Boilerplate reduction |
| **Maven** | Build & dependency management |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **TypeScript 6** | Type-safe JavaScript |
| **Vite 8** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **React Router 7** | Client-side routing |
| **TanStack React Query 5** | Server state management & caching |
| **Axios** | HTTP client with interceptors |
| **Asgardeo Auth React SDK** | OAuth2/OIDC integration |
| **Lucide React** | Modern icon library |
| **React Hook Form + Zod** | Form handling & validation |
| **React Hot Toast** | Toast notifications |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Production frontend server (SPA routing) |
| **Asgardeo (WSO2)** | Identity Provider (OAuth2 / OIDC) |

---

## 📁 Project Structure

```
IdentySafe/
├── 📄 docker-compose.yml            # Multi-container orchestration
├── 📄 .env                          # Environment variables (not committed)
├── 📄 .gitignore                    # Git ignore rules
│
├── 🔧 backend/                      # Spring Boot 3 API Server
│   ├── Dockerfile                   # Multi-stage build (Maven → JRE)
│   ├── pom.xml                      # Maven dependencies
│   └── src/main/
│       ├── java/lk/ijse/backend/
│       │   ├── BackendApplication.java
│       │   ├── config/
│       │   │   ├── AppConfig.java           # ModelMapper bean
│       │   │   ├── CloudinaryConfig.java    # Cloudinary SDK setup
│       │   │   └── SecurityConfig.java      # OAuth2 + CORS + JWT decoder
│       │   ├── controller/
│       │   │   └── DocumentController.java  # REST endpoints
│       │   ├── dto/
│       │   │   └── DocumentDTO.java         # Data transfer object
│       │   ├── entity/
│       │   │   └── Document.java            # JPA entity
│       │   ├── repo/
│       │   │   └── DocumentRepository.java  # Spring Data JPA repository
│       │   └── service/
│       │       ├── DocumentService.java     # Service interface
│       │       └── impl/
│       │           └── DocumentServiceImpl.java  # Business logic
│       └── resources/
│           └── application.yml              # Spring configuration
│
└── 🎨 frontend/                     # React + TypeScript SPA
    ├── Dockerfile                   # Multi-stage build (Node → Nginx)
    ├── package.json                 # NPM dependencies
    ├── vite.config.ts               # Vite configuration
    ├── index.html                   # Entry HTML
    └── src/
        ├── main.tsx                 # App bootstrap (Auth + Query providers)
        ├── App.tsx                  # Root component + interceptor setup
        ├── index.css                # Global styles
        ├── components/
        │   ├── DashboardLayout.tsx   # Sidebar + Header layout shell
        │   ├── DocumentTable.tsx     # File listing with actions
        │   ├── FileViewerModal.tsx   # Document preview/download modal
        │   ├── Header.tsx            # Top navigation bar
        │   ├── ShareModal.tsx        # Share link generation modal
        │   ├── Sidebar.tsx           # Navigation sidebar
        │   └── UploadModal.tsx       # File upload with drag & drop
        ├── hooks/
        │   └── useDocuments.ts       # React Query hooks for CRUD
        ├── pages/
        │   ├── LoginPage.tsx         # OAuth2 login screen
        │   ├── VaultPage.tsx         # Main document vault
        │   ├── SharedLinksPage.tsx    # Shared links management
        │   ├── SettingsPage.tsx       # User settings
        │   └── PublicViewPage.tsx     # Public shared document viewer
        ├── routes/
        │   └── index.tsx             # Route definitions + auth guard
        ├── service/
        │   ├── api.ts                # Axios instance + interceptors
        │   └── documentService.ts    # API call functions
        ├── types/
        │   └── document.ts           # TypeScript interfaces
        └── utils/                    # Utility functions
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| **Docker** & **Docker Compose** | Latest |
| **Java** (for local backend dev) | 17+ |
| **Node.js** (for local frontend dev) | 20+ |
| **Maven** (or use included wrapper) | 3.9+ |
| **Asgardeo Account** | [Sign up free](https://asgardeo.io/) |
| **Cloudinary Account** | [Sign up free](https://cloudinary.com/) |

---

### Option 1: 🐳 Docker Compose (Recommended)

The fastest way to get the entire stack running.

**1. Clone the repository**

```bash
git clone https://github.com/Sachintha-Prabashana/IdentySafe.git
cd IdentySafe
```

**2. Create the `.env` file**

```bash
# Database configuration
DB_PASSWORD=your_mysql_root_password
DB_NAME=identysafe_db

# Cloudinary configuration
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# URLs
API_URL=http://localhost:8080/api
```

**3. Start all services**

```bash
docker-compose up --build
```

**4. Access the application**

| Service | URL |
|---|---|
| 🎨 **Frontend** | [http://localhost:3000](http://localhost:3000) |
| 🔧 **Backend API** | [http://localhost:8080/api](http://localhost:8080/api) |
| 🗄️ **MySQL** | `localhost:3307` |

---

### Option 2: 💻 Local Development

#### Backend

```bash
cd backend

# Using Maven Wrapper (no Maven install required)
./mvnw spring-boot:run
```

> The backend starts on port `8080`. Make sure MySQL is running locally on port `3306` with the database `identysafe_db`.

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server with HMR
npm run dev
```

> The frontend starts on port `5173` (Vite dev server). For production builds, it serves via Nginx on port `3000` (Docker).

---

### Asgardeo Setup

To configure authentication, you need to set up an application in the **Asgardeo Console**:

1. Go to [Asgardeo Console](https://console.asgardeo.io/) and create an organization
2. Register a **Single Page Application (SPA)**
3. Configure the following:

   | Setting | Value |
   |---|---|
   | **Authorized Redirect URL** | `http://localhost:3000` |
   | **Allowed Origins** | `http://localhost:3000` |
   | **Scopes** | `openid`, `profile`, `email` |

4. Copy the **Client ID** and update:
   - `frontend/src/main.tsx` → `clientID`
   - `backend/.../SecurityConfig.java` → `clientId`

5. Update the **Base URL** and **Issuer URI** with your organization's tenant:
   - `frontend/src/main.tsx` → `baseUrl`
   - `backend/src/main/resources/application.yml` → `issuer-uri`, `jwk-set-uri`

---

## 📡 API Reference

### 🔒 Protected Endpoints (Require Bearer Token)

#### Get All Documents
```http
GET /api/documents
Authorization: Bearer <access_token>
```
**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "fileName": "passport.pdf",
    "fileType": "application/pdf",
    "fileUrl": "https://res.cloudinary.com/...",
    "ownerEmail": "user@example.com",
    "uploadedAt": "2026-04-27T12:00:00",
    "shareToken": null,
    "expiryDate": null
  }
]
```

#### Upload Document
```http
POST /api/documents/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: <binary>
```
**Response:** `201 Created`

#### Delete Document
```http
DELETE /api/documents/{id}
Authorization: Bearer <access_token>
```
**Response:** `204 No Content`

#### Generate Share Link
```http
POST /api/documents/{id}/share
Authorization: Bearer <access_token>
```
**Response:** `200 OK` — Returns document with `shareToken` and `expiryDate` (7 days)

#### Get Shared Documents
```http
GET /api/documents/shared
Authorization: Bearer <access_token>
```
**Response:** `200 OK` — List of documents with active share tokens

#### Revoke Share Link
```http
DELETE /api/documents/{id}/share
Authorization: Bearer <access_token>
```
**Response:** `204 No Content`

### 🌐 Public Endpoints (No Auth Required)

#### View Shared Document
```http
GET /api/documents/public/share/{token}
```
**Response:** `200 OK` — Returns document metadata if token is valid and not expired

---

## 🐳 Docker Architecture

```
docker-compose.yml
├── identysafe-db        → MySQL 8.0 (port 3307:3306)
│   └── Volume: mysql_data (persistent)
├── identysafe-backend   → Spring Boot JAR (port 8080:8080)
│   └── Depends on: db (healthcheck)
└── identysafe-frontend  → Nginx + React build (port 3000:80)
    └── Depends on: backend
```

### Build Strategy

| Service | Build | Base Image | Output |
|---|---|---|---|
| **Backend** | Multi-stage | `maven:3.9.6-eclipse-temurin-17` → `eclipse-temurin:17-jre-jammy` | Optimized JRE container |
| **Frontend** | Multi-stage | `node:20-alpine` → `nginx:stable-alpine` | Static files served via Nginx |

---

## 🔒 Security

- **Authentication:** OAuth2 / OpenID Connect via Asgardeo (WSO2)
- **Token Type:** JWT (`at+jwt`) validated against Asgardeo JWKS endpoint
- **Authorization:** Per-user data isolation — users can only access their own documents
- **CORS:** Configured to allow only the frontend origin
- **Public Endpoints:** Explicitly whitelisted (`/api/public/**`, `/api/documents/public/**`)
- **Share Tokens:** UUID v4, time-limited (7-day expiry), individually revokable
- **Auto-Cleanup:** Expired tokens are nullified on access attempt

> ⚠️ **Important:** Never commit your `.env` file or `application.yml` with real credentials. Use environment variables for all sensitive configuration.

---

## 🗺️ Roadmap

- [ ] Multi-folder organization within vault
- [ ] File encryption at rest (AES-256)
- [ ] Two-factor authentication (TOTP)
- [ ] Custom expiry duration for share links
- [ ] Audit log for document access history
- [ ] Batch upload & ZIP download
- [ ] Role-based access control (RBAC)
- [ ] Email notifications on document sharing

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Sachintha-Prabashana">Sachintha Prabashana</a>
</p>
