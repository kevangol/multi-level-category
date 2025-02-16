import { useEffect, useState } from 'react'
import HttpService from './config/HttpService'
import { CATEGORY, PROFILE } from './config/ApiPath'
import { useNavigate } from 'react-router'


function Dashboard() {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(false)
    const [current, setCurrent] = useState(null)
    const [data, setData] = useState([])
    const [name, setName] = useState("")
    const [allowEditNameField, setAllowEditNameField] = useState(null)

    const fetchData = () => {
        setLoader(true)
        HttpService.get(CATEGORY)
            .then(r => {
                setData(r.data.data)
                setLoader(false)
            })
            .catch(e => {
                console.log(e.response.data.message)
                setLoader(false)
            })
    }

    const addData = () => {

        if (name !== "" || name !== null) {
            setLoader(true)
            HttpService.post(CATEGORY, {
                name: name
            }).then(() => {
                setName("")
                fetchData()
                setLoader(false)
            }).catch(e => {
                console.log(e.response.data.message)
                setLoader(false)
            })
        }
    }

    const deleteCategory = (id) => {
        if (window.confirm("Are you sure to delete this category?")) {
            setLoader(true)
            HttpService.delete(`${CATEGORY}/${id}`)
                .then(() => {
                    fetchData()
                    setLoader(false)
                }).catch(e => {
                    console.log(e.response.data.message)
                    setLoader(false)
                })
        }

    }

    const renameSubCategory = (id, name) => {
        setLoader(true)

        HttpService.put(`${CATEGORY}/${id}`, {
            name: name
        }).then(() => {
            fetchData()
            setAllowEditNameField(null)
            setLoader(false)
        }).catch(e => {
            console.log(e.response.data.message)
            setLoader(false)
        })
    }


    const assignSubCategory = (parent, id, isNull = false) => {
        setLoader(true)
        HttpService.put(`${CATEGORY}/${id}`, {
            parent: isNull ? null : parent
        }).then(() => {
            fetchData()
            setLoader(false)
        }).catch(e => {
            console.log(e.response.data.message)
            setLoader(false)
        })
    }

    const activeInactiveSubCategory = (isActive, id) => {
        setLoader(true)

        HttpService.put(`${CATEGORY}/${id}`, {
            isActive: isActive
        }).then(() => {
            fetchData()
            setLoader(false)

        }).catch(e => {
            console.log(e.response.data.message)
            setLoader(false)

        })
    }

    const logoutHandler = () => {
        setLoader(true)

        HttpService.post(`/auth/logout`).then(() => {

            setLoader(false)
            navigate("/login", { replace: true })
        }).catch(e => {
            console.log(e.response.data.message)
            setLoader(false)
        })
    }

    useEffect(() => {
        setTimeout(() => {

            HttpService.get(PROFILE).then(() => {
            }).catch(() => {
                navigate("/login", { replace: true })
            })
            fetchData()
        }, 1000)

    }, [])

    return (
        <>
            <h1>Multilevel Category Management -  <button onClick={() => logoutHandler()}>Logout</button></h1>
            <div>
                <input type='text' placeholder='Enter category name' value={name} onChange={e => setName(e.target.value)} />
                <button onClick={() => addData()}>Add</button>
            </div>
            <div style={{ padding: 10 }} />

            <>
                {loader ? "Loading...." :
                    <div>
                        {
                            data?.filter(i => i.parent === null).map(res =>
                                <div key={res._id} >
                                    <div>
                                        <small>This Category is {res.isActive ? "Active" : "Not Active"}</small>
                                        <input type='checkbox' checked={res.isActive} onChange={(e) => activeInactiveSubCategory(e.target.checked, res._id)} />
                                    </div>
                                    {
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                {
                                                    res.isActive && res.children.length > 0
                                                    &&
                                                    <img src='/expand.png' height={20} width={20} style={{ transform: res._id === current ? "rotate(90deg)" : "" }}
                                                        onClick={() => setCurrent(res._id === current ? null : res._id)} />
                                                }
                                                {
                                                    allowEditNameField === res._id ?
                                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                                            <small>Enter your edited name press Enter</small>
                                                            <input type='text' defaultValue={res.name} onKeyDown={(e) => {
                                                                if (e.code === "Enter") {
                                                                    renameSubCategory(res._id, e.target.value)
                                                                }
                                                            }} />
                                                        </div>
                                                        :
                                                        <h4 style={{ margin: 20, cursor: "pointer", width: "fit-content" }} onClick={() => setAllowEditNameField(allowEditNameField === res._id ? null : res._id)}>{res.name}</h4>
                                                }
                                                {
                                                    res.isActive &&
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <div>
                                                            {
                                                                data.filter(i => i.parent === null && i._id !== res._id).length > 0 &&
                                                                <select onChange={(e) => e.target.value !== "-" ? assignSubCategory(e.target.value, res._id) : ""}>
                                                                    <option value={"-"}>
                                                                        Select to Added in Parent Category
                                                                    </option>
                                                                    {
                                                                        data.filter(i => i.parent === null && i._id !== res._id).map(o => <option key={o._id} value={o._id}>{o.name}</option>)
                                                                    }
                                                                </select>
                                                            }
                                                        </div>
                                                        <div onClick={() => deleteCategory(res._id)} style={{ textDecoration: "underline", cursor: "pointer" }}>
                                                            <small>Delete</small>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            {
                                                res.isActive && res._id === current &&
                                                <div style={{ display: "flex", gap: 12 }}>
                                                    <div>

                                                        {
                                                            res.children.length > 0 &&
                                                            <div style={{ marginTop: 12 }}>
                                                                <ul>

                                                                    {
                                                                        res.children.map(i =>
                                                                            <li key={i._id} style={{ marginBottom: 12 }}>
                                                                                <small>{i.name}   <b style={{ textDecoration: "underline", cursor: "pointer", color: "red" }} onClick={() => assignSubCategory("", i._id, true)}>Unlink</b></small>
                                                                            </li>
                                                                        )
                                                                    }
                                                                </ul>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            )
                        }
                    </div>
                }
            </>
        </>
    )
}

export default Dashboard
