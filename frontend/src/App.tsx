import { BrowserRouter, Routes, Route } from "react-router-dom";
import Display from "./pages/Display";
import WebSocketTest from "./pages/WebSocketTest";
import Play from "./pages/Play";


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/display" element={<Display />} />
                <Route path="/play" element={<Play />} />
                <Route path="/" element={<Display />} />
                <Route path="/ws-test" element={<WebSocketTest />} />
            </Routes>
        </BrowserRouter>
    );
}