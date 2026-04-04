import { useEffect, useRef, useState } from "react";
import "./ui/Reader.css";

let task: number | null = null;

interface ITranslation {
    from: string;
    transliterationFrom?: string;
    to: string;
    transliterationTo?: string;
}

interface ILanguage {
    name: string;
    nativeName: string;
    dir: string;
}

interface ILanguages {
    [key: string]: ILanguage;
}

export default function Reader() {
    const [history, setHistory] = useState<Array<ITranslation>>([]);
    const [isAuto, setAuto] = useState<boolean>(false);
    const [languages, setLanguages] = useState<ILanguages | null>(null);

    const autoRef = useRef<HTMLInputElement>(null);
    const langFromRef = useRef<HTMLSelectElement>(null);
    const langToRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        const onSelectionEnd = () => {
            let selection = document.getSelection()?.toString()?.trim() ?? "";
            if (selection.length > 0) {
                if (autoRef.current?.checked) {
                    const isLocal =
                        window.location.href.includes("://localhost") ||
                        window.location.href.includes("://127.0.0.");
                    const backUrl = isLocal
                        ? "https://localhost:7217"
                        : "https://pv411pushenko.azurewebsites.net";
                    const langFrom = langFromRef.current?.value ?? "en";
                    const langTo = langToRef.current?.value ?? "uk";

                    fetch(
                        `${backUrl}/Home/ApiTranslate?lang-from=${langFrom}&lang-to=${langTo}&text-from=${encodeURIComponent(selection)}`,
                    )
                        .then((r) => r.json())
                        .then((j) =>
                            setHistory((prev) => [
                                ...prev,
                                {
                                    from: selection,
                                    transliterationFrom: j.transliterationFrom,
                                    to: j.translation,
                                    transliterationTo: j.transliterationTo,
                                },
                            ]),
                        );
                }
            }
            task = null;
        };

        const onSelectionChanged = () => {
            if (task) {
                clearTimeout(task);
            }
            task = setTimeout(onSelectionEnd, 1000);
        };

        document.addEventListener("selectionchange", onSelectionChanged);

        return () => {
            document.removeEventListener("selectionchange", onSelectionChanged);
        };
    }, []);

    useEffect(() => {
        if (isAuto && languages === null) {
            fetch(
                "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0",
            )
                .then((r) => r.json())
                .then((j) => {
                    setLanguages(j.translation);
                });
        }
    }, [isAuto]);

    useEffect(() => {
        if (languages) {
            console.log(languages);
        }
    }, [languages]);

    return (
        <>
            <label htmlFor="">
                <input
                    type="checkbox"
                    ref={autoRef}
                    onChange={() => setAuto(autoRef.current?.checked!)}
                />
                Автоматично перекладати виділений текст
            </label>

            {isAuto && (
                <div>
                    {!languages ? (
                        <span>loading...</span>
                    ) : (
                        <>
                            <span>Мова оригіналу:</span>
                            <select
                                name=""
                                id=""
                                ref={langFromRef}
                                defaultValue={"en"}
                            >
                                {Object.keys(languages).map((lang) => (
                                    <option key={lang} value={lang}>
                                        {languages[lang].name}
                                        {languages[lang].nativeName !==
                                        languages[lang].name
                                            ? ` (${languages[lang].nativeName})`
                                            : null}
                                    </option>
                                ))}
                            </select>
                            <span>Мова перекладу:</span>
                            <select
                                name=""
                                id=""
                                ref={langToRef}
                                defaultValue={"uk"}
                            >
                                {Object.keys(languages).map((lang) => (
                                    <option key={lang} value={lang}>
                                        {languages[lang].name}
                                        {languages[lang].nativeName !==
                                        languages[lang].name
                                            ? ` (${languages[lang].nativeName})`
                                            : null}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </div>
            )}

            {history.length > 0 && (
                <div>
                    {history.map((h) => (
                        <p key={h.from}>
                            <span>
                                {h.from} (
                                <span style={{ fontSize: "12px" }}>
                                    {h.transliterationFrom}
                                </span>
                                ):
                            </span>{" "}
                            <br />
                            <span>
                                {h.to} (
                                <span style={{ fontSize: "12px" }}>
                                    {h.transliterationTo}
                                </span>
                                )
                            </span>
                        </p>
                    ))}
                </div>
            )}
            <h1>Washington</h1>
            <p>
                <b>Washington, D.C.</b>, officially the{" "}
                <b>District of Columbia</b> and commonly known as simply
                <b>Washington</b> or <b>D.C.</b>, is the capital city and
                federal district of the United States. The city is on the
                Potomac River across from Virginia and shares land borders with
                Maryland to its north and east. It was named after George
                Washington, a Founding Father and the first president of the
                United States. The district is named for Columbia, the female
                personification of the nation, through which human form and
                attributes are applied to the United States.
            </p>
            <p>
                The U.S. Constitution in 1789 called for the creation of a
                federal district under exclusive jurisdiction of the U.S.
                Congress. As such, Washington, D.C., is not part of any state,
                and is not one itself. The Residence Act, adopted on July 16,
                1790, approved the creation of the capital district along the
                Potomac River, and is considered the city's founding date. In
                1800, when the capital was moved from Philadelphia, the 6th
                Congress started meeting in the then-unfinished Capitol
                Building, and the second president, John Adams, moved into the
                newly finished White House.
            </p>
            <p>
                In 1801, the District of Columbia, formerly part of Maryland and
                Virginia and including the existing settlements of Georgetown
                and Alexandria, was officially made the federal district;
                initially, the city was a separate settlement within the larger
                district.
            </p>
            <p>
                In 1846, Congress reduced the size of the district when it
                returned the land that Virginia had ceded, including the city of
                Alexandria. In 1871, it made the entire district into a single
                municipality. There have been several failed efforts to reduce
                the district further and admit the rest as a state since the
                1880s, including a statehood bill that passed the House of
                Representatives in 2021 but was not adopted by the U.S. Senate.
            </p>
        </>
    );
}
