import { testConnection } from "../api/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HomePage() {
    const [data, setData] = useState(null);
    useEffect(() => {
        testConnection().then((res => setData(res)));
    }, [data]);

    return (
        <div className="homepage">
            <div className="hero-section">
                <div className="container">
                    <h1 className="main-title">
                        Welcome to
                        <span className="brand-name"> The <span className="nest-highlight">NEST</span> Trail</span>
                    </h1>
                    <p className="subtitle">
                        Congratulations on becoming a new BizzNEST intern! <br />
                        Will you get through The NEST Trail?
                    </p>
                    
                    <Link to="/chat-test" className="cta-button">
                        Start the Trail
                        <span className="arrow">→</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default HomePage;