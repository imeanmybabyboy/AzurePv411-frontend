import { useState } from "react";
import "./ui/Auth.css";
import Base64 from "../../shared/base64/Base64";

interface IAuthData {
    login: string;
    password: string;
}

const initialAuthData: IAuthData = {
    login: "",
    password: "",
};

export default function Auth() {
    const [data, setData] = useState<IAuthData>(initialAuthData);

    const authClick = () => {
        const isLocal =
            window.location.href.includes("://localhost") ||
            window.location.href.includes("://127.0.0.");
        const backUrl = isLocal
            ? "https://localhost:7217"
            : "https://pv411pushenko.azurewebsites.net";
        console.log(data);
        fetch(`${backUrl}/api/auth`, {
            method: "PUT",
            headers: {
                Authorization:
                    "Basic " + Base64.encode(data.login + ":" + data.password),
            },
        })
            .then((r) => r.json())
            .then((j) => console.log(j));
    };

    return (
        <>
            <div>
                <span>Логін: </span>
                <input
                    type="text"
                    onChange={(e) =>
                        setData({ ...data, login: e.target.value })
                    }
                />
            </div>

            <div>
                <span>Пароль: </span>
                <input
                    type="password"
                    onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                    }
                />
            </div>

            <button onClick={() => authClick()}>Вхід</button>

            <h1>Налаштування CORS</h1>
            <p>
                Налаштування CORS передбачає кілька етапів в залежності від
                того, що використовується від сервера (бекенду).
            </p>

            <h2>Origin</h2>
            <p>
                Проблема з джерелом (Origin) виникає якщо сервер та клієнт
                відрізняються принаймні одним з: <br />
                - схема запиту (протокол), наприклад http:// та https:// <br />
                - порт (назва домену) <br />
                Повідомлення про помилку має вигляд: <br />
                <code>
                    Access to fetch at 'https://localhost:7217/api/auth' from
                    origin 'http://localhost:5173' has been blocked by CORS
                    policy: No 'Access-Control-Allow-<b>Origin</b>' header is
                    present on the requested resource.
                </code>{" "}
                <br />
                (звертаємо увагу на закінчення <b>-Origin</b>) <br />
                Рішення: додавання відповідного заголовку у відповіді бекенду
                або включення політики CORS фреймворків на кшталт{" "}
                <a
                    href="https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-10.0#cors-with-default-policy-and-middleware"
                    target="_blank"
                >
                    ASP
                </a>
            </p>

            <h2>Headers</h2>
            <p>
                Проблема з заголовками виникає при включенні до запиту
                заголовків, які не належать переліку CORS (суть-довільні
                заголовки). <br />
                Повідомлення про помилку має вигляд: <br />
                <code>
                    Access to fetch at 'https://localhost:7217/api/auth' from
                    origin 'http://localhost:5173' has been blocked by CORS
                    policy: Request header field <b>authorization</b> is not
                    allowed by Access-Control-Allow-
                    <b>Headers</b> in preflight response.
                </code>{" "}
                <br />
                (звертаємо увагу на закінчення <b>-Headers</b>) <br />
                Технологія: перед надсилання запиту браузер формує попередній
                (preflight) запит методом OPTIONS з передачею у заголовках
                деталей, які вимагають погодження. <br />
                <code>
                    access-control-request-headers authorization <br />
                    access-control-request-method GET <br />
                </code>{" "}
                Рішення: забезпечити відповідь на OPTIONS запити з аналізом
                деталей погодження та дозволом чи забороною відповідних деталей.
                Для фреймворків налаштування зазначається документацією.
            </p>

            <h2>Methods</h2>
            <p>
                Згідно з CORS дозволяється лише GET метод, для інших вимагається
                окреме погодження. Воно також передається у preflight запиті.{" "}
                <br />
                <code>
                    Access to fetch at 'https://localhost:7217/api/auth' from
                    origin 'http://localhost:5173' has been blocked by CORS
                    policy: Method PUT is not allowed by Access-Control-Allow-
                    <b>Methods</b> in preflight response.
                </code>{" "}
                <br />
                (звертаємо увагу на закінчення <b>-Methods</b>) <br />
            </p>
        </>
    );
}
