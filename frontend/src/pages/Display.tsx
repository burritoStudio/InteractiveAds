import { useEffect, useState, useRef } from "react";

export default function Display() {

    const [x, setX] = useState(100);
    const socket = useRef<WebSocket | null>(null);

    useEffect(() => {

        const ws = new WebSocket("wss://subventrally-excogitable-duncan.ngrok-free.dev/ws");
        socket.current = ws;

        ws.onopen = () => {
            console.log("Display conectado");
        };

        ws.onmessage = (event) => {

            const msg = String(event.data).trim(); // 🔥 FIX CLAVE

            console.log("Recibido RAW:", event.data);
            console.log("Recibido CLEAN:", msg);

            setX(prev => {
                if (msg === "left") return prev - 20;
                if (msg === "right") return prev + 20;
                return prev;
            });
        };

        ws.onerror = (e) => {
            console.log("Error WebSocket", e);
        };

        ws.onclose = () => {
            console.log("Display desconectado");
        };

        return () => {
            ws.close();
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
                left: x,
                transition: "left 0.05s linear" // 🔥 suaviza movimiento
            }} />
        </div>
    );
}