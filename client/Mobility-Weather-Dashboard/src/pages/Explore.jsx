import axios from 'axios'
import { useState } from 'react'
import Login from './Login'
import "../styles/Explore.css";

function Explore(){

    const [search, setSearch] = useState("")
    const [selection, setSelection] = useState("")
    const [boroughA, setBoroughA] = useState("")
    const [boroughB, setBoroughB] = useState("")
    const [compareResult, setCompareResult] = useState({})   
    const [weatherData, setWeatherData] = useState({})
    const [trafficData, setTrafficData] = useState({})
    const [showWeatherTrafficResult, setShowWeatherTrafficResult] = useState(false)
    const [showComparisonResult, setShowComparisonResult] = useState(false)

    async function handleClick(){
        const weatherRes = await axios.get(`http://localhost:5000/api/weather/${search}`)
        setWeatherData(weatherRes.data)

        const trafficRes = await axios.get(`http://localhost:5000/api/traffic/${selection}`)
        setTrafficData(trafficRes.data)

        const userId = localStorage.getItem("userId")
        await axios.post(`http://localhost:5000/api/search-history`,{
            userId: userId,
            borough: selection,
            zip: search
        })
        setShowWeatherTrafficResult(true)
    }

    async function handleCompare() {
        if (!boroughA || !boroughB) return;
        const res = await axios.get(`http://localhost:5000/api/compare?b1=${boroughA}&b2=${boroughB}`);
        setCompareResult(res.data);
        setShowComparisonResult(true)
    }


    return (
        <div className="explore-container">
            <h1 className="explore-title">EXPLORE</h1>

            <div className="section-box">
                <h2 className="section-title">Search Weather & Traffic</h2>
                <div className="input-row">
                <input value = {search} onChange={(e)=>setSearch(e.target.value)} placeholder='Enter ZIP or city'/>
                <select value={selection} onChange={(e) => setSelection(e.target.value)}>
                    <option value="">Select Borough</option>
                    <option value="brooklyn">Brooklyn</option>
                    <option value="manhattan">Manhattan</option>
                    <option value="queens">Queens</option>
                    <option value="bronx">Bronx</option>
                    <option value="staten-island">Staten Island</option>
                </select>
                <button className="primary-btn" onClick = {handleClick}>Search</button>
            </div>

            {showWeatherTrafficResult &&
                <div className="result-box">
                    <h3>Weather</h3>
                    <p>City: {weatherData.city}</p>
                    <p>Temp: {weatherData.temp}</p>
                    <p>Humidity: {weatherData.humidity}</p>

                    <h3 style={{ marginTop: "15px" }}>Traffic</h3>
                    <p>Borough: {trafficData.borough}</p>
                    <p>Avg Speed: {trafficData.avg_speed}</p>
                    <p>Congestion: {trafficData.congestion_level}</p>
                </div>
            }
            </div>

            <div className="section-box">
                <h2 className="section-title">Compare Boroughs</h2>
                <div className="input-row">
                    <select value={boroughA} onChange={(e) => setBoroughA(e.target.value)}>
                        <option value="">Select Borough</option>
                        <option value="brooklyn">Brooklyn</option>
                        <option value="manhattan">Manhattan</option>
                        <option value="queens">Queens</option>
                        <option value="bronx">Bronx</option>
                        <option value="staten-island">Staten Island</option>
                    </select>
                    <select value={boroughB} onChange={(e) => setBoroughB(e.target.value)}>
                        <option value="">Select Borough</option>
                        <option value="brooklyn">Brooklyn</option>
                        <option value="manhattan">Manhattan</option>
                        <option value="queens">Queens</option>
                        <option value="bronx">Bronx</option>
                        <option value="staten-island">Staten Island</option>
                    </select>
                    <button onClick={handleCompare}>Compare</button>
                </div>
                {showComparisonResult && Object.keys(compareResult).length > 0 ? (
                    <table className="compare-table">
                    <thead>
                        <tr>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Borough</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Avg Speed</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Congestion</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{compareResult?.boroughA?.name}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{compareResult?.boroughA?.avg_speed}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{compareResult?.boroughA?.congestion_level}</td>
                        </tr>
                        <tr>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{compareResult?.boroughB?.name}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{compareResult?.boroughB?.avg_speed}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{compareResult?.boroughB?.congestion_level}</td>
                        </tr>
                    </tbody>
                    </table>
                    ) : (
                        <p>Select two boroughs and press Compare.</p>
                    )}
            </div>
        </div>
    )
}

export default Explore