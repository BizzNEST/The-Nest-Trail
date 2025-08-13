import { testConnection } from "../api/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HomePage() {
    const [data, setData] = useState(null);
    useEffect(() => {
        testConnection().then((res => setData(res)));
        console.log(data);
    }, [data]);

    return (
        <div>
            <h1>Welcome to the Nest Trail</h1>
            <Link to="/chat-test">Chat</Link>
        </div>
    )
}

export default HomePage;