<script>
export let onClick, clazz="";
</script>

<style>
.large {
    font-size: 24px;
    font-weight: bold;
    
}
</style>

<a href="/#" class={clazz} on:click={(e)=>{e.preventDefault(); onClick(e);}}><slot></slot></a>