import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'
import { mainnet, arbitrum } from 'viem/chains'
import { watchAccount, watchNetwork } from '@wagmi/core'

const projectId = "b3dcf1ceae2662cf806ee06cfa46313b";

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });
const modal = createWeb3Modal({ wagmiConfig, projectId, chains })

type Store = {
  isConnected: boolean;
  network: string | undefined;
  address: string | undefined;
}

export default component$(() => {
  const state = useStore<Store>({
    isConnected: false,
    address: undefined,
    network: undefined,
  });

  const handleClick = $(() => modal.open());

  useVisibleTask$(() => {
    state.address = wagmiConfig.data?.account;
    state.isConnected = wagmiConfig.data?.account ? true : false;

    watchAccount((account) => {
      state.address = account.address;
      state.isConnected = account.isConnected;
    })

    watchNetwork((network) => {
      state.network = network.chain?.name;
    })
  });

  

  return (
    <div class="h-screen bg-black text-white">
      <button onClick$={handleClick} class="border-2">
        {state.isConnected ? "Disocnnect/ Change Network" : "Connect Wallet"}
      </button>
      <p>address: {state.address}</p>
      <p>network: {state.network}</p>
    </div>
  );
});