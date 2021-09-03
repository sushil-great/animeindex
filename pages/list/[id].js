import {siteName} from "../../components/layout/Layout"
import Head from "next/head"
import Link from "next/link"
import {useSession} from "next-auth/client"
import {canEdit, isCurrentUser} from "../../lib/session"
import IconEdit from "../../components/icons/IconEdit"
import DataBadge from "../../components/data/DataBadge"
import ItemBoard from "../../components/boards/ItemBoard"
import useSWR from "swr"
import Error from "../_error"
import {getList, getLists} from "../../lib/db/lists"
import {getUser} from "../../lib/db/users"

export default function List({_id, list: staticList, owner: staticOwner, ownerUid}) {
    const [session] = useSession()
    let {data: list, errorList} = useSWR("/api/list/" + _id)
    let {data: owner, errorOwner} = useSWR("/api/user/" + ownerUid)

    if (errorList) {
        return <Error error={errorList} statusCode={errorList.status}/>
    } else if (errorOwner) {
        return <Error error={errorOwner} statusCode={errorOwner.status}/>
    }
    list = list || staticList
    owner = owner || staticOwner

    return <>
        <Head>
            <title>
                {list.name + " | " + siteName}
            </title>
            <meta name="description" content={list.description}/>
        </Head>

        <div className={"card bg-2 mb-3"}>
            <div className="card-body">
                <div className={"card-title"}>
                    <h3>
                        {list.name} <small>by</small> <Link href={"/user/" + owner.uid}>
                        <a className={"text-muted"}>
                            {owner.name}
                        </a>
                    </Link>
                        <span style={{fontSize: "1.2rem"}}>
                            <div className={"float-end"}>
                                {list.nsfw ? <DataBadge data={false} name={"NSFW"}/> : <></>}
                                {canEdit(session) ? <Link href={"/edit/list/" + list._id}>
                                    <a title={"Edit table"} className={"ms-2"}>
                                        <IconEdit/>
                                    </a>
                                </Link> : <></>}
                            </div>
                        </span>
                    </h3>
                </div>
                <p className={"card-text"} style={{
                    whiteSpace: "pre-line"
                }}>
                    {list.description}
                </p>
            </div>
        </div>
        <ItemBoard _id={list._id} items={list.items} columns={list.columns} key={list._id} canMove={true}
                   updateURL={"/api/edit/list"} canEdit={isCurrentUser(session, list.owner)}/>
    </>
}

export async function getStaticPaths() {
    const lists = await getLists()
    const paths = lists.map(list => {
        return {
            params: {
                id: list._id
            }
        }
    })

    return {
        paths,
        fallback: "blocking"
    }
}

export async function getStaticProps({params}) {
    const list = await getList(params.id)
    if (!list) {
        return {
            notFound: true,
            revalidate: 10
        }
    }
    const owner = await getUser(list.owner)

    return {
        props: {
            _id: list._id,
            list,
            owner,
            ownerUid: owner.uid
        },
        revalidate: 10
    }
}