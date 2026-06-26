import * as signalR from "@microsoft/signalr";
import { useEffect, useRef } from "react";

export default function Play() {

    const connection = useRef<signalR.HubConnection | null>(null);

    useEffect(() => {

        const conn = new signalR.HubConnectionBuilder()
            .withUrl("http://192.168.1.10:5211/game")
            .withAutomaticReconnect()
            .build();

        connection.current = conn;

        conn.start()
            .then(() => console.log("Celular conectado"))
            .catch(err => console.error(err));

        return () => {
            conn.stop();
        };

    }, []);

    async function move(dir: string) {
        if (connection.current) {
            await connection.current.send("Move", dir);
        }
    }

    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px"
        }}>
            <button
                style={{ fontSize: 40, padding: 30 }}
                onClick={() => move("left")}
            >
                ◀
            </button>

            <button
                style={{ fontSize: 40, padding: 30 }}
                onClick={() => move("right")}
            >
                ▶
            </button>
        </div>
    );
}