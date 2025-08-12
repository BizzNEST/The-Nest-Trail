import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="h-screen w-screen flex justify-center items-center flex-col">
            <div className="w-210 h-134 border-1 rounded-lg border-zinc-400 flex flex-col justify-center items-center gap-4 bg-linear-to-b from-zinc-700 to-zinc-900">
                <h1 className="font-mono font-bold">The NEST Trail</h1>
                <Link to={'/GameScreen'}><button className="font-mono rounded-sm bg-green-300">Start</button></Link>
            </div>
        </div>

    )
}

export default HomePage;