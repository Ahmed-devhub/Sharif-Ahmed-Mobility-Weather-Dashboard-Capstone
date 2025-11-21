import mongoose from 'mongoose'


const dailyDataSchema = new mongoose.Schema({
    date: {type: String},
    borough: {type: String},
    weather:{
        city: {type: String},
        temp: {type: Number},
        humidity: {type: Number},
        icon: {type: String},
        windspeed: {type: Number},
        visibility: {type: Number},
        main: {type: String},
        sunrise: {type: Number},
        sunset: {type: Number},
        timezone: {type: Number}
    },
    traffic:{
        avg_speed: {type: Number},
        congestion_level: {type: String}
    },
    updatedAt: {type: Date, default: Date.now}
})

const DailyData = mongoose.model('DailyData',dailyDataSchema)

export default DailyData