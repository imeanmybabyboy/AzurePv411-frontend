import { Link, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <header>
                Frontend
                <Link to="/">Home</Link>
                <Link to="/no-address">No address</Link>
                <Link to="/deploy">Deploy</Link>
            </header>

            <main>
                <Outlet />
            </main>

            <footer>footer</footer>
        </>
    );
}
