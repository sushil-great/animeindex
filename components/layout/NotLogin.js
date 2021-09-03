import styles from "./NotLogin.module.css"
import {signIn} from "next-auth/client"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import Head from "next/head"
import Image from "next/image"

export default function NotLogin() {
    return <div className={styles.wrapper}>
        <Head>
            <title>
                Access denied
            </title>
            <meta name="robots" content="noindex"/>
            <meta name={"description"} content={"You need to login to view the site"}/>
        </Head>
        <h3 className={"mt-5 mb-3"}>
            This page is protected
        </h3>

        <Image width={128} height={128} src={"/img/mioWAAH.gif"} alt={""}
               className={"rounded"}/>
        <p>
            You are currently not logged in
        </p>
        <button className={"btn btn-outline-success"} onClick={signIn}>
            <FontAwesomeIcon icon={["fas", "sign-in-alt"]}/> Sign In
        </button>
    </div>
}
