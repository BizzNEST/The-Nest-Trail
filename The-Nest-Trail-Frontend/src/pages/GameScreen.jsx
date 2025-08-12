import Chatlog from "./Chatlog";
import Inventory from "./Inventory";

function GameScreen() {
    return (
        <div className="h-screen w-screen flex justify-center items-center flex-col">
            <div className="p-4 w-210 h-134 rounded-2xl flex flex-row justify-center items-start bg-[url(/src/assets/dn-banner-1.webp)] bg-cover bg-center">
                <Inventory/>
                <Chatlog/>
            </div>
        </div>


    )
}

export default GameScreen;