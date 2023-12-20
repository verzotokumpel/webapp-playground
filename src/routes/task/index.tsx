import { component$, useStore, $, useVisibleTask$ } from '@builder.io/qwik';
import { watchAccount, watchNetwork } from '@wagmi/core'
import { modal, wagmiConfig } from '~/utils/modal';
import { Swap } from '~/components/swap';

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
    <div class="h-screen bg-black text-white text-center">
      <div class="py-20">
        <button onClick$={handleClick} class="border-2 rounded-full py-2 px-2 mb-10">
          {state.isConnected ? "Disocnnect/ Change Network" : "Connect Wallet"}
        </button>
        <p>address: {state.address}</p>
        <p>network: {state.network}</p>
        {state.network == "Goerli" ?
            <Swap />
          :
            <p class="pt-10 text-sm opacity-80">Swap only on Goerli Network</p>
        }
      </div>
    </div>
  );
});