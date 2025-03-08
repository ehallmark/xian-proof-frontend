<script>
export let onClick, type="text", autoComplete="", value="", clazz="", onEnterButton=null, label=null;
const submitOnEnter = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
        if (onEnterButton !== null) {
            e.preventDefault();
            e.stopPropagation();
            onEnterButton(e.target.value);
        }
    }
}
</script>

<style>
    .message-input {
        width: 80%;
        margin: auto;
    }
</style>

{#if label === null}
<input
type={type}
autoComplete={autoComplete}
value={value}
class={clazz}
on:change={(e) => onClick(e.target.value)}
on:input={(e) => onClick(e.target.value)}
/>
{:else}
<label>
    {label}
    <br/>
    <input
    class={clazz}
    type={type}
    autoComplete={autoComplete}
    value={value}
    on:change={(e) => onClick(e.target.value)}
    on:input={(e) => onClick(e.target.value)}
    on:keydown={submitOnEnter}
    />
</label>
{/if}