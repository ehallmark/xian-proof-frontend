<script>
import Container from "./Container.svelte";
export let errors;
</script>


<Container>
{#if $errors !== null}
    {#each $errors as error}
        <div class="error">
            {error}
        </div>
    {/each}
{/if}
</Container>
