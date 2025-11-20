import express, { response } from 'express'
import 'dotenv/config'
import axios from 'axios'

const router = express.Router()

router.get('/test',(req,res)=>{
    return res.json({message: "Backend working"})
})

router.get('/weather/:location',(req,res)=>{
    
    const apiKey = process.env.OPENWEATHER_API_KEY
    if(req.params.location.trim() === "") return
    if(!isNaN(req.params.location)){
        const isZipcode = req.params.location
        const url = isZipcode
            ? `https://api.openweathermap.org/data/2.5/weather?zip=${location},us&appid=${apiKey}`
            : `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
        axios.get(url).then((response) =>{
            const cleanedWeatherData = {
                city: response.data.name,
                temperature: response.data.main.temp,
                humidity: response.data.main.humidity,
                wind: response.data.wind,
                visibility: response.data.visibility,
                main: response.data.weather[0].main,
                sunrise: response.data.sys.sunrise,
                sunset: response.data.sys.sunset,
                timezone: response.data.timezone
            }
            return res.json(cleanedWeatherData)
        }).catch((e)=>{
            console.log("Error" + e)
            return res.json({error: "Failed to fetch weather data"})
        })
    }
})

router.get('traffic/:borough',(req,res)=>{
    let totalSpeed=0;
    let count=0;
    const cleanedTrafficData = {}
    const borough = req.params.borough
    axios.get(`https://data.cityofnewyork.us/resource/i4gi-tjb9.json?$where=borough=${borough}`).then((response)=>{
        for (let row of response.data){
            if(row.speed){
                totalSpeed += Number(row.speed)
                count += 1
            }
        }
        const averageSpeed = totalSpeed / count
        cleanedTrafficData.AverageSpeed = averageSpeed
        
        let congestion = ""
        if(averageSpeed >= 25){
            congestion = "Low"
        }
        else if (averageSpeed >= 10){
            congestion = "Medium"
        }
        else{  
            congestion = "High"
        }
        cleanedTrafficData.CongestionLevel = congestion

        return res.json(cleanedTrafficData)
    }).catch((e)=>{
        console.log("Error" + e)
        return res.json({error: "Failed to fetch traffic data"})
    })
})



export default router;
