import axios from 'axios'
import { useState } from 'react'
import Login from './Login'

function Explore(){

    const [search, setSearch] = useState("")
    const [selection, setSelection] = useState("")
    const [boroughA, setBoroughA] = useState("")
    const [boroughB, setBoroughB] = useState("")
    const [compareResult, setCompareResult] = useState({})   
    const [weatherData, setWeatherData] = useState({})
    const [trafficData, setTrafficData] = useState({})

    async function handleClick(){
        const weatherRes = await axios.get(`http://localhost:5000/api/weather/${search}`)
        setWeatherData(weatherRes.data)

        const trafficRes = await axios.get(`http://localhost:5000/api/traffic/${selection}`)
        setTrafficData(trafficRes.data)

        const userId = localStorage.getItem("userId")
        const storeSeaarch = await axios.post(`http://localhost:5000/api/search-history`,{
            userId: userId,
            borough: selection,
            zip: search
        })
    }

    async function handleCompare() {
        if (!boroughA || !boroughB) return;
        const res = await axios.get(`http://localhost:5000/api/compare?b1=${boroughA}&b2=${boroughB}`);
        setCompareResult(res.data);
    }


    return (
        <>
            <input value = {search} onChange={(e)=>setSearch(e.target.value)} placeholder='Enter ZIP or city'/>
            <button onClick = {handleClick}>Search</button>
            <select value={selection} onChange={(e) => setSelection(e.target.value)}>
                <option value="">Select Borough</option>
                <option value="brooklyn">Brooklyn</option>
                <option value="manhattan">Manhattan</option>
                <option value="queens">Queens</option>
                <option value="bronx">Bronx</option>
                <option value="staten-island">Staten Island</option>
            </select>
            <h2>Weather section</h2>
            <pre>{JSON.stringify(weatherData, null, 2)}</pre>
            <h2>Traffic section</h2>
            <pre>{JSON.stringify(trafficData, null, 2)}</pre>
            <h2>Compare Boroughs</h2>
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
            {compareResult ? (
                    <table border="1" style={{ marginTop: "20px" }}>
                    <thead>
                        <tr>
                        <th>Borough</th>
                        <th>Avg Speed</th>
                        <th>Congestion</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>{compareResult.boroughA.name}</td>
                        <td>{compareResult.boroughA.avg_speed}</td>
                        <td>{compareResult.boroughA.congestion_level}</td>
                        </tr>
                        <tr>
                        <td>{compareResult.boroughB.name}</td>
                        <td>{compareResult.boroughB.avg_speed}</td>
                        <td>{compareResult.boroughB.congestion_level}</td>
                        </tr>
                    </tbody>
                    </table>
                ) : (
                    <p>Select two boroughs and press Compare.</p>
                )}
        </>
    )
}

export default Explore