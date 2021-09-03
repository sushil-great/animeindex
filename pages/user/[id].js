import {siteName} from "../../components/layout/Layout"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import {useSession} from "next-auth/client"
import {isAdmin, isCurrentUser} from "../../lib/session"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import DataBadge from "../../components/data/DataBadge"
import {getUsers, getUserWithLists} from "../../lib/db/users"
import useSWR from "swr"
import Error from "../_error"
import ListBoard from "../../components/boards/ListBoard"
import ItemBoard from "../../components/boards/ItemBoard"

export default function User({uid, user: staticUser}) {
    const [session] = useSession()
    const {data: user, error} = useSWR("/api/user/" + uid)

    if (error) {
        return <Error error={error} statusCode={error.status}/>
    }

    const name = user ? user.name : staticUser.name
    const description = user ? user.description : staticUser.description
    const image = user ? user.image : staticUser.image
    const accountType = user ? user.accountType : staticUser.accountType
    const favs = user ? user.favs : staticUser.favs
    const lists = user ? user.lists : staticUser.lists
    const followLists = user ? user.followLists : staticUser.followLists
    return <>
        <Head>
            <title>
                {"User " + name + " | " + siteName}
            </title>
            <meta name="robots" content="noindex, archive, follow"/>
            <meta name="description" content={description}/>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content={"User " + name + " on The Anime Index"}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={image}/>
        </Head>

        <div className={"card bg-2"}>
            <div className="card-body pb-0">
                <div className={"card-title row"}>
                    <div className={"col-auto"} style={{
                        height: "40px",
                        overflow: "show"
                    }}>
                        <Image className={"rounded"} alt={"Profile picture of " + name} width={64} height={64}
                               src={image || "https://avatars.dicebear.com/api/pixel-art/" + uid + ".svg"}/>
                    </div>
                    <div className={"col"}>
                        <h3>
                            {name}
                            <span className={"ms-2"} style={{fontSize: "1.2rem"}}>
                            <DataBadge name={accountType} style={"primary"}/>
                            <div className={"float-end"}>
                                {isAdmin(session) || isCurrentUser(session, uid) ? <Link href={"/edit/user/" + uid}>
                                    <a title={"Edit user"} className={"ms-2"}>
                                        <FontAwesomeIcon icon={["fas", "cog"]}/>
                                    </a>
                                </Link> : <></>}
                            </div>
                        </span>
                        </h3>
                    </div>
                </div>
            </div>
            <div className={"card-body bg-4"}>
                <p className={"card-text"} style={{
                    whiteSpace: "pre-line"
                }}>
                    {description || <span className={"text-muted"}>
                        It seems quite empty here
                    </span>}
                </p>
            </div>
        </div>

        <h3 className={"mt-3"}>
            Starred items
            <div className={"float-end"} style={{fontSize: "1.2rem"}}>
                <DataBadge name={favs.length + " item" + (favs.length !== 1 ? "s" : "")}
                           style={"primary"}/>
            </div>
        </h3>
        {favs.length > 0 ?
            <ItemBoard _id={uid} items={favs} canEdit={false} updateURL={"/api/edit/user"} updateKey={"favs"}/> :
            <p className={"text-muted"}>
                No starred items found
            </p>
        }

        <h3 className={"mt-3"}>
            Lists
            <div className={"float-end"} style={{fontSize: "1.2rem"}}>
                <DataBadge name={lists.length + " list" + (lists.length !== 1 ? "s" : "")}
                           style={"primary"}/>
            </div>
        </h3>
        {lists.length > 0 || isCurrentUser(session, uid) ?
            <ListBoard uid={uid} lists={lists} canEdit={isCurrentUser(session, uid) || isAdmin(session)}
                       updateURL={"/api/edit/user"}/> :
            <p className={"text-muted"}>
                No user lists found
            </p>
        }

        <h3 className={"mt-3"}>
            Followed lists
            <div className={"float-end"} style={{fontSize: "1.2rem"}}>
                <DataBadge
                    name={followLists.length + " list" + (followLists.length !== 1 ? "s" : "")}
                    style={"primary"}/>
            </div>
        </h3>
        {followLists.length > 0 ?
            <ListBoard uid={uid} lists={followLists}
                       updateURL={"/api/edit/user"}/> :
            <p className={"text-muted"}>
                User follows no other lists
            </p>
        }
    </>
}

export async function getStaticPaths() {
    const users = await getUsers()
    const paths = users.map(u => {
        return {
            params: {
                id: u.uid.toString()
            }
        }
    })

    return {
        paths,
        fallback: "blocking"
    }
}

export async function getStaticProps({params}) {
    const user = await getUserWithLists(params.id)
    if (!user) {
        return {
            notFound: true,
            revalidate: 30
        }
    }
    return {
        props: {
            uid: params.id,
            user
        },
        revalidate: 30
    }
}
