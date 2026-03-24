import { useRef, useState } from "react";
import "./ui/TryAuth.css";
import Base64 from "../../shared/base64/Base64";

interface IAuthData {
    login: string;
    password: string;
}

const initialAuthData: IAuthData = {
    login: "",
    password: "",
};

export default function TryAuth() {
    const [data, setData] = useState<IAuthData>(initialAuthData);
    const alertRef = useRef<HTMLDivElement>(null);

    const authClick = () => {
        const isLocal =
            window.location.href.includes("://localhost") ||
            window.location.href.includes("://127.0.0.");
        const backUrl = isLocal
            ? "https://localhost:7217"
            : "https://pv411pushenko.azurewebsites.net";
        console.log(data);
        fetch(`${backUrl}/api/auth`, {
            method: "POST",
            headers: {
                Authorization:
                    "Basic " + Base64.encode(data.login + ":" + data.password),
            },
        })
            .then((r) => r.json())
            .then((j) => {
                if (alertRef.current) {
                    alertRef.current.classList.remove(
                        "alert-success",
                        "alert-danger",
                    );

                    if (j.status === 200) {
                        alertRef.current.classList.add("alert-success");
                    } else {
                        alertRef.current.classList.add("alert-danger");
                    }
                    alertRef.current.textContent = j.message;
                }
            });
    };

    return (
        <div className="container">
            <div className="fs-5">Available credentials:</div>
            <table className="table w-50">
                <thead>
                    <tr>
                        <th>Login</th>
                        <th>Password</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Owner</td>
                        <td>owner123</td>
                    </tr>
                    <tr>
                        <td>Admin</td>
                        <td>imadmin</td>
                    </tr>
                    <tr>
                        <td>Visitor</td>
                        <td>noPass</td>
                    </tr>
                    <tr>
                        <td>Privileged_user</td>
                        <td>priv111</td>
                    </tr>
                </tbody>
            </table>

            <div
                className="d-flex flex-column gap-3"
                style={{ width: "280px" }}
            >
                <h2>Login</h2>

                <div className="d-flex justify-content-between">
                    <label htmlFor="">Login:</label>
                    <input
                        type="text"
                        onChange={(e) =>
                            setData({ ...data, login: e.target.value })
                        }
                    />
                </div>

                <div className="d-flex justify-content-between">
                    <label htmlFor="">Password:</label>
                    <input
                        type="password"
                        onChange={(e) =>
                            setData({ ...data, password: e.target.value })
                        }
                    />
                </div>

                <button
                    className="btn btn-outline-success"
                    onClick={() => authClick()}
                >
                    Вхід
                </button>
            </div>

            <div
                ref={alertRef}
                className="alert text-center mt-4"
                role="alert"
            ></div>
        </div>
    );
}
