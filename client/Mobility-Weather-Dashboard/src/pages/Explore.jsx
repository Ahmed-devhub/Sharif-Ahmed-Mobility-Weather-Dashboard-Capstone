import axios from 'axios'


function Explore(){

    const [search, setSearch] = useState("")
    const [selection, setSelection] = useState("")
    const [weatherData, setWeatherData] = useState({})
    const [trafficData, setTrafficData] = useState({})

    async function handleClick(){
        const weatherRes = await axios.get(`http://localhost:5000/api/weather/${search}`)
        setWeatherData(weatherRes.data)

        const trafficRes = await axios.get(`http://localhost:5000/api/traffic/${selection}`)
        setTrafficData(trafficRes.data)
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
            <h2>Weather section:</h2>
            <pre>{JSON.stringify(weatherData, null, 2)}</pre>
            <h2>Traffic section:</h2>
            <pre>{JSON.stringify(trafficData, null, 2)}</pre>
        </>
    )
}

export default Explore