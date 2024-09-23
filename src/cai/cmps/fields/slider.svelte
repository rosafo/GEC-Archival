<script lang="ts">
  import ComponentRenderer from "$cai/ComponentRenderer.svelte";
	import type { IParsedComponent } from "$cai/types";

  export let contextKey: symbol
  export let children: IParsedComponent[] = []
</script>



slider here
{#each children || [] as child}
  <ComponentRenderer defn={child} {contextKey}/>
{/each}