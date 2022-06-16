import metamask from './metamask.svg';
export default function ConnectButton(props) {

   
    return <div className='d-flex'>
        <button className="btn btn-light position-absolute top-50 start-50 translate-middle d-flex flex-row justify-content-center"
        onClick={()=> props.requestConnect()}>
            <img src={metamask} alt="metamask logo" className='metamaskLogo'></img>
            <p style={{ "marginTop": "0.7rem" }}>Connect your wallet</p>
        </button>
    </div >

}