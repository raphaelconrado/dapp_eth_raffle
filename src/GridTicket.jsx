import { useEffect, useState } from "react"


function TicketItem(ticketNumer, buyFunction, solded) {
    return <div className="card col-sm-2 rounded-3" key={ticketNumer} style={{ "marginLeft": "2rem", "marginBottom": "1rem" }}>
        <div className="card-body">
            <p className="card-title"><span className="card-title-1">Number</span><br></br><span className="card-title-2">{ticketNumer}</span></p>
            <p className={"card-text " + (solded && "solded")}>
                {!solded &&
                    <button className="btn btnTicket btn-primary" onClick={() => buyFunction(ticketNumer)}>Buy</button>}
            </p>
        </div>
    </div>
}

export default function GridTicket(props) {

    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        setTickets(
            [...Array(props.totalTickets).keys()].
                map(c => TicketItem(c + 1, props.buyFunction, props.soldedTickets && props.soldedTickets.some(x => x == c + 1)))
        );
    }, [props.totalTickets, props.currentPrice, props.soldedTickets])

    return <div className="gridticket d-flex flex-column mt-3 rounded-3 ">
        <div className="d-flex justify-content-center mt-2">
            <h3>Choose your ticket</h3>
        </div>
        <div className="container  overflow-auto gridticketItems">

            <div className="row p-2">
                {tickets}
            </div>
        </div></div >
}