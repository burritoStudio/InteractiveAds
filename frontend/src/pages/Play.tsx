import { useEffect, useRef } from "react";

export default function Play() {

    const socket = useRef<WebSocket | null>(null);

    useEffect(() => {

        socket.current = new WebSocket("wss://subventrally-excogitable-duncan.ngrok-free.dev/ws");

        socket.current.onopen = () => {
            console.log("WebSocket conectado");
        };

        socket.current.onclose = () => {
            console.log("WebSocket desconectado");
        };

        socket.current.onerror = (e) => {
            console.error("Error WebSocket", e);
        };

        return () => {
            socket.current?.close();
        };

    }, []);

    function move(dir: string) {
        socket.current?.send(dir);
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