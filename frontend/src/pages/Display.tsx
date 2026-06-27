import { useEffect, useState, useRef } from "react";

export default function Display() {

    const [x, setX] = useState(100);
    const socket = useRef<WebSocket | null>(null);

    useEffect(() => {

        socket.current = new WebSocket("wss://subventrally-excogitable-duncan.ngrok-free.dev/ws");

        socket.current.onopen = () => {
            console.log("Display conectado");
        };

        socket.current.onmessage = (event) => {
            const msg = event.data;

            console.log("Recibido:", msg);

            if (msg === "left") {
                setX(prev => prev - 20);
            }

            if (msg === "right") {
                setX(prev => prev + 20);
            }
        };

        socket.current.onerror = (e) => {
            console.log("Error WebSocket", e);
        };

        return () => {
            socket.current?.close();
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