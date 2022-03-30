import React from 'react';
import './App.css';
import Web3 from 'web3'

;(async function() {
	await window.ethereum.enable()
	window.w3 = new Web3(window.ethereum)
})();

const ABI =[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "totalTicket",
				"type": "uint256"
			},
			{
				"internalType": "contract IStdReference",
				"name": "_ref",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "buyTicket",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRemainingTickets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTicketPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "price1",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "price2",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "remainingTickets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ticketCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "transfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
class App extends React.Component {
	state = {
		address:'',
		remaining:'',
		ticketCount:''
	}

	async componentDidMount() {
		await window.ethereum.enable()
		this.w3 = new Web3(window.ethereum)
		const address = (await this.w3.eth.getAccounts())[0]
		this.setState({ address })

		this.contract = new this.w3.eth.Contract(ABI,"0xf825a3965C6c97717E10f4d518CDef440A3396BD")
		
		const remaining = await this.contract.methods.remainingTickets().call()
		this.setState({ remaining })

		const ticketCount = await this.contract.methods.ticketCount(address).call()
		this.setState({ ticketCount })

		const getTicketPrice = await this.contract.methods.getTicketPrice().call()
		//alert(getTicketPrice);
		this.setState({ getTicketPrice })

		
	}

	async buyTicket(){

		const ticketPrice = await this.contract.methods.
			getTicketPrice().call({ value: '1000000000'})

		await this.contract.methods.
			buyTicket().send({
				from: this.state.address,
				value: ticketPrice,		
			})
	}

	onChange(e){
		this.setState({
			receiver: e.target.value,
		})
	}

	async transfer(){
		await this.contract.methods.transfer(this.state.receiver).send({
			from: this.state.address
		})
	}

	render() {
		return (
		<div className = "App">
			<p>Your Address: {this.state.address}</p>
			<p>Ticket Contract: 0x3ab36b1FbDB6dDD4294Df4B1BA79e2D839C5a646}</p>
			<p>Remaining Ticket Count: {this.state.remaining}</p>
			<p>Your Ticket Count: {this.state.ticketCount}</p>
			<button onClick={this.buyTicket.bind(this)}>Buy a Ticket</button>
			<div>
				<input placeholder="receiver" onChange={this.onChange.bind(this)} />
				<button onClick={this.transfer.bind(this)}>Transfer a Ticket</button>
			</div>
		</div>
	);
     }	
}

export default App;
