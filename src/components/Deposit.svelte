<script>
import { onMount } from "svelte";
import { createRandomDeposit, checkContractState, toHex, createNote, sendTokenApproval, lamnadoDeposit } from '../js/lamnado'
import { derived, writable } from "svelte/store";
import { lamdenNetwork } from "../stores/globalStores";
import Container from "./util/Container.svelte";
import Button from "./util/Button.svelte";
import Errors from "./util/Errors.svelte";
import BN from 'bignumber.js';
import { lamden_vk } from "../stores/lamdenStores";


const tokens = ['PHI', 'TAU']
const denominations = {
    PHI: ['1000'],//, '10000', '100000', '1000000'],
    TAU: ['1000']//, '1000', '10000', '100000'],
}
const symbols = {
    PHI: 'phi',
    TAU: 'currency',
}
const lamnadoContracts = {
    PHI: {
        '1000': 'con_lamnado_phi_1000_v1'
    },
    TAU: {
        '100': 'con_lamnado_currency_1000_v1'
    }
}
const tokenContracts = {
    PHI: 'con_phi_lst001',
    TAU: 'currency',
}


const token = writable(tokens[0])
const amount = writable(denominations[tokens[0]][0])
const deposit = writable(null)
const note = derived([amount, token, deposit], ([$amount, $token, $deposit]) => {
    if ($deposit === null) {
        return null;
    }
    return createNote($amount, symbols[$token], $deposit)
})

const denomination = derived([token, amount], async ([$token, $amount], set) => {
    if ($token === null || $amount === null) {
        set(null)
        return;
    }
    const contract = lamnadoContracts[$token][$amount.toString()]
    if (!contract) {
        set(null);
        return;
    }
    const d = await checkContractState(contract, 'denomination', [], null)
    console.log(d);
    set(d)
    return;
})

const totalDepositBalance = derived([token, amount], async ([$token, $amount], set) => {
    if ($token === null || $amount === null) {
        set(null)
        return;
    }
    const contract = lamnadoContracts[$token][$amount.toString()]
    if (!contract) {
        set(null);
        return;
    }
    const d = await checkContractState(contract, 'total_deposit_balance', [], 0)
    console.log(d);
    set(d)
    return;
})

const numDepositsInPool = derived([denomination, totalDepositBalance], ([$denomination, $totalDepositBalance]) => {
    if ($denomination === null || $totalDepositBalance === null) {
        return null;
    }
    try {
        return parseInt($totalDepositBalance.toString(), 10) / parseInt($denomination.toString(), 10);
    } catch(e) {
        return null;
    }
})


const downloaded = new writable(false);

onMount(() => {
    downloaded.set(false)
    deposit.set(createRandomDeposit())
    return () => {
        deposit.set(null)
        downloaded.set(false)
    }
});


const downloadNote = () => {
    const url = window.URL.createObjectURL(new Blob([$note]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lamnado-note-${Math.floor(Date.now() / 1000)}.txt`);
    document.body.appendChild(link);
    link.click();
    downloaded.set(true);
}
    

const depositHandler = writable({});
const depositApprovalHandler = writable({});
const depositErrors = writable([]);
const depositInProgress = writable(false);
const depositFunc = async () => {
    depositInProgress.set(true);
    depositErrors.set([]);
    // check if needs approval
    const tokenContract = tokenContracts[$token];
    const lamnadoContract = lamnadoContracts[$token][$amount.toString()];
    const approved = BN(await checkContractState(tokenContract, 'balances', [$lamden_vk, lamnadoContract], 0))
    console.log("Approved: "+approved.toString())
    const f = () => {
        lamnadoDeposit($amount, symbols[$token], $deposit, depositHandler, (txResults)=>{
            depositInProgress.set(false);
            if ($depositHandler.errors?.length > 0) {
                depositErrors.set($depositHandler.errors)
            } else {
                console.log("Success");
                console.log(txResults);
            }
        });
    };
    if (BN($amount).comparedTo(approved) === 1) {
        // requires approval
        sendTokenApproval(BN($amount), tokenContract, lamnadoContract, depositApprovalHandler, (txResults)=>{
            if ($depositApprovalHandler.errors?.length > 0) {
                depositInProgress.set(false);
                depositErrors.set($depositApprovalHandler.errors)
            } else {
                f()
            }
        })
    } else {
        f()
    }
}

</script>

<style>
.note {
    overflow-wrap: anywhere;
}

</style>

<h2>Deposit</h2>


<Container>
    <p>Token</p>
    {#each tokens as t}
        <label>
            <input 
            type="radio"
            name="token"
            checked={$token === t}
            on:click={()=>token.set(t)}
            />
            {t}
        </label>
    {/each}
    <br /><br />
    <p>Amount</p>
    {#each denominations[$token] as t}
        <label>
            <input 
            type="radio"
            name="denomination"
            checked={$amount === t}
            on:click={()=>amount.set(t)}
            />
            {t}
        </label>
    {/each}
    <br /><br />
    <p>Deposits in Pool: {$numDepositsInPool === null ? "(Loading...)" : $numDepositsInPool.toString()}</p>
    <br />
    <p>Your Note</p>
    <div class="note">
        {#if $note !== null}
            {$note.substring(0, 20)}...{$note.substring($note.length-20)}
        {/if}
    </div>
    <br /><br />
    {#if $lamden_vk === null} 
        <p>Connect Your Wallet</p>
    {:else}
        <Button
            text={"Download Note"}
            clicked={downloadNote}
        /><br /><br />
        <Errors errors={depositErrors} />
        <Button
            text={$depositInProgress ? "Depositing..." : "Deposit"}
            clicked={depositFunc}
            disabled={$depositInProgress || !$downloaded}
        />
    {/if}
    <br /><br />
</Container>
