import {useState} from "react"
import styles from "./Dropdown.module.css"

export default function Dropdown(
    {
        targetId,
        toggler,
        head,
        contentList
    }
) {
    const [show, setShow] = useState(false)

    return <li className={"nav-item"}>
        <a className={styles.toggle + " collapsed nav-link" + (show ? " show" : "")} role="button"
           data-bs-toggle={"collapse"} data-bs-target={"#" + targetId} aria-expanded={show.toString()}
           onClick={() => setShow(!show)}>
            {toggler}
        </a>
        <div id={targetId} className={"collapse" + (show ? " show" : "")}>
            <ul className={"list-unstyled small rounded bg-3 ms-4"}>
                {head ? <>
                    <li className={"nav-item"}>
                        {head}
                    </li>
                    <li className={"nav-item"}>
                        <hr className="dropdown-divider"/>
                    </li>
                </> : <></>
                }
                {contentList.map((c, i) =>
                    <li className={"nav-item"} key={i}>
                        {c}
                    </li>
                )}
            </ul>
        </div>
    </li>
}
