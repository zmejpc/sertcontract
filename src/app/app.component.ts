import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers, utils } from "ethers";
import abi from "../contracts/SertContract.json";

declare global {
  interface Window{
    ethereum?: MetaMaskInpageProvider
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  contractAddress = '0x8afD11cf6e9a4561e6Ec40BBdb82F696da067eCE';

	isWalletConnected = false;

	title = 'sertcontract';

	contractABI = abi.abi;

	customerAddress = '';

	contractBalance = '';

	walletAddress = '';
	
	sertName = '';

	balance = '';

	error = '';

  ngOnInit(): void {
  	this.checkIfWalletIsConnected();
  	this.getContractBalance();
  	this.getBalance();
  	this.getName();
  }

  deposit = new FormControl('');

  withdraw = new FormControl('');

  contractName = new FormControl('');

	checkIfWalletIsConnected = async () => {
	  try {
	    if (window.ethereum) {
	      const accounts:any = await window.ethereum.request({ method: 'eth_requestAccounts' });
	      const account = accounts[0];
	      this.isWalletConnected = true;
	      this.customerAddress = account;
	      console.log("Account Connected: ", account);
	    } else {
	      this.error = 'Please install a MetaMask wallet to use this dApp.';
	    }
	  } catch (error) {
	    this.error = error;
	  }
	}

	getName = async () => {
		try {
	    if (window.ethereum) {
	      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	      const signer = provider.getSigner();
	      const contract = new ethers.Contract(this.contractAddress, this.contractABI, signer);

	      let sertName = await contract.name();
	      sertName = sertName.toString();
	      this.sertName = sertName;
	      this.contractName.setValue(sertName);
	    } else {
	      console.log("Ethereum object not found, install Metamask.");
	      this.error = 'Please install a MetaMask wallet to use this dApp.';
	    }
	  } catch (error) {
	    this.error = error;
	  }
	}

	setName = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(this.contractAddress, this.contractABI, signer);

        const txn = await contract.setName(this.contractName.value);
        console.log("Setting Contract Name...");
        await txn.wait();
        console.log("Contract Name Changed", txn.hash);
        await this.getName();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        this.error = 'Please install a MetaMask wallet to use our bank.';
      }
    } catch (error) {
      this.error = error
    }
  }

  getBalance = async () => {
		try {
	    if (window.ethereum) {
	      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	      const signer = provider.getSigner();
	      const contract = new ethers.Contract(this.contractAddress, this.contractABI, signer);

	      let balance = await contract.getBalance();
	      balance = utils.formatEther(balance);
	      this.balance = balance;

	    } else {
	      console.log("Ethereum object not found, install Metamask.");
	      this.error = 'Please install a MetaMask wallet to use this dApp.';
	    }
	  } catch (error) {
	    this.error = error;
	  }
	}

	getContractBalance = async () => {
		try {
	    if (window.ethereum) {
	      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
	      const signer = provider.getSigner();
	      const contract = new ethers.Contract(this.contractAddress, this.contractABI, signer);

	      let contractBalance = await contract.getContractBalance();
	      contractBalance = utils.formatEther(contractBalance);
	      this.contractBalance = contractBalance;

	    } else {
	      console.log("Ethereum object not found, install Metamask.");
	      this.error = 'Please install a MetaMask wallet to use this dApp.';
	    }
	  } catch (error) {
	    this.error = error;
	  }
	}

	depositAction = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(this.contractAddress, this.contractABI, signer);

        const txn = await contract.deposit({ value: ethers.utils.parseEther(this.deposit.value) });
        console.log("Deposting money...");
        await txn.wait();
        console.log("Deposited money...done", txn.hash);

        this.getBalance();
        this.getContractBalance();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        this.error = 'Please install a MetaMask wallet to use our bank.';
      }
    } catch (error) {
      this.error = error
    }
  }

  withdrawAction = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(this.contractAddress, this.contractABI, signer);

        let myAddress = await signer.getAddress()
        console.log("provider signer...", myAddress);

        const txn = await contract.transfer(myAddress, ethers.utils.parseEther(this.withdraw.value));
        console.log("Withdrawing money...");
        await txn.wait();
        console.log("Money with drew...done", txn.hash);

        this.getBalance();
        this.getContractBalance();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        this.error = 'Please install a MetaMask wallet to use our bank.';
      }
    } catch (error) {
      this.error = error
    }
  }
}
