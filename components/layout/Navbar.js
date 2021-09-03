import Image from "next/image"
import Link from "next/link"
import {signIn, signOut, useSession} from "next-auth/client"
import {isAdmin, isLogin} from "../../lib/session"
import IconCollection from "../icons/IconCollection"
import IconLibrary from "../icons/IconLibrary"
import IconItem from "../icons/IconItem"
import IconColumn from "../icons/IconColumn"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import useSWR from "swr"
import Dropdown from "./Dropdown"
import {useState} from "react"
import IconAdmin from "../icons/IconAdmin"
import IconList from "../icons/IconList"
import styles from "./Navbar.module.css"

export default function Navbar() {
    const [session] = useSession()
    const [show, setShow] = useState(false)

    const {data, error} = useSWR("/api/libraries")
    if (error) {
        return <div>failed to load</div>
    }
    const libraries = data ?? []

    return <>
        <button className={styles.outside + " " + styles.toggler + " btn shadow"} type="button"
                aria-label="Toggle navigation" onClick={() => setShow(!show)}>
            <FontAwesomeIcon icon={["fas", show ? "times" : "bars"]}/>
        </button>
        <div className={styles.navbar + " offcanvas offcanvas-start" + (show ? " show" : "")} id={"navbarOffcanvas"}
             tabIndex="-1" style={{visibility: show ? "visible" : "hidden"}} aria-hidden={(!show).toString()}
             role={"dialog"}>
            <div className={styles.header + " offcanvas-header"}>
                <Link href={"/"}>
                    <a className={"navbar-brand"}>
                        <Image src="/icons/logo.png" alt="r/animepiracy Logo" width="32" height="32"
                               className="d-inline-block rounded align-top"/>
                        <span className={"ms-2 align-top"}>
                            The Anime Index
                        </span>
                    </a>
                </Link>

                <button className={styles.toggler + " btn shadow"} type="button" aria-label="Toggle navigation"
                        onClick={() => setShow(!show)}>
                    <FontAwesomeIcon icon={["fas", "times"]}/>
                </button>
            </div>
            <div className="offcanvas-body">
                <nav role={"navigation"}>
                    {isLogin(session) ?
                        <ul className={"list-unstyled"}>
                            <li>
                                <Link href={"/user/" + session.user.uid} key={"users"}>
                                    <a>
                                        <Image src={session.user.image} width={21} height={21}
                                               className={"rounded-circle"}
                                               alt={session.user.name + "'s profile picture"}/>
                                        <span className={"ms-2"}>
                                    {session.user.name}
                                </span>
                                    </a>
                                </Link>
                            </li>
                            {isAdmin(session) ?
                                <li>
                                    <Link href={"/admin"}>
                                        <a title={"Admin settings"}>
                                            <IconAdmin/> Admin
                                        </a>
                                    </Link>
                                </li> : <></>
                            }
                        </ul>
                        : <></>
                    }

                    <hr/>
                    <ul className={"list-unstyled"}>
                        {libraries.length === 0 ?
                            <li>
                                <a href={"#"} className="text-muted">
                                    No libraries found
                                </a>
                            </li> : <></>}
                        {libraries.map(({urlId, name, collections}) =>
                            <Dropdown key={urlId} toggler={name}
                                      head={
                                          <Link href={"/library/" + urlId}>
                                              <a>
                                                  {name}
                                              </a>
                                          </Link>
                                      }
                                      contentList={
                                          collections.length === 0 ? [
                                              <a href={"#"} className={"text-muted"} key={"noCollectionsFound"}>
                                                  No collections found
                                              </a>
                                          ] : collections.map((collection) => {
                                              return <Link href={"/collection/" + collection.urlId}
                                                           key={collection.urlId}>
                                                  <a>
                                                      {collection.name}
                                                  </a>
                                              </Link>
                                          })
                                      }/>
                        )}
                    </ul>

                    <hr/>
                    <ul className={"list-unstyled"}>
                        <li>
                            <Link href={"/libraries"}>
                                <a>
                                    <IconLibrary/> Libraries
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href={"/collections"}>
                                <a>
                                    <IconCollection/> Collections
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href={"/columns"}>
                                <a>
                                    <IconColumn/> Columns
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href={"/items"}>
                                <a>
                                    <IconItem/> Items
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href={"/users"}>
                                <a title={"Users"}>
                                    <FontAwesomeIcon icon={["fas", "users"]}/> Users
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href={"/lists"}>
                                <a>
                                    <IconList/> User lists
                                </a>
                            </Link>
                        </li>
                    </ul>

                    <hr/>
                    <ul className={"list-unstyled"}>
                        <li>
                            <a href="https://wiki.piracy.moe/">
                    <span className={"me-1"}>
                        <Image src={"/icons/wikijs.svg"} height={21} width={21}
                               alt={"Wiki.js logo"}/>
                    </span>
                                Wiki
                            </a>
                        </li>
                        <li>
                            <a href="https://status.piracy.moe/">
                    <span className={"me-1"}>
                        <Image src={"/icons/status.png"} height={21} width={21}
                               alt={"Checkly logo"}/>
                    </span>
                                Status
                            </a>
                        </li>
                        <li>
                            <a href="https://releases.moe/">
                    <span className={"me-1"}>
                        <Image src={"/icons/seadex.png"} height={21} width={21}
                               alt={"Seadex logo"}/>
                    </span>
                                SeaDex
                            </a>
                        </li>
                    </ul>

                    <hr/>
                    <ul className={"list-unstyled"}>
                        <li>
                            <a href={"https://www.reddit.com/r/animepiracy/"}
                               target={"_blank"} rel="noreferrer">
                                <FontAwesomeIcon icon={["fab", "reddit"]}/> Reddit
                            </a>
                        </li>
                        <li>
                            <a href={"https://discord.gg/piracy"}
                               target={"_blank"} rel="noreferrer">
                                <FontAwesomeIcon icon={["fab", "discord"]}/> Discord
                            </a>
                        </li>
                        <li>
                            <a href={"https://twitter.com/ranimepiracy"}
                               target={"_blank"} rel="noreferrer">
                                <FontAwesomeIcon icon={["fab", "twitter"]}/> Twitter
                            </a>
                        </li>
                        <li>
                            <a href={"https://github.com/ranimepiracy/index"}
                               target={"_blank"} rel="noreferrer">
                                <FontAwesomeIcon icon={["fab", "github"]}/> Github
                            </a>
                        </li>
                    </ul>

                    <hr/>
                    <div className={"d-flex justify-content-center"}>
                        <button role={"button"}
                                className={"btn btn-outline-" + (isLogin(session) ? "danger" : "success")}
                                onClick={() => {
                                    if (isLogin(session)) {
                                        signOut()
                                    } else {
                                        signIn("discord")
                                    }
                                }}>
                            {isLogin(session) ? <>
                                Sign out <FontAwesomeIcon icon={["fas", "sign-out-alt"]}/>
                            </> : <>
                                <FontAwesomeIcon icon={["fas", "sign-in-alt"]}/> Sign In
                            </>}
                        </button>
                    </div>
                </nav>
            </div>
        </div>
    </>
}
