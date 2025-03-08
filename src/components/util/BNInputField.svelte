
<script>
// Misc
import BN from 'bignumber.js'
import { stringToFixed, determinePrecision } from '../../js/global-utils'

export let startingValue = BN(0);
export let labelText = "";
export let labelClass = "label";
export let inputClass = "primaryInput";
export let precision = 8;
export let onInputChange;

// DOM ELEMENT BINDINGS
let inputElm;
const handleInputChange = (e) => {
    let validateValue = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
    if (validateValue !== e.target.value) {
        inputElm.value = validateValue
    }else{
        let value = new BN(e.target.value)
        if (determinePrecision(value) > precision){
            value = new BN(stringToFixed(value, precision))
            inputElm.value = stringToFixed(value, precision)
        }
    }
    //console.log(inputElm.value);
    onInputChange(inputElm.value)
}
</script>

<style>
    .primaryInput {
        margin-top: 1rem;
        text-align: center;
    }
    label {
        overflow-wrap: break-word;
    }
</style>

<label class={labelClass}>{labelText}<br/>
    <input class={inputClass}
        bind:this={inputElm}
        on:input={handleInputChange}
        on:change={handleInputChange}
        value={startingValue}
        readonly={false}
    />
</label>