# NYC Mobility & Weather Intelligence Dashboard  
### Full-Stack MERN Capstone Project by Ahmed Sharif

A full-stack analytics dashboard that combines **NYC traffic data** and **weather conditions** to analyze mobility patterns across boroughs. The app fetches real-time data from **OpenWeather API** and **NYC Open Data**, stores daily summaries in **MongoDB**, and visualizes insights using React charts.

---

## Features
- Real-time weather + NYC traffic data  
- KPI cards (weather, traffic speed, congestion level, last updated)  
- Borough comparison tool  
- ZIP/Borough search  
- Line chart (trend) & Bar chart (borough performance)  
- Insights generator (automatic summary text)  
- Simple local authentication (login/signup)  
- Search history logging  
- “Refresh Data” button to update MongoDB  

---

## Tech Stack

**Frontend:** React (Vite), Redux Toolkit, React Router, Axios, Recharts  
**Backend:** Node.js, Express.js, MongoDB (Mongoose), Axios, dotenv, CORS  

**Data Sources:**  
- OpenWeather API  
- NYC Open Data - Real-Time Traffic Speeds  

---

## Running the Project

### Backend
```
cd server
npm install
```

Create `.env`:

MONGO_URI=your_mongo_uri

OPENWEATHER_API_KEY=your_key

PORT=5000



Start backend:

```
node server.js
```
---

### Frontend
```
cd ../client/Mobility-Weather-Dashboard
npm install
npm run dev
```

App runs at:  
**http://localhost:5173/**

---

## API Routes

GET /api/weather/:location # Weather by ZIP/City/Borough

GET /api/traffic/:borough # NYC traffic speeds

POST /api/refresh-data # Save daily summary to DB

GET /api/compare # Borough comparison

POST /api/search-history # Log user searches

GET /api/trend/:borough # Borough trend over days 

POST /api/signup # Signup

POST /api/login # Login

---

## Future Enhancements
- Add maps (Mapbox/Leaflet)
- Scheduled background jobs
- ML traffic prediction model

---

## Author
**Ahmed Sharif**  
Software Engineer & Data Analyst  