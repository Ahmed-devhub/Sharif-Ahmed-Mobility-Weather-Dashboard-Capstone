import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setWeather, setTraffic, setRefresh } from "../redux/slices/dataSlice.js"
import KPICard from "../components/KPICard.jsx"
import {BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell} from "recharts";
import "../styles/Dashboard.css";

function Dashboard() {

  const dispatch = useDispatch()
  const weather = useSelector((state) => state.data.weather)
  const traffic = useSelector((state) => state.data.traffic)
  const refresh = useSelector((state)=> state.data.refresh)
  const [borough, setBorough] = useState([])
  const [select, setSelect] = useState("bronx")
  const [showSuccess, setShowSuccess] = useState(false);
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
    "staten island": "10314"
  };

  async function handleRefresh(){
    try{
      const weatherRes = await axios.get(`http://localhost:5000/api/weather/${select}`)
      dispatch(setWeather(weatherRes.data))

      const trafficRes = await axios.get(`http://localhost:5000/api/traffic/${select}`)
      dispatch(setTraffic(trafficRes.data))

      const refreshRes = await axios.post("http://localhost:5000/api/refresh-data",{
        location: boroughZip[select],
        borough: select
      })
      dispatch(setRefresh(refreshRes.data)) 

      const trendRes = await axios.get(`http://localhost:5000/api/trend/${select}`)
      setTrendData(trendRes.data)
      
      const insightRes = await axios.get('http://localhost:5000/api/analytics/insights')
      setInsight(insightRes.data.summary)

      if (refreshRes.data.success) {
        dispatch(setRefresh({
          success: refreshRes.data.success,
          updatedAt: refreshRes.data.updatedAt
        }));
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 7000);
      }
    }
    catch(err){
      console.log(err)
    }
  }

  function formatTrendDate(dateString) {
    const d = new Date(dateString + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">DASHBOARD</h1>

      {showSuccess && (
        <p className="success-msg">
          {refresh.success}
        </p>
      )}

      <select
        value={select}
        onChange={e => setSelect(e.target.value)}
        className="dashboard-select"
      >
        <option value="bronx">Bronx</option>
        <option value="brooklyn">Brooklyn</option>
        <option value="manhattan">Manhattan</option>
        <option value="queens">Queens</option>
        <option value="staten island">Staten Island</option>
      </select>

      <div className="kpi-grid">

        <div className="kpi-item">
          <div className="kpi-label">Temperature (°C)</div>
          <div className="kpi-value">{(weather?.temp - 273.15).toFixed(1)}</div>
        </div>

        <div className="kpi-item">
          <div className="kpi-label">Condition</div>
          <div className="kpi-value">{weather?.main}</div>
        </div>

        <div className="kpi-item">
          <div className="kpi-label">Humidity (%)</div>
          <div className="kpi-value">{weather?.humidity}</div>
        </div>

        <div className="kpi-item">
          <div className="kpi-label">Avg Traffic Speed</div>
          <div className="kpi-value">{traffic?.avg_speed}</div>
        </div>

        <div className="kpi-item">
          <div className="kpi-label">Congestion Level</div>
          <div className="kpi-value">{traffic?.congestion_level}</div>
        </div>

        <div className="kpi-item">
          <div className="kpi-label">Last Updated</div>
          <div className="kpi-value">
            {refresh?.updatedAt ? new Date(refresh.updatedAt).toLocaleString() : ""}
          </div>
        </div>

      </div>

      <div className="section-box">
        <h2 className="section-title">Weather</h2>
        <p><strong>City: </strong>{weather?.city}</p>
        <p><strong>Temp: </strong>{((weather?.temp - 273.15) * 9/5 + 32).toFixed(1)}°F / {(weather?.temp - 273.15).toFixed(1)}°C</p>
        <p><strong>Humidity: </strong>{weather?.humidity}</p>
        <p><strong>Icon:</strong><img className="weather-icon" src={`https://openweathermap.org/img/wn/${weather?.icon}.png`} alt="weather icon" /></p>
        <p><strong>Wind Speed: </strong>{(weather?.windspeed * 2.237).toFixed(2)} mph</p>
        <p><strong>Visibility: </strong>{(weather?.visibility / 1609).toFixed(1)} miles</p>
        <p><strong>Main: </strong>{weather?.main}</p>
        <p><strong>Sunrise: </strong>{new Date(weather?.sunrise * 1000).toLocaleTimeString([], { timeStyle: "short" })}</p>
        <p><strong>Sunset: </strong>{new Date(weather?.sunset * 1000).toLocaleTimeString([], { timeStyle: "short" })}</p>
      </div>

      <div className="section-box">
        <h2 className="section-title">Traffic</h2>
        <p><strong>Borough: </strong>{traffic?.borough}</p>
        <p><strong>Average Speed: </strong>{traffic?.avg_speed}</p>
        <p><strong>Congestion Level: </strong>{traffic?.congestion_level}</p>
        <button className="refresh-btn" onClick = {handleRefresh}>Refresh</button>    
      </div>

      <div className="chart-container">
        <h2 className="section-title">Average traffic speed per borough</h2>
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
      </div>

      <div className="chart-container">
        <h2 className="section-title">Traffic Trend Over Time</h2>
        <LineChart width={600} height={300} data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => formatTrendDate(d)} />
          <YAxis />
          <Tooltip labelFormatter={(d) => formatTrendDate(d)} />
          <Legend />
          <Line type="monotone" dataKey="avg_speed" stroke="#ff7f50" strokeWidth={2}/>
        </LineChart>
      </div>
      
      <div className="insight-box">
        <h2 className="section-title">Insight:</h2>
        <p>{insight}</p>
      </div>
    </div>
  );
}

export default Dashboard;