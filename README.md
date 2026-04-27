<div align="center">

# ⚡ MatchForge AI

### AI-Powered Resume & Job Match Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen?logo=spring)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?logo=postgresql)](https://www.postgresql.org/)
[![Groq](https://img.shields.io/badge/Groq-Llama%203.3-orange)](https://console.groq.com/)

> **Analyze your resume against any job description, get an AI-powered match score, discover missing skills, manually log job applications, and track every stage of your job hunt — all in one place.**

</div>

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
| 🌗 **Dark / Light Mode** | Fully themable via `next-themes` |
| 🧠 **AI Assistant** | Ask follow-up questions to improve your resume |

### 🤖 AI Analysis Returns

- ✅ Overall match score (0–100)
- ✅ Category scores — Skills, Experience, Keywords, Projects
- ✅ Matched skills & missing critical skills
- ✅ Actionable suggestions ranked as Critical / High / Recommended

---

## 📋 Application Form — Manual Job Entry

No job description to analyze? No problem. The **Application Form** lets you log any job opportunity manually so nothing falls through the cracks.

**Fields supported:**

| Field | Description |
|---|---|
| 🏢 Company Name | The company you applied to |
| 💼 Job Title / Role | Position you're targeting |
| 🔗 Job URL | Link to the original posting *(optional)* |
| 📅 Applied Date | When you submitted the application |
| 📌 Status | Current stage — `Saved`, `Applied`, `Interview`, `Offer`, `Rejected` |
| 📝 Notes | Personal notes, recruiter details, interview prep |
| 🏷️ Tags | Custom labels — e.g. `remote`, `startup`, `high-priority` |

> Applications added via the form are stored in the same PostgreSQL database and appear alongside AI-analyzed applications in the tracker and dashboard stats.

---

## 🗂️ Application Tracker

The **Application Tracker** gives you a unified view of your entire job hunt — whether an application was created from an AI match analysis or entered manually via the form.

**Tracker capabilities:**

- **Kanban-style status pipeline** — `Saved → Applied → Interview → Offer / Rejected`
- **Inline status updates** — move an application to the next stage with a single click
- **Search & filter** — filter by company, role, status, or custom tags
- **Sort options** — by date applied, match score, or company name
- **Quick actions** — edit notes, update tags, or delete an entry directly from the list
- **Match score badge** — AI-analyzed applications display their score alongside manual entries
- **Dashboard sync** — all tracker data feeds the stats and trend chart on the dashboard in real time

**Application status flow:**

```
Saved ──► Applied ──► Interview ──► Offer
                  └──────────────► Rejected
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, next-themes, Recharts |
| **Backend** | Spring Boot 3.2, Spring Security, JWT, Hibernate |
| **AI / LLM** | Groq API — Llama 3.3-70B / Llama 3.1-8B |
| **Database** | PostgreSQL 14+ (local or cloud) |
| **Build Tools** | Maven (backend), npm (frontend) |

---

## 📁 Project Structure

```
matchforge/
├── matchforge-frontend/                  # Next.js 14 frontend
│   ├── app/                              # App Router pages
│   │   ├── dashboard/                    # Stats & trend charts
│   │   ├── upload/                       # Resume upload page
│   │   ├── job-description/              # Job posting input page
│   │   ├── match-results/                # Score & analysis results
│   │   ├── application-form/             # ★ NEW — Manual job entry form
│   │   ├── application-tracker/          # ★ NEW — Track all applications
│   │   ├── ai-assistant/                 # AI follow-up chat
│   │   ├── login/                        # Authentication
│   │   └── register/                     # New user registration
│   ├── components/
│   │   ├── ApplicationForm/              # ★ NEW — Form component & validation
│   │   ├── ApplicationTracker/           # ★ NEW — Tracker table, filters, kanban
│   │   └── ...                           # Other reusable UI components
│   ├── context/                          # AppContext (auth, analysis, applications)
│   ├── lib/                              # Mock data (fallback / dev mode)
│   └── public/                           # Static assets
│
└── matchforge-backend/                   # Spring Boot backend
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/matchforge/
    │       │       ├── controllers/
    │       │       │   ├── ApplicationController.java   # ★ NEW — CRUD for applications
    │       │       │   └── ...
    │       │       ├── services/
    │       │       │   ├── ApplicationService.java      # ★ NEW — Business logic
    │       │       │   ├── GroqService.java
    │       │       │   └── ...
    │       │       ├── models/
    │       │       │   ├── Application.java             # ★ NEW — JPA entity (+ tags, notes)
    │       │       │   └── ...
    │       │       ├── repositories/
    │       │       │   ├── ApplicationRepository.java   # ★ NEW — Spring Data repo
    │       │       │   └── ...
    │       │       └── security/
    │       └── resources/
    │           └── application.properties
    └── pom.xml
```

> ★ marks files and folders added for the Application Form & Tracker features.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+ and Maven
- **PostgreSQL** 14+ *(or H2 for quick testing)*
- **Groq API key** — free tier at [console.groq.com](https://console.groq.com)

---

### 1. Clone the Repository

```bash
git clone https://github.com/ItachI008/Match_Forge.git
cd matchforge-ai
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
# PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/matchforge
spring.datasource.username=matchforge_user
spring.datasource.password=matchforge123
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000

# Groq API
groq.api.key=your_groq_api_key
```

> 💡 **No PostgreSQL?** Comment out the PostgreSQL block and uncomment the H2 block in `application.properties` for quick local testing.

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

### 4. Using the App

**AI-Powered Flow**
1. **Register** or **Login**
2. **Upload Resume** — PDF or DOCX
3. **Paste Job Description** → click **"Analyze Match"**
4. **View Match Results** — score, skill gaps, improvement suggestions
5. **Save to Tracker** — adds the result to your Application Tracker

**Manual Entry Flow**
1. Navigate to **Application Form**
2. Fill in company, role, status, notes, and tags
3. Click **"Save Application"** — immediately visible in the tracker

**Track & Manage**
1. Open **Application Tracker** to see all applications in one view
2. Update status as you progress through each stage
3. Use **Search / Filter / Sort** to focus on what matters
4. Check the **Dashboard** for stats, score trends, and pipeline overview
5. Use the **AI Assistant** anytime for resume improvement tips

---

## 🌐 API Reference — Application Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/applications` | Fetch all applications for the logged-in user |
| `POST` | `/api/applications` | Create a new application (manual or from AI result) |
| `PUT` | `/api/applications/{id}` | Update application fields (status, notes, tags, etc.) |
| `DELETE` | `/api/applications/{id}` | Delete an application |
| `GET` | `/api/applications/{id}` | Fetch a single application by ID |

> All endpoints require `Authorization: Bearer <token>` header, issued automatically after login.

---

## 🧪 Testing

```bash
# Backend unit tests
cd matchforge-backend
./mvnw test                  # macOS / Linux
mvnw.cmd test                # Windows

# Frontend tests
cd matchforge-frontend
npm run test
```

---

## 🗄️ Database Management

| Tool | Access |
|---|---|
| H2 Console *(if enabled)* | http://localhost:8080/h2-console |
| PostgreSQL CLI | `psql -U matchforge_user -d matchforge` |
| pgAdmin | Connect to `localhost:5432` |

---

## 🐳 Deployment

### Backend — Render / Railway

```bash
cd matchforge-backend

# macOS / Linux
./mvnw clean package

# Windows
mvnw.cmd clean package

# JAR output: target/matchforge-backend-*.jar
```

Set these environment variables on your hosting platform:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:<port>/<db>
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400000
GROQ_API_KEY=your_groq_api_key
```

### Frontend — Vercel

1. Push the repo to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Set the environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-deployed-backend-url/api
```

---

## 📌 Troubleshooting

| Issue | Fix |
|---|---|
| **403 Forbidden on match analysis or application save** | Ensure `Authorization: Bearer <token>` is sent — handled automatically after login. |
| **Applications not appearing in tracker** | Check that the backend `/api/applications` endpoint is reachable and the JWT token hasn't expired. |
| **Tags not saving** | Confirm the `Application` entity has the `tags` field mapped; run `spring.jpa.hibernate.ddl-auto=update` to auto-migrate. |
| **Groq model deprecated** | Update the model name in `GroqService.java` to the latest from [Groq's console](https://console.groq.com). |
| **Port 8080 already in use** | Kill the conflicting process or change `server.port` in `application.properties`. |

---

## 🔮 Roadmap

- [x] Application Form — manual job entry with company, role, status, notes & tags
- [x] Application Tracker — unified view with status pipeline and filtering
- [ ] OTP verification during signup (email confirmation)
- [ ] Google OAuth one-click login
- [ ] Export tracker data as PDF / CSV
- [ ] Resume version history with improvement tracking
- [ ] Email notifications for interview reminders
- [ ] Admin dashboard for API usage & user activity monitoring
- [ ] Advanced resume parsing with NLP (Apache OpenNLP)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please **open an issue first** to discuss what you'd like to change.

```bash
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) — blazing fast LLM inference
- [Next.js](https://nextjs.org) & [Tailwind CSS](https://tailwindcss.com)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [PostgreSQL](https://www.postgresql.org)

---

<div align="center">

Built with ❤️ to help job seekers land their dream roles faster.

**[Open an Issue](https://github.com/ItachI008/Match_Forge/issues)** · **[View on GitHub](https://github.com/ItachI008/Match_Forge)**

</div>
