import { useEffect, useRef, useState } from "react";
import "./ui/Reader.css";

let task: number | null = null;

interface ITranslation {
    from: string;
    to: string;
}

export default function Reader() {
    const [history, setHistory] = useState<Array<ITranslation>>([]);
    const [isAuto, setAuto] = useState<boolean>(false);
    const autoRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const onSelectionEnd = () => {
            let selection = document.getSelection()?.toString()?.trim() ?? "";
            console.log(selection, autoRef.current);
            if (selection.length > 0) {
                if (autoRef.current?.checked) {
                    const isLocal =
                        window.location.href.includes("://localhost") ||
                        window.location.href.includes("://127.0.0.");
                    const backUrl = isLocal
                        ? "https://localhost:7217"
                        : "https://pv411pushenko.azurewebsites.net";

                    fetch(
                        `${backUrl}/Home/ApiTranslate?text=${encodeURIComponent(selection)}`,
                    )
                        .then((r) => r.text())
                        .then((j) =>
                            setHistory((prev) => [
                                ...prev,
                                { from: selection, to: j },
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

    return (
        <>
            <label htmlFor="">
                <input
                    type="checkbox"
                    ref={autoRef}
                    onChange={(e) => setAuto(autoRef.current?.checked!)}
                />
                Автоматично перекладати виділений текст
            </label>
            {history.length > 0 && (
                <div>
                    {history.map((h) => (
                        <p>
                            {h.from} : {h.to}
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
