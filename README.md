<div align="center">

# ⚡ MatchForge

### AI-Powered Resume & Job Match Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen?logo=spring)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?logo=postgresql)](https://www.postgresql.org/)
[![Groq](https://img.shields.io/badge/Groq-Llama%203.3-orange)](https://console.groq.com/)
[![SendGrid](https://img.shields.io/badge/SendGrid-Email%20API-0696D7?logo=sendgrid)](https://sendgrid.com/)

> **Analyze your resume against any job description, get an AI-powered match score, discover missing skills, manually log job applications, and track every stage of your job hunt — all in one place.**

**🌐 Live Demo:** [https://match-forge-wsr2.vercel.app](https://match-forge-wsr2.vercel.app)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Using the App](#-using-the-app)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Resume Upload** | Upload PDF or DOCX — text extracted automatically |
| 📝 **Job Description Input** | Paste any job posting for instant AI analysis |
| 🤖 **AI Match Analysis** | Powered by Groq (Llama 3.3 / 3.1) with detailed scoring |
| 📋 **Application Form** | Manually log any job — company, role, status, notes & tags |
| 🗂️ **Application Tracker** | Track every application through its full lifecycle |
| 📊 **Dashboard** | Real stats: applications, avg score, interviews, offer trends |
| 💾 **Persistent Storage** | PostgreSQL — all user data saved across sessions |
| 🔐 **Authentication** | Email + password with JWT (cookie-based) |
| ✉️ **Email Notifications** | OTP verification & password reset via SendGrid API |
| 🌗 **Dark / Light Mode** | Fully themable via `next-themes` |
| 🧠 **AI Assistant** | Ask follow-up questions to improve your resume |

### 🤖 AI Analysis Returns

- ✅ Overall match score (0–100)
- ✅ Category scores — Skills, Experience, Keywords, Projects
- ✅ Matched skills & missing critical skills
- ✅ Actionable suggestions ranked as Critical / High / Recommended

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, next-themes, Recharts |
| **Backend** | Spring Boot 3.2, Spring Security, JWT, Hibernate |
| **AI / LLM** | Groq API — Llama 3.3-70B / Llama 3.1-8B |
| **Database** | PostgreSQL 14+ (local or cloud via Neon) |
| **Email Service** | SendGrid HTTP API (no SMTP restrictions) |
| **Build Tools** | Maven (backend), npm (frontend) |

---

## 📁 Project Structure

```
matchforge/
├── matchforge-frontend/          # Next.js 14 frontend
│   ├── app/                      # App Router pages
│   │   ├── dashboard/            # Stats & trend charts
│   │   ├── upload/               # Resume upload page
│   │   ├── job-description/      # Job posting input page
│   │   ├── match-results/        # Score & analysis results
│   │   ├── application-form/     # Manual job entry form
│   │   ├── application-tracker/  # Track all applications
│   │   ├── ai-assistant/         # AI follow-up chat
│   │   ├── login/ & register/    # Authentication
│   │   └── ...                   # Forgot password, reset, etc.
│   ├── components/               # Reusable UI components
│   ├── context/                  # AppContext (auth, analysis, apps)
│   ├── lib/                      # API client & utilities
│   └── public/                   # Static assets
│
└── matchforge-backend/           # Spring Boot backend
    ├── src/main/java/com/matchforge/
    │   ├── controllers/          # REST endpoints
    │   ├── services/             # Business logic (Groq, SendGrid, JWT)
    │   ├── models/               # JPA entities (User, Application, etc.)
    │   ├── repositories/         # Spring Data JPA
    │   ├── security/             # JWT filter, security config
    │   └── config/               # CORS, async, scheduling config
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+ and Maven
- **PostgreSQL** 14+ *(or use Neon for a free cloud DB)*
- **Groq API key** — free tier at [console.groq.com](https://console.groq.com)
- **SendGrid API key** — free tier at [sendgrid.com](https://sendgrid.com)

---

### 1. Clone the Repository

```bash
git clone https://github.com/ItachI008/Match_Forge.git
cd matchforge
```

---

### 2. Backend Setup (Spring Boot)

#### 2.1 — Create PostgreSQL Database

```sql
CREATE DATABASE matchforge;
CREATE USER matchforge_user WITH PASSWORD 'matchforge123';
GRANT ALL PRIVILEGES ON DATABASE matchforge TO matchforge_user;
```

#### 2.2 — Configure `application.properties`

Edit `matchforge-backend/src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/matchforge
spring.datasource.username=matchforge_user
spring.datasource.password=matchforge123
spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false

# JWT
jwt.secret=your_jwt_secret_key
jwt.expiration=604800000

# Groq API
groq.api.key=your_groq_api_key

# SendGrid
sendgrid.api.key=your_sendgrid_api_key
sendgrid.from.email=verified@yourdomain.com

# OTP expiry (5 minutes)
otp.expiry=300000

# Frontend URL
frontend.url=http://localhost:3000

# CORS
cors.allowed.origin=http://localhost:3000
```

> 💡 **No PostgreSQL locally?** You can use a free [Neon](https://neon.tech) cloud database — just replace the datasource URL.

#### 2.3 — Run the Backend

```bash
cd matchforge-backend

# macOS / Linux
./mvnw clean spring-boot:run

# Windows
mvnw.cmd clean spring-boot:run
```

Backend starts at **http://localhost:8080**

---

### 3. Frontend Setup (Next.js)

#### 3.1 — Install Dependencies

```bash
cd matchforge-frontend
npm install
```

#### 3.2 — Environment Variables

Create `.env.local` in `matchforge-frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

#### 3.3 — Run the Frontend

```bash
npm run dev
```

Open **http://localhost:3000**

---

## 📖 Using the App

### AI-Powered Flow

1. **Register or Login**
2. **Upload Resume** — PDF or DOCX
3. **Paste Job Description** → click "Analyze Match"
4. **View Match Results** — score, skill gaps, improvement suggestions
5. **Save to Tracker** — adds the result to your Application Tracker

### Manual Entry Flow

1. Navigate to **Application Form**
2. Fill in company, role, status, notes, and tags
3. Click **"Save Application"** — immediately visible in the tracker

### Track & Manage

- Open **Application Tracker** to see all applications in one view
- Update status as you progress through each stage
- Use **Search / Filter / Sort** to focus on what matters
- Check the **Dashboard** for stats, score trends, and pipeline overview
- Use the **AI Assistant** anytime for resume improvement tips

### Password Reset & OTP

OTP for registration and password reset are sent via **SendGrid HTTP API** — works reliably on all cloud hosts including Render (no SMTP port restrictions).

---

## 🌐 API Reference

All endpoints require `Authorization: Bearer <token>` header, issued automatically after login.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `POST` | `/api/auth/verify-otp` | Verify email OTP |
| `POST` | `/api/auth/forgot-password` | Send password reset email |
| `POST` | `/api/auth/reset-password` | Reset password with token |

### Applications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/applications` | Fetch all applications for logged-in user |
| `POST` | `/api/applications` | Create a new application |
| `GET` | `/api/applications/{id}` | Fetch a single application by ID |
| `PUT` | `/api/applications/{id}` | Update application fields |
| `DELETE` | `/api/applications/{id}` | Delete an application |

---

## 🐳 Deployment

### Backend — Render

#### 1. Package the application

```bash
cd matchforge-backend

# macOS / Linux
./mvnw clean package -DskipTests

# Windows
mvnw.cmd clean package -DskipTests
```

#### 2. Make `mvnw` executable (required for Render)

```bash
git update-index --chmod=+x mvnw
git add .
git commit -m "make mvnw executable"
git push origin main
```

#### 3. Create a Web Service on Render

- Go to [render.com](https://render.com) → **New → Web Service**
- Connect your GitHub repo
- Set **Build Command:** `./mvnw clean package -DskipTests`
- Set **Start Command:** `java -jar target/*.jar`

#### 4. Set Environment Variables on Render

| Key | Value |
|---|---|
| `DB_PASSWORD` | Your Neon DB password |
| `JWT_SECRET` | A long random secret string |
| `SENDGRID_API_KEY` | Your SendGrid API key |
| `GROQ_API` | Your Groq API key |
| `FRONTEND_URL` | Your deployed frontend URL |
| `CORS_ALLOWED_ORIGIN` | Your deployed frontend URL |

---

### Frontend — Vercel

1. Push the repo to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Set the root directory to `matchforge-frontend`
4. Add the environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-render-backend-url/api
```

**Live URL:** [https://match-forge-wsr2.vercel.app](https://match-forge-wsr2.vercel.app)

---

## 🔧 Troubleshooting

| Issue | Fix |
|---|---|
| `403 Forbidden` on API calls | Ensure JWT token is valid and not expired — try logging out and back in |
| Emails not delivered | Check SendGrid Activity Feed; verify sender email is verified in SendGrid dashboard |
| OTP / reset emails going to spam | Mark as "Not Spam" in Gmail; use a custom domain sender for production |
| `500` on forgot-password | Ensure `@Transactional` is on `storeToken()` in `PasswordResetService` |
| Applications not appearing in tracker | Confirm backend `/api/applications` is reachable and JWT hasn't expired |
| Groq model deprecated | Update model name in `GroqService.java` to latest from [Groq console](https://console.groq.com) |
| Port 8080 already in use | Kill the conflicting process or change `server.port` in `application.properties` |
| Render build fails | Ensure `mvnw` is executable — run `git update-index --chmod=+x mvnw` |
| Cold starts on Render | Expected on free tier — Render sleeps after 15 min of inactivity |

---

## 🧪 Testing

```bash
# Backend tests
cd matchforge-backend
./mvnw test           # macOS / Linux
mvnw.cmd test         # Windows

# Frontend tests
cd matchforge-frontend
npm run test
```

---

## 🔮 Roadmap

- [x] AI-powered resume & job description match analysis
- [x] Application Form — manual job entry with company, role, status, notes & tags
- [x] Application Tracker — unified view with status pipeline and filtering
- [x] OTP verification during signup via SendGrid
- [x] Password reset via email link
- [ ] Google OAuth one-click login
- [ ] Export tracker data as PDF / CSV
- [ ] Resume version history with improvement tracking
- [ ] Email notifications for interview reminders
- [ ] Admin dashboard for API usage & user activity monitoring
- [ ] Advanced resume parsing with NLP (Apache OpenNLP)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

```bash
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) — blazing fast LLM inference
- [SendGrid](https://sendgrid.com) — reliable email delivery via HTTP API
- [Next.js](https://nextjs.org) & [Tailwind CSS](https://tailwindcss.com)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [PostgreSQL](https://www.postgresql.org) & [Neon](https://neon.tech)

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ to help job seekers land their dream roles faster.

**[Live Demo](https://match-forge-wsr2.vercel.app)** · **[Report a Bug](https://github.com/ItachI008/Match_Forge/issues)** · **[Request a Feature](https://github.com/ItachI008/Match_Forge/issues)**

</div>