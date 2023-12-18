import { component$, useStore, $ } from '@builder.io/qwik';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'
import { mainnet, arbitrum } from 'viem/chains'
import { getAccount } from '@wagmi/core'
const projectId = "test";

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
const modal = createWeb3Modal({ wagmiConfig, projectId, chains })

export default component$(() => {
  const account = getAccount();
  const state = useStore({
    isConnected: account.isConnected,
    address: '',
  });
  
  const handleClick = $(
    () => {
      const account = getAccount();
      modal.open();
      state.address = account.address ?? '';
      state.isConnected = account.isConnected;
    }
  );

  return (
    <div class="h-screen bg-black text-white">
      <button onClick$={handleClick} class="border-2">
        {state.isConnected ? "Disocnnect" : "Connect Wallet"}
      </button>
      <p>address: {state.address}</p>
    </div>
  );
});