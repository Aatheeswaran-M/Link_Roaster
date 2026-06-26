# Link Roaster 🔥

Link Roaster is a full-stack web application that takes any public URL, scrapes its content, and uses AI to generate a witty, structured roast (summary, what's interesting, what's questionable, and a final verdict).

## Tech Stack
- **Frontend:** React.js (Vite), TailwindCSS, Axios, date-fns, lucide-react
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Cheerio, express-rate-limit
- **AI Integration:** Google Gemini API (`gemini-1.5-flash`)

## Screenshots
*(Add screenshots of your application here once deployed)*

## Local Setup Instructions

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd Link_Roaster
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` directory (refer to Environment Variables below) and start the server:
\`\`\`bash
npm run dev
# or
npx nodemon server.js
\`\`\`

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
\`\`\`
Create a `.env` file in the `frontend` directory and start the dev server:
\`\`\`bash
npm run dev
\`\`\`

## Environment Variables

### `backend/.env`
| Variable | Description |
|----------|-------------|
| \`MONGODB_URI\` | Your MongoDB connection string |
| \`GEMINI_API_KEY\` | Your Google Gemini API Key |
| \`PORT\` | Port for the backend server (default: 5000) |

### `frontend/.env`
| Variable | Description |
|----------|-------------|
| \`VITE_API_URL\` | URL of your backend (e.g., \`http://localhost:5000\`) |

## Deployment Instructions

### Backend (Railway)
1. Push your code to GitHub.
2. Go to [Railway.app](https://railway.app/) and create a new project from your GitHub repository.
3. Select the `backend` folder as the root directory in the deployment settings if you deploy as a monorepo, or deploy just the backend.
4. Add the environment variables (`MONGODB_URI`, `GEMINI_API_KEY`, `PORT`) in the Railway variables tab.
5. Railway will automatically install dependencies and run the server.

### Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com/) and import your GitHub repository.
2. Select the `frontend` folder as the Root Directory.
3. Vercel will automatically detect Vite.
4. Add the `VITE_API_URL` environment variable pointing to your Railway backend URL.
5. Click Deploy.
