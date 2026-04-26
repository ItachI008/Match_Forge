🚀 MatchForge AI – AI-Powered Resume & Job Match Platform

MatchForge AI is a full‑stack web application that uses Generative AI to analyze your resume against a job description, provides a match score, identifies missing skills, and suggests improvements. It also helps you track your job applications, with a clean dashboard and an AI assistant for follow‑up advice.

✨ Features

- 📄 Resume Upload – Upload PDF/DOCX (text extracted automatically)
- 📝 Job Description Input – Paste any job posting
- 🤖 AI Match Analysis – Powered by Groq (Llama 3.3/3.1) – returns:
  - Overall match score (0‑100)
  - Category scores (skills, experience, keywords, projects)
  - Matched skills / missing critical skills
  - Actionable suggestions (critical / high / recommended)
- 🔐 User Authentication – Email + password with JWT (cookie‑based)
- 📊 Dashboard – Real stats: applications sent, avg match score, interviews/offers, score trend chart
- 💾 Persistent Storage – PostgreSQL database (all user data saved)
- 🎨 Dark / Light Mode – Fully themable with next‑themes
- 🧠 AI Assistant – Ask follow‑up questions about improving your resume
- 📋 Application Tracker – Save match results as applications, update status (Applied → Interview → Offer / Rejected)

🛠️ Tech Stack

Layer       | Technology
------------|----------------------------------------------------------------------------
Frontend    | Next.js 14 (App Router), TypeScript, Tailwind CSS, next‑themes, Recharts
Backend     | Spring Boot 3.2, Spring Security, JWT, Hibernate, PostgreSQL
AI / LLM    | Groq API (Llama 3.3‑70B / Llama 3.1‑8B)
Database    | PostgreSQL (local / cloud)
Build Tools | Maven (backend), npm (frontend)

📁 Project Structure

matchforge/
├── matchforge-frontend/          # Next.js frontend
│   ├── app/                      # Pages (dashboard, upload, job‑description, match‑results, ai‑assistant, login, register)
│   ├── components/               # Reusable UI components
│   ├── context/                  # AppContext (auth, analysis, applications)
│   ├── lib/                      # Mock data (fallback)
│   └── public/                   # Static files
└── matchforge-backend/           # Spring Boot backend
    ├── src/main/java/...         # Controllers, services, models, repositories, security
    ├── src/main/resources/       # application.properties
    └── pom.xml                   # Maven dependencies

🚀 Getting Started (Local Development)

Prerequisites
- Node.js 18+ and npm
- Java 17+ and Maven
- PostgreSQL 14+ (or use H2 for quick testing)
- Groq API key (free tier available at console.groq.com)

1. Clone the repository

git clone https://github.com/ItachI008/Match_Forge.git
cd matchforge-ai

2. Backend Setup (Spring Boot)

2.1 Create PostgreSQL database

CREATE DATABASE matchforge;
CREATE USER matchforge_user WITH PASSWORD 'matchforge123';
GRANT ALL PRIVILEGES ON DATABASE matchforge TO matchforge_user;

2.2 Configure application.properties
Edit matchforge-backend/src/main/resources/application.properties:

Note: For quick testing without PostgreSQL, comment out the PostgreSQL block and uncomment the H2 block.

2.3 Run the backend

cd matchforge-backend
./mvnw clean spring-boot:run   # (Windows: mvnw.cmd clean spring-boot:run)

The backend will start at http://localhost:8080.

3. Frontend Setup (Next.js)

3.1 Install dependencies

cd matchforge-frontend
npm install

3.2 Environment variables (optional)
Create .env.local:

NEXT_PUBLIC_API_URL=http://localhost:8080/api

The frontend is pre‑configured to http://localhost:8080/api. Change only if you deploy the backend elsewhere.

3.3 Run the frontend

npm run dev

Open http://localhost:3000.

4. Use the application

1. Register a new account or Login.
2. Upload Resume (PDF or DOCX).
3. Job Description – paste the job posting and click “Analyze Match”.
4. View the Match Results page with score, skill analysis, and suggestions.
5. Save the application (optional).
6. Explore the Dashboard to see stats and trend.
7. Use the AI Assistant for follow‑up resume tips.

🧪 Testing

- Backend: mvnw.cmd test (unit tests for services)
- Frontend: npm run test (if you add tests)

🗄️ Database Management

- H2 console (if enabled): http://localhost:8080/h2-console
- PostgreSQL: use psql or pgAdmin.

🐳 Deployment (Production)

Backend (Render / Railway)
- Build the JAR: mvnw.cmd clean package
- Use the generated JAR in target/
- Set environment variables:
  - SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD
  - JWT_SECRET, JWT_EXPIRATION, GROQ_API_KEY

Frontend (Vercel)
- Push to GitHub, import on Vercel.
- Set environment variable: NEXT_PUBLIC_API_URL = your deployed backend URL.

📌 Known Issues & Solutions

- 403 Forbidden on match analysis?
  Ensure the frontend sends the Authorization: Bearer <token> header. Our code does it automatically after login.
- Groq model deprecated?
  Update GroqService.java to use the latest model name from Groq’s console.
- Port 8080 already in use?
  Kill the process or change server.port in application.properties.

🔮 Future Improvements

- ✅ OTP verification during new user signup (email confirmation)
- ✅ Google OAuth sign‑in option (one‑click login)
- ✅ Forms to feed job hunt data – manual entry of company, role, status, notes, and custom tags
- ✅ Export match results as PDF / CSV for offline analysis
- ✅ Resume version history – store previous versions and track improvements
- ✅ Email notifications for interview reminders or new AI suggestions
- ✅ Admin dashboard to monitor API usage and user activity
- ✅ Advanced resume parsing using NLP libraries (e.g., Apache OpenNLP)

🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

📄 License

MIT

🙏 Acknowledgements

- Groq for fast LLM inference
- Next.js & Tailwind CSS
- Spring Boot
- PostgreSQL

Built with ❤️ to help job seekers land their dream roles faster.
For questions or support, open an issue on GitHub.