import { $, component$, useSignal } from '@builder.io/qwik';
import { ERC20_ABI, SWAPPER_ABI, SWAP_ADDRESS, UNI, WETH } from '~/utils/contract';
import { prepareWriteContract, readContract, waitForTransaction, writeContract } from '@wagmi/core'
import { parseUnits } from 'viem';

export const Swap = component$(() => {
  const amountInput = useSignal("0");

  const swap = $(async () => {
      const amount = amountInput.value

      if (+amount <= 0) throw new Error('Invalid amount')

      const tokenFromDecimals = await readContract({
        address: WETH,
        abi: ERC20_ABI,
        functionName: 'decimals',
      }) as number;

      const parsedAmount = parseUnits(amount.toString(), tokenFromDecimals)

      const approveWETH = await prepareWriteContract({
        address: WETH,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [SWAP_ADDRESS, parsedAmount],
      })

      const approveTx = await writeContract(approveWETH.request);

      await waitForTransaction({ hash: approveTx.hash })

      const swap = await prepareWriteContract({
        address: SWAP_ADDRESS,
        abi: SWAPPER_ABI,
        functionName: 'swap',
        args: [WETH, UNI, parsedAmount],
      })

      const swapTx = await writeContract(swap.request)

      await waitForTransaction({ hash: swapTx.hash })
      console.log("swapped")
  });

  return (
    <div class="justify-center mx-auto pt-20">
      <p>Input weth value to swap for uni</p>
      <input type="number" name="weth" bind:value={amountInput} class="text-black" />
      <button onClick$={swap} class="ml-10 bg-blue-600">SWAP</button>
    </div>
  );
});