# Deployment Guide

To deploy this project, follow these steps:

## 1. Frontend (Vercel)
The frontend is a Vite React application.
1. Go to [Vercel](https://vercel.com).
2. Create a new project and import your repository.
3. **Important**: Set the "Root Directory" to `frontend`.
4. Add the following Environment Variable:
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com/api`)

## 2. Backend (Render / Railway)
The backend uses **Puppeteer** for PDF generation, which is too large for Vercel's standard serverless functions. We recommend **Render** or **Railway**.

### On Render:
1. Create a "Web Service" and link your repository.
2. Set "Root Directory" to `backend`.
3. Set "Build Command" to `npm install`.
4. Set "Start Command" to `npm start`.
5. Add these Environment Variables:
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random string.
   - `CORS_ORIGIN`: Your frontend URL (e.g., `https://jagtap-ui.vercel.app`)

## 3. Environment Variables (.env)
Make sure both services have their `.env` variables configured in their respective platforms.
