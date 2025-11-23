import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setWeather, setTraffic, setRefresh } from "../redux/slices/dataSlice.js"
import KPICard from "../components/KPICard.jsx"
import {BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell} from "recharts";

function Dashboard() {

  const dispatch = useDispatch()
  const weather = useSelector((state) => state.data.weather)
  const traffic = useSelector((state) => state.data.traffic)
  const refresh = useSelector((state)=> state.data.refresh)
  const [borough, setBorough] = useState([])
  const [select, setSelect] = useState("bronx")
  const [trendData, setTrendData] = useState([])
  const [insight, setInsight] = useState()
  const boroughColors = {
    Brooklyn: "#ff6384",
    Manhattan: "#36a2eb",
    Queens: "#ffcd56",
    Bronx: "#4bc0c0",
    "Staten Island": "#9966ff" 
  } 

  useEffect(() => {
    async function fetchData() {
      try {
        const weatherRes = await axios.get(`http://localhost:5000/api/weather/${select}`);
        dispatch(setWeather(weatherRes.data));
      } catch (err) {
        console.log(err);
      }

      try {
        const trafficRes = await axios.get(`http://localhost:5000/api/traffic/${select}`);
        dispatch(setTraffic(trafficRes.data));
      } catch (err) {
        console.log(err);
      }

      try {
        const boroughs = ['brooklyn', 'queens', 'bronx', 'manhattan', 'staten-island']
        const result = await Promise.all(
          boroughs.map(borough =>
            axios.get(`http://localhost:5000/api/traffic/${borough}`)
          )
        )
        const data = result.map(res=>({
          borough: res.data.borough,
          avg_speed: res.data.avg_speed
        }))
        setBorough(data)
      }
      catch(err){
        console.log(err)
      }

      try{
        const trendRes = await axios.get(`http://localhost:5000/api/trend/${select}`)
        setTrendData(trendRes.data)      
      }
      catch(err){
        console.log(err)
      }

      try{
        const insightRes = await axios.get('http://localhost:5000/api/analytics/insights')
        setInsight(insightRes.data.summary)
      }
      catch(err){
        console.log(err)
      }
    }

    fetchData();
  }, [select]);

  const boroughZip = {
    bronx: "10453",
    brooklyn: "11230",
    manhattan: "10001",
    queens: "11368",
    "staten-island": "10314"
  };

  async function handleRefresh(){
    try{
      const weatherRes = await axios.get(`http://localhost:5000/api/weather/${select}`)
      dispatch(setWeather(weatherRes.data))

      const trafficRes = await axios.get(`http://localhost:5000/api/traffic/${select}`)
      dispatch(setTraffic(trafficRes.data))

      const refreshRes = await axios.post("http://localhost:5000/api/refresh-data",{
        location: boroughZip[select],
        borough: `${select}`
      })
      dispatch(setRefresh(refreshRes.data)) 

      const trendRes = await axios.get(`http://localhost:5000/api/trend/${select}`)
      setTrendData(trendRes.data)
      
      const insightRes = await axios.get('http://localhost:5000/api/analytics/insights')
      setInsight(insightRes.data.summary)

      if(refreshRes.data.success){
        setTimeout(() => {
          dispatch(setRefresh({ updatedAt: refreshRes.data.updatedAt })) 
        }, 3000)
      }
    }
    catch(err){
      console.log(err)
    }
  }

  function trendDataFormattedDateAndTime(dateString){
    const d = new Date(dateString);
    return d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <>
      <h1>DASHBOARD</h1>

      {refresh?.success && (
        <p style={{color:"green", fontWeight:"bold"}}>
          {refresh.success}
        </p>
      )}

      <select value={select} onChange={e => setSelect(e.target.value)}>
        <option value="bronx">Bronx</option>
        <option value="brooklyn">Brooklyn</option>
        <option value="manhattan">Manhattan</option>
        <option value="queens">Queens</option>
        <option value="staten-island">Staten Island</option>
      </select>

      <KPICard title="Temperature (°C)" value={(weather?.temp - 273.15).toFixed(1)}/>
      <KPICard title="Condition" value={weather?.main}/>
      <KPICard title="Humidity (%)" value={weather?.humidity}/>
      
      <KPICard title="Avg Traffic Speed" value={traffic?.avg_speed}/>
      <KPICard title="Congestion Level" value={traffic?.congestion_level}/>

      <KPICard title="Last Updated" value={refresh?.updatedAt ? new Date(refresh.updatedAt).toLocaleString() : ""}/>

      <h2>Weather</h2>
      <p><strong>City: </strong>{weather?.city}</p>
      <p><strong>Temp: </strong>{((weather?.temp - 273.15) * 9/5 + 32).toFixed(1)}°F / {(weather?.temp - 273.15).toFixed(1)}°C</p>
      <p><strong>Humidity: </strong>{weather?.humidity}</p>
      <p><strong>Icon:</strong><img src={`https://openweathermap.org/img/wn/${weather?.icon}.png`} alt="weather icon" /></p>
      <p><strong>Wind Speed: </strong>{(weather?.windspeed * 2.237).toFixed(2)} mph</p>
      <p><strong>Visibility: </strong>{(weather?.visibility / 1609).toFixed(1)} miles</p>
      <p><strong>Main: </strong>{weather?.main}</p>
      <p><strong>Sunrise: </strong>{new Date(weather?.sunrise * 1000).toLocaleTimeString([], { timeStyle: "short" })}</p>
      <p><strong>Sunset: </strong>{new Date(weather?.sunset * 1000).toLocaleTimeString([], { timeStyle: "short" })}</p>

      <h2>Traffic</h2>
      <p><strong>Borough: </strong>{traffic?.borough}</p>
      <p><strong>Average Speed: </strong>{traffic?.avg_speed}</p>
      <p><strong>Congestion Level: </strong>{traffic?.congestion_level}</p>

      <button onClick = {handleRefresh}>Refresh</button>    

      <BarChart width={500} height={300} data={borough}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="borough" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="avg_speed">
          {
            borough.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={boroughColors[entry.borough]}
              />
            ))
          } 
        </Bar>
      </BarChart>
      
      <h2>Traffic Trend Over Time</h2>
      <LineChart width={600} height={300} data={trendData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="updatedAt" tickFormatter={trendDataFormattedDateAndTime}/>
        <YAxis />
        <Tooltip labelFormatter={trendDataFormattedDateAndTime}/>
        <Legend />
        <Line type="monotone" dataKey="avg_speed" stroke="#ff7f50" strokeWidth={2}/>
      </LineChart>
      <h2>Insight:</h2>
      <p>{insight}</p>
    </>
  );
}

export default Dashboard;