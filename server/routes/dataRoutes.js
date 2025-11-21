import express from 'express'
import 'dotenv/config'
import axios from 'axios'
import mongoose from 'mongoose'
import DailyData from '../models/DailyData'

const router = express.Router()

router.get('/weather/:location', async(req,res)=>{
    let cleanedWeatherData = {}
    const apiKey = process.env.OPENWEATHER_API_KEY
    if(req.params.location.trim() === "") return
    if(!isNaN(req.params.location)){
        const isZipcode = req.params.location
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
                timezone: weatherRes.data.timezone
            }
            return res.json(cleanedWeatherData)
        }
        catch(e){
            console.log("Weather API Error: " + e)
            return res.json({error: "Failed to fetch weather data"})
        }
    }
})

router.get('traffic/:borough', async(req,res)=>{
    let totalSpeed=0;
    let count=0;
    const cleanedTrafficData = {}
    const borough = req.params.borough
    const url = `https://data.cityofnewyork.us/resource/i4gi-tjb9.json?$where=borough=${borough}`
    try{
        const trafficRes = await axios.get(url)
        cleanedTrafficData.borough = borough
        for (let row of trafficRes.data){
            if(row.speed){
                totalSpeed += Number(row.speed)
                count += 1
            }
        }
        const averageSpeed = totalSpeed / count
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
    const apiKey = process.env.OPENWEATHER_API_KEY
    const location = req.body.location
    if(location.trim() === "") return
    if(!isNaN(location)){
        const isZipcode = location
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
                timezone: weatherRes.data.timezone
            }
        }
        catch(e){
            console.log("Weather API Error: " + e)
            return res.json({error: "Failed to fetch weather data"})
        }
    }

    let totalSpeed=0;
    let count=0;
    const cleanedTrafficData = {}
    const borough = req.body.borough
    const url = `https://data.cityofnewyork.us/resource/i4gi-tjb9.json?$where=borough=${borough}`
    try{
        const trafficRes = await axios.get(url)
        cleanedTrafficData.borough = borough
        for (let row of trafficRes.data){
            if(row.speed){
                totalSpeed += Number(row.speed)
                count += 1
            }
        }
        const averageSpeed = totalSpeed / count
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
    return res.json({success: "Successfully save the data into MongoDB"})
})


export default router;
