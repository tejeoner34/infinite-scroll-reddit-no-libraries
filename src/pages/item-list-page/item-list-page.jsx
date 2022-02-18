import { useState, useEffect } from "react"
import Item from "../../components/item-component/item-component"
import './style.css'


export default function ItemListPage() {

    const [after, updateAfter] = useState('')
    const [itemsList, setItemsList] = useState([])
    const [documentHeight, setDocumentHeight] = useState(0)
    const [isLoading, setIsLoading] = useState(false)


    const setYHeight = () => {
        setDocumentHeight(window.scrollY)
    }

    useEffect(() => {
     
        window.addEventListener("scroll", setYHeight)

        if ((window.scrollY === 0 && documentHeight === 0) || (document.documentElement.offsetHeight === (window.scrollY + window.innerHeight) && !isLoading)) {

            setIsLoading(true)

            fetch(`https://www.reddit.com/r/aww.json?after=${after}`)
                .then(r => r.json())
                .then(d => {
                    updateAfter(d.data.after)
                    setItemsList(oldvalue => oldvalue.concat(d.data.children))
                    setIsLoading(false)
                })
        }

    }, [documentHeight])



    return (
        <div className="items-page">
            <div className="items-container">
                {
                    itemsList.map((e, index) => <Item key={index} data={e}></Item>)
                }
            </div>
            {
                isLoading?
                <h3 className="loading-message">Loading content...</h3>
                :
                null
            }
        </div>
    )
}