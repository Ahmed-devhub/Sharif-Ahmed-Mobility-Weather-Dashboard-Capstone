import "../styles/About.css";

function About(){

    return(
        <div className="about-container">
            <h1 className="about-title">About</h1>

            <section className="about-section">
                <h2>Project Description</h2>
                <p>
                    The NYC Mobility & Weather Intelligence Dashboard provides real-time weather, 
                    traffic congestion analysis, borough comparisons, and data-driven insights using OpenWeather and NYC Open Data APIs.
                </p>
            </section>

            <section className="about-section">
                <h2 className="about-heading">Technologies Used</h2>
                <ul className="about-list">
                    <li>
                        React (Vite)
                    </li>
                    <li>
                        Redux Toolkit
                    </li>
                    <li>
                        Express.js
                    </li>
                    <li>
                        MongoDB
                    </li>
                    <li>
                        Axios
                    </li>
                </ul>
            </section>

            <section className="about-section">
                <h2 className="about-heading">APIs Used</h2>
                <ul className="about-list">
                    <li>
                        OpenWeather API
                    </li>
                    <li>
                        NYC Open Data - Real-Time Traffic Speeds
                    </li>
                </ul>
            </section>

            <section className="about-section">
                <h2 className="about-heading">Features</h2>
                <ul className="about-list">
                    <li>
                        Weather dashboard
                    </li>
                    <li>
                        Borough traffic comparison
                    </li>
                    <li>
                        Trend charts
                    </li>
                    <li>
                        KPI cards
                    </li>
                    <li>
                        Insights generator
                    </li>
                    <li>
                        Search ZIP/Borough
                    </li>
                    <li>
                        Search logging
                    </li>
                    <li>
                        "Refresh Data" button
                    </li>
                </ul>
            </section>

            <section className="about-section">
                <h2 className="about-heading">Purpose / Motivation</h2>
                <p className="about-text">
                    This project was built as a full-stack analytics capstone to demonstrate end-to-end skills in software engineering, 
                    API integration, real-time data pipelines, and dashboard design.
                    It showcases my ability to analyze mobility trends, visualize insights, and build scalable full-stack applications 
                    using modern technologies.
                </p>
            </section>

            <section className="about-section">
                <h2 className="about-heading">Contact</h2>
                <p className="about-text"><strong>Name: </strong>Ahmed Sharif</p>
                <p className="about-text"><strong>Email: </strong>ahmedsharif90@gmail.com</p>
                <p className="about-text"><strong>LinkedIn: </strong>{" "}<a className="about-link" href="https://www.linkedin.com/in/ahmedsharifnyc">https://linkedin.com/AhmedSharif</a></p>
                <p className="about-text"><strong>GitHub: </strong>{" "}<a className="about-link" href="https://github.com/Ahmed-devhub">https://github.com/AhmedSharif</a></p>
            </section>
        </div>
    )
}

export default About