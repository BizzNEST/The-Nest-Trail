import { testConnection } from "../api/api";
import { useEffect, useState } from "react";

function HomePage() {
    const [data, setData] = useState(null);
    useEffect(() => {
        testConnection().then((res => setData(res)));
    }, []);
    console.log(data);

    return (
        <div>
            <h1>Welcome to the Nest Trail</h1>
        </div>
    )
}

export default HomePage;