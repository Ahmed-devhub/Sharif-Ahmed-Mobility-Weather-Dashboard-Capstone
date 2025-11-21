import { useEffect } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setWeather, setTraffic, setRefresh } from "../redux/slices/dataSlice"
import KPICard from "../components/KPICard.jsx"

function Dashboard() {
  const weatherRes = {}
  const trafficRes = {}
  const refreshRes = {}
  const dispatch = useDispatch()
  const weather = useSelector((state) => state.data.weather)
  const traffic = useSelector((state) => state.data.traffic)
  const refresh = useSelector((state)=> state.data.refresh)

  useEffect(async () => {
    try{
      weatherRes = await axios.get("http://localhost:5000/api/weather/11230")
      dispatch(setWeather(weatherRes.data))
    }
    catch(err){ 
      console.log(err)
    }

    try{
      trafficRes = await axios.get("http://localhost:5000/api/traffic/brooklyn")
      dispatch(setTraffic(trafficRes.data))
    }
    catch(err){
      console.log(err)
    }
  }, []);

  async function handleRefresh(){
    try{
      weatherRes = await axios.get("http://localhost:5000/api/weather/11230")
      dispatch(setWeather(weatherRes.data))

      trafficRes = await axios.get("http://localhost:5000/api/traffic/brooklyn")
      dispatch(setTraffic(trafficRes.data))

      refreshRes = await axios.post("http://localhost:5000/api/refresh-data")
      dispatch(setRefresh(refreshRes.data)) 

      if(refreshRes.data.success){
        setTimeout(() => {
          dispatch(setRefresh({})) 
        }, 3000)
      }
    }
    catch(err){
      console.log(err)
    }
  }

  return (
    <>
      <h1>DASHBOARD</h1>

      {refresh?.success && (
        <p style={{color:"green", fontWeight:"bold"}}>
          {refresh.success}
        </p>
      )}

      <KPICard title="Temperature (F)" value={weatherRes.temp}/>
      <KPICard title="Condition" value={weatherRes.main}/>
      <KPICard title="Humidity (%)" value={weatherRes.humidity}/>
      
      <KPICard title="Avg Traffic Speed" value={trafficRes.avg_speed}/>
      <KPICard title="Congestion Level" value={trafficRes.congestion_level}/>

      <KPICard title="Last Updated" value={refreshRes.updatedAt}/>

      <h2>Weather</h2>
      <pre>{JSON.stringify(weather, null, 2)}</pre>

      <h2>Traffic</h2>
      <pre>{JSON.stringify(traffic, null, 2)}</pre>

      <button onCLick = {handleRefresh}>Refresh</button>    
    </>
  );
}

export default Dashboard;