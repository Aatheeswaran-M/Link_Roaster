# 🔥 Link Roaster

![Link Roaster Hero](https://via.placeholder.com/1200x400/0A66C2/FFFFFF?text=Link+Roaster+-+Discover+the+Internet's+Brutal+Truths)

Link Roaster is a full-stack AI-powered web application that takes any URL (news article, blog, product page, etc.) and generates a brutal, witty summary and roast of the page. It extracts the content, analyzes it using Groq's high-speed AI models, and provides the key takeaways along with a savage verdict. 

Built as an assignment for the **Bipolar Factory** interview process.

## ✨ Key Features

- **AI-Powered Roasts**: Paste any valid URL and get an AI-generated summary, interesting points, questionable claims, and a funny final verdict.
- **Global Feed**: A real-time homepage feed where anyone can browse through past roasts submitted by other users.
- **Multi-Language Translation**: Want the roast in Spanish, French, Tamil, or Japanese? Use the built-in translation feature powered by AI to instantly translate any roast card.
- **User Authentication**: Secure Login & Registration system. Registered users can submit links, manage their history, and delete their own roasts.
- **Personal History**: A dedicated section to view and manage all the URLs you've previously roasted.
- **Stunning UI/UX**: Premium, responsive glassmorphism design with micro-animations, skeleton loaders, and a dynamic progress sequence during the roasting process.
- **Graceful Error Handling**: Detects invalid URLs and handles pages that cannot be scraped securely.

## 🛠 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS v4
- React Router DOM
- Axios
- Lucide React (Icons)
- React Hot Toast

**Backend:**
- Node.js & Express
- MongoDB (Mongoose) for Database
- Groq SDK (Llama 3 / Llama 4 models) for AI generation and translation
- Cheerio / Puppeteer (Web Scraping)
- JSON Web Tokens (JWT) & bcrypt for Authentication

---

## 🚀 Deployment Guide

This app is designed to be easily deployed with **Render** (Backend) and **Vercel** (Frontend).

### 1. Backend Deployment (Render)
1. Push your repository to GitHub.
2. Log in to [Render](https://render.com) and create a new **Web Service**.
3. Connect your GitHub repository and select the `backend` directory (if it's a monorepo, set the Root Directory to `backend`).
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add the following **Environment Variables** in the Render dashboard:
   - `PORT` = `5000`
   - `MONGO_URI` = Your MongoDB connection string
   - `JWT_SECRET` = A secure random string for authentication
   - `GROQ_API_KEY` = Your Groq API Key
7. Click **Deploy**. Copy the resulting live backend URL (e.g., `https://link-roaster-api.onrender.com`).

### 2. Frontend Deployment (Vercel)
1. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. If using a monorepo, set the **Root Directory** to `frontend`.
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add the following **Environment Variable**:
   - `VITE_API_URL` = The live URL of your Render backend (e.g., `https://link-roaster-api.onrender.com`)
8. Click **Deploy**. Your frontend is now live!

---

## 💻 Local Setup & Development

If you want to run the project locally on your machine, follow these steps:

### Prerequisites
- Node.js installed
- A MongoDB cluster (or local instance)
- A Groq API Key

### 1. Clone the repository
```bash
git clone https://github.com/Aatheeswaran-M/Link_Roaster.git
cd Link_Roaster
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file inside the `backend` folder (you can refer to `.env.example`):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```
Start the backend server:
```bash
npm run dev
# or
npm start
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file inside the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000
```
Start the frontend development server:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is open-source and available under the MIT License.
