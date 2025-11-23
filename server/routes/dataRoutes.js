import express from 'express'
import 'dotenv/config'
import axios from 'axios'
import DailyData from '../models/DailyData.js'

const router = express.Router()

router.get('/weather/:location', async(req,res)=>{
    let cleanedWeatherData = {}
    const apiKey = process.env.OPENWEATHER_API_KEY
    const location = req.params.location.trim()
    if(!location) return
        const isZipcode = !isNaN(location)
        const url = isZipcode
            ? `https://api.openweathermap.org/data/2.5/weather?zip=${location},us&appid=${apiKey}`
            : `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
        try{
            const weatherRes = await axios.get(url)
            cleanedWeatherData = {
                city: weatherRes.data.name,
                temp: weatherRes.data.main.temp,
                humidity: weatherRes.data.main.humidity,
                icon: weatherRes.data.weather[0].icon,
                windspeed: weatherRes.data.wind.speed,
                visibility: weatherRes.data.visibility,
                main: weatherRes.data.weather[0].main,
                sunrise: weatherRes.data.sys.sunrise,
                sunset: weatherRes.data.sys.sunset,
            }
            return res.json(cleanedWeatherData)
        }
        catch(e){
            console.log("Weather API Error: " + e)
            return res.json({error: "Failed to fetch weather data"})
        }
})

router.get('/traffic/:borough', async(req,res)=>{
    let totalSpeed=0;
    let count=0;
    const cleanedTrafficData = {}
    const borough = req.params.borough.replace("-", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    const url = `https://data.cityofnewyork.us/resource/i4gi-tjb9.json?$where=borough=%27${borough}%27`
    try{
        const trafficRes = await axios.get(url)
        cleanedTrafficData.borough = borough
        for (let row of trafficRes.data){
            if(row.speed){
                totalSpeed += Number(row.speed)
                count += 1
            }
        }
        let averageSpeed = 0;
        if (count > 0) {
            averageSpeed = Number((totalSpeed / count).toFixed(2));
        } else {
            averageSpeed = 0;
        }
        cleanedTrafficData.avg_speed = averageSpeed
        
        let congestion = ""
        if(averageSpeed >= 20){
            congestion = "Low"
        }
        else if (averageSpeed >= 10 && averageSpeed <20){
            congestion = "Medium"
        }
        else{  
            congestion = "High"
        }
        cleanedTrafficData.congestion_level = congestion

        return res.json(cleanedTrafficData)
    }
    catch(e){
        console.log("Traffic API Error: " + e)
        return res.json({error: "Failed to fetch traffic data"})
    }
})

