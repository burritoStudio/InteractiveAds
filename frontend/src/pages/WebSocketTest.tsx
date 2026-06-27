import { useRef } from "react";

export default function WebSocketTest() {

    const socket = useRef<WebSocket | null>(null);

    function conectar() {
        socket.current = new WebSocket("wss://subventrally-excogitable-duncan.ngrok-free.dev/ws");

        socket.current.onopen = () => {
            console.log("Conectado");
        };

        socket.current.onclose = () => {
            console.log("Desconectado");
        };

        socket.current.onerror = (e) => {
            console.log(e);
        };
    }

    function enviar() {
        socket.current?.send("hola");
    }

    return (
        <div style={{ padding: 40 }}>
            <button onClick={conectar}>Conectar</button>

            <button onClick={enviar}>
                Enviar
            </button>
        </div>
    );
}