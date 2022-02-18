import { useState, useEffect, useRef } from "react"
import Item from "../../components/item-component/item-component"
import './style.css'

export default function ItemListPage() {

    let after = useRef('')
    const [itemsList, setItemsList] = useState([])
    const [documentHeight, setDocumentHeight] = useState(0)
    const [isLoading, setIsLoading] = useState(false)


    // this function will update the documentHeight and will be used as the parameter function for the scroll event
    const setYHeight = () => {
        setDocumentHeight(window.scrollY)
    }

    useEffect(() => {
            setIsLoading(true)
            fetch(`https://www.reddit.com/r/aww.json?after=${after.current}`)
                .then(r => r.json())
                .then(d => {
                    after.current = d.data.after
                    setItemsList(oldvalue => oldvalue.concat(d.data.children))
                    setIsLoading(false)
                })
    }, [])

    useEffect(()=>{
        // everytime we scroll we will fire the setYHeight function. This will update docuemntHeight and fire the useEffect
        window.addEventListener("scroll", setYHeight)
        if ((document.documentElement.offsetHeight === (Math.trunc(window.scrollY + window.innerHeight)) && !isLoading)) {
            setIsLoading(true)
            fetch(`https://www.reddit.com/r/aww.json?after=${after.current}`)
                .then(r => r.json())
                .then(d => {
                    after.current = d.data.after
                    setItemsList(oldvalue => oldvalue.concat(d.data.children))
                    setIsLoading(false)
                })
        }
    },[documentHeight, isLoading])
    

    return (
        <div className="items-page">
            <div className="items-container">
                {
                    itemsList.map((e, index) => <Item key={index} data={e}></Item>)
                }
            </div>
            {
                isLoading ?
                    <h3 className="loading-message">Loading content...</h3>
                    :
                    null
            }
        </div>
    )
}