<script>
import { onMount } from "svelte";
import { DEFAULT_RELAYER_URL, lamnadoWithdraw } from '../js/lamnado'
import { derived, writable } from "svelte/store";
import Container from "./util/Container.svelte";
import Button from "./util/Button.svelte";
import Errors from "./util/Errors.svelte";
import Input from "./util/Input.svelte";

const note = writable('')
const recipient = writable('')
const relayerUrl = writable(DEFAULT_RELAYER_URL)

const withdrawHandler = writable({});
const withdrawErrors = writable([]);
const withdrawInProgress = writable(false);
const withdrawFunc = async () => {
    // add_chips_to_game
    withdrawInProgress.set(true);
    withdrawErrors.set([]);
    lamnadoWithdraw($note, $recipient, $relayerUrl).then((txResults)=>{
        withdrawInProgress.set(false);
        if ($withdrawHandler.errors?.length > 0) {
            withdrawErrors.set($withdrawHandler.errors)
        } else {
            console.log("Success");
            console.log(txResults);
        }
    }).catch((err)=>{
        console.log(err)
        alert('Unable to withdraw.')
        withdrawInProgress.set(false);
    })
}

</script>

<style>

</style>

<h2>Withdraw</h2>


<Container>
    <Input 
        value={$recipient} 
        label={"Recipient"}
        onClick={recipient.set}
    />
    <br /><br />
    <p>Your Note</p>
    <textarea 
        value={$note}
        on:change={(e)=>note.set(e.target.value)}
        on:input={(e)=>note.set(e.target.value)}
        rows={4}
    ></textarea>
    <br /><br />
    <Errors errors={withdrawErrors} />
    <Button
        text={$withdrawInProgress ? "Withdrawing..." : "Withdraw"}
        clicked={withdrawFunc}
        disabled={$withdrawInProgress || $note===null || $note.length===0 || $recipient.length === 0}
    />
    <br /><br />
</Container>
    