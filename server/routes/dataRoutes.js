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
    function getESTDate() {
        return new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }))
    }
    const today = getESTDate().toISOString().slice(0, 10)
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
                updatedAt: getESTDate() 
            }
        } 
        )
    }
    return res.json({updatedAt: getESTDate(), success: "Successfully save the data into MongoDB"})
})

router.get('/trend/:borough', async(req,res)=>{
    try{
        const borough = req.params.borough.replace("-", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        const records = await DailyData.find({borough: borough}).sort({date: 1})

        const cleanedRecord = records.map(record=> (
        {
            date: record.date,
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


export default router;
