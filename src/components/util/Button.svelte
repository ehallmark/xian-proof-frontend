
<script lang='ts'>
    export let text: string;
    export let clicked: any;
    export let disabled = false;
 </script>


<button disabled={disabled} type="submit" on:click={clicked}>
  <span class="button-text">
      {text}
  </span>
</button>


<style>

</style>

