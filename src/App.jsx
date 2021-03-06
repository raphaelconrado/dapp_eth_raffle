import { useEffect, useState } from "react";
import ConnectButton from "./Connect";
import GridTicket from "./GridTicket";
import abi from "./contract/Raffle.json";
import { BigNumber, ethers, utils } from "ethers";
import _BN from "bn.js";
export default function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [totalTickets, setTotalTickets] = useState(0);
  const [soldedTickets, setSoldedTickets] = useState(null);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [ticket_price, setTicketPrice] = useState(null);
  const [raffleOwner, setRaffleOwner] = useState(null);
  const [totalPrize, setTotalPrize] = useState(null);
  const contractAddress = '0xF17031E12686F6042ec9dc96516Bb4deF8148064';
  const contractABI = abi.abi;

  const requestConnect = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setIsWalletConnected(true);
        setCustomerAddress(account);
        console.log("Account Connected: ", account);
      } else {
        setError("Please install a MetaMask wallet to use our bank.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getData = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const raffleContract = new ethers.Contract(contractAddress, contractABI, signer);

        let total = await raffleContract.totalTickets();
        setTotalTickets(parseInt(total));
        const totalPrize = await raffleContract.totalPrize();

        const price = await raffleContract.ticket_price();
        setTicketPrice(ethers.utils.formatUnits(price));
        
        setTotalPrize(ethers.utils.formatUnits(BigNumber.from(price).mul(BigNumber.from(total))));
        let soldedIten = [];
        for (let index = 0; index < total; index++) {
          let x = await raffleContract.raffle_ticket(index);
          if (x != "0x0000000000000000000000000000000000000000")
            soldedIten.push(index);
          console.log(x);
        }
        setSoldedTickets(soldedIten);
        let owner = await raffleContract.raffleOwner();
        setRaffleOwner(owner);


      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const buy = async (ticket) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);
        const txn = await bankContract.buyTicket(ticket, { value: ethers.utils.parseEther(ticket_price) });
        console.log("Buying ticket number " + ticket);
        await txn.wait();

        getData();
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const finishRaffle = async (ticket) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);
        const txn = await bankContract.setWinner();
        await txn.wait();
      } else {
        console.log("Ethereum object not found, install Metamask.");
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (isWalletConnected)
      getData();
  }, [isWalletConnected])

  return <div className="container">
    {/* Se n??o estiver connectado, chamar bot??o de connect. */}
    {!isWalletConnected && <ConnectButton requestConnect={requestConnect}></ConnectButton>}
    {isWalletConnected && <h2>Prize: {totalPrize}</h2>}
    {isWalletConnected && <GridTicket currentPrice={ticket_price} totalTickets={totalTickets} buyFunction={buy} soldedTickets={soldedTickets}></GridTicket>}

    {raffleOwner && raffleOwner.toLowerCase() == customerAddress.toLowerCase() && <div><button className="btn btn-primary float-end mt-4" onClick={() => finishRaffle()}>Finish raffle</button></div>}
  </div>;


}

