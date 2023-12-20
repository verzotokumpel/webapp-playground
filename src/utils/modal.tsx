import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'
import { mainnet, arbitrum, sepolia, goerli } from 'viem/chains'

const projectId = "b3dcf1ceae2662cf806ee06cfa46313b";

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum, sepolia, goerli];

export const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });
export const modal = createWeb3Modal({ wagmiConfig, projectId, chains })