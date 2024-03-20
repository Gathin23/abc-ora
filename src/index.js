import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'

const projectId = 'e348b0095cc0aeb957d0376cd345b4e7'

// 2. Set chains
const testnet = {
  chainId: 11155111,
  name: 'Sepolia Testnet',
  currency: 'SepoliaETH',
  explorerUrl: 'https://sepolia.etherscan.io/',
  rpcUrl: 'https://1rpc.io/sepolia'
}

// 3. Create modal
const metadata = {
  name: 'ABCORA',
  description: 'My Website description',
  url: 'http://localhost:3000/', 
  icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [testnet],
  projectId,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})






const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
