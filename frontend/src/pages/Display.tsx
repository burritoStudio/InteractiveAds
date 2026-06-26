import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

export default function Display() {
    const [x, setX] = useState(100);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://subventrally-excogitable-duncan.ngrok-free.dev/game")
            .withAutomaticReconnect()
            .build();

        connection.on("move", (direction: string) => {
            if (direction === "left") {
                setX(prev => prev - 20);
            }
            if (direction === "right") {
                setX(prev => prev + 20);
            }
        });

        connection.start()
            .then(() => console.log("SignalR conectado"))
            .catch(err => console.error("Error SignalR:", err));

        return () => {
            connection.stop();
        };
    }, []);

    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            background: "black",
            position: "relative",
            overflow: "hidden"
        }}>
            <div style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "red",
                position: "absolute",
                top: 200,
                left: x
            }} />
        </div>
    );
}