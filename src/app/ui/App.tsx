import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Layout";
import Home from "../../pages/home/Home";
import NotFound from "../../pages/not_found/NotFound";
import Deploy from "../../pages/deploy/Deploy";
import Auth from "../../pages/auth/Auth";
import TryAuth from "../../pages/try_auth/TryAuth";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="auth" element={<Auth />} />
                    <Route path="deploy" element={<Deploy />} />
                    <Route path="try-auth" element={<TryAuth />} />

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