router.post('/refresh-data', async(req,res)=>{
    let cleanedWeatherData = {}
    const apiKey = process.env.OPENWEATHER_API_KEY
    const location = req.body.location.trim()
    if(!location) return
        const isZipcode = !isNaN(location)
        const weatherUrl = isZipcode
            ? `https://api.openweathermap.org/data/2.5/weather?zip=${location},us&appid=${apiKey}`
            : `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
        try{
            const weatherRes = await axios.get(weatherUrl)
            cleanedWeatherData = {
                city: weatherRes.data.name,
                temp: weatherRes.data.main.temp,
                humidity: weatherRes.data.main.humidity,
                icon: weatherRes.data.weather[0].icon,
                windspeed: weatherRes.data.wind.speed,
                visibility: weatherRes.data.visibility,
                main: weatherRes.data.weather[0].main,
                sunrise: weatherRes.data.sys.sunrise,
                sunset: weatherRes.data.sys.sunset,
            }
        }
        catch(e){
            console.log("Weather API Error: " + e)
            return res.json({error: "Failed to fetch weather data"})
        }

    let totalSpeed=0;
    let count=0;
    const cleanedTrafficData = {}

    const borough = req.body.borough.trim().replace("-", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    console.log("Refresh Borough:", borough);
    const trafficUrl = `https://data.cityofnewyork.us/resource/i4gi-tjb9.json?$where=borough=%27${borough}%27`
    try{
        const trafficRes = await axios.get(trafficUrl)
        cleanedTrafficData.borough = borough .replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
        for (let row of trafficRes.data){
            if(row.speed){
                totalSpeed += Number(row.speed)
                count += 1
            }
        }
        let averageSpeed = 0;
        if (count > 0) {
            averageSpeed = Number((totalSpeed / count).toFixed(2));
        } else {
            averageSpeed = 0;
        }
        cleanedTrafficData.avg_speed = averageSpeed
        
        let congestion = ""
        if(averageSpeed >= 20){
            congestion = "Low"
        }
        else if (averageSpeed >= 10 && averageSpeed <20){
            congestion = "Medium"
        }
        else{  
            congestion = "High"
        }
        cleanedTrafficData.congestion_level = congestion
    }
    catch(e){
        console.log("Traffic API Error: " + e)
        return res.json({error: "Failed to fetch traffic data"})
    }
    const today = new Date().toISOString().slice(0,10)
    const record = await DailyData.findOne({date: today, borough: borough})
    if(!record){
        await DailyData.create({
            date: today,
            borough: borough,
            weather: cleanedWeatherData,
            traffic: cleanedTrafficData
        })
    }
    else{
        await DailyData.updateOne({date: today, borough: borough},{
            $set: {
                weather: cleanedWeatherData,
                traffic: cleanedTrafficData,
                updatedAt: new Date() 
            }
        } 
        )
    }
    return res.json({updatedAt: new Date(), success: "Successfully save the data into MongoDB"})
})

router.get('/trend/:borough', async(req,res)=>{
    try{
        const borough = req.params.borough.replace("-", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        const records = await DailyData.find({borough: borough}).sort({updatedAt: 1})

        const cleanedRecord = records.map(record=> (
        {
            updatedAt: record.updatedAt,
            avg_speed: record.traffic.avg_speed
        }
        ))

        return res.json(cleanedRecord)
    }
    catch(e){
        console.log("MongoDb Data Fetch Error: " + e)
        return res.json({error: "Failed to fetch data from mongoDb"})        
    }
})

router.get("/analytics/insights", async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0,10);
        const records = await DailyData.find({ date: today });
        if (records.length === 0) {
        return res.json({ summary: "No data available for today." });
        }
        const sorted = records.sort(
        (a, b) => a.traffic.avg_speed - b.traffic.avg_speed
        );
        const worst = sorted[0];                      
        const best = sorted[sorted.length - 1];        

        const weather = records.find(r => r.weather && r.weather.main);
        let weatherImpact = "";
        if (weather) {
            const cond = weather.weather.main.toLowerCase();
            if (cond.includes("rain")) {
                weatherImpact = "Rain likely increased congestion.";
            }
            else if (cond.includes("snow")) {
                weatherImpact = "Snow may have slowed traffic across boroughs.";
            }
            else if (cond.includes("cloud")) {
                weatherImpact = "Cloudy conditions minimal impact on traffic.";
            }
            else if (cond.includes("clear")) {
                weatherImpact = "Clear weather ideal traffic conditions.";
            }
            else if (cond.includes("fog")) {
                weatherImpact = "Foggy conditions visibility may be reduced.";
            }
            else if (cond.includes("mist")) {
                weatherImpact = "Mist may slightly reduce visibility.";
            }
            else if (cond.includes("drizzle")) {
                weatherImpact = "Light drizzle may have a small impact on speed.";
            }
            else if (cond.includes("thunderstorm")) {
                weatherImpact = "Thunderstorms likely caused major slowdowns.";
            }
            else {
                weatherImpact = "Weather conditions appear normal today.";
            }
        }
        const summary = `${worst.borough} has the highest congestion today (avg speed ${worst.traffic.avg_speed} mph).
            ${best.borough} is the fastest borough today (avg speed ${best.traffic.avg_speed} mph).
            ${weatherImpact}`.trim();

        return res.json({summary});
    } 
    catch (err) {
        console.log("Insight Error:", err);
        return res.json({ summary: "Unable to generate insights." });
    }
});

export default router;
