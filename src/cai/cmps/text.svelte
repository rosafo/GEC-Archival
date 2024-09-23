<script lang="ts">
  import ComponentRenderer from "$cai/ComponentRenderer.svelte";
	import type { IParsedComponent } from "$cai/types";
  import type { Emitter } from "mitt"

  export let emitter: Emitter<any> | null
  export let contextKey: symbol
  export let children: IParsedComponent[] = []
  export let value: string = ""
  export let classes = ""
  // console.log("props", $$props)
</script>



<div class="{classes}">
  {value}
</div>
{#each children || [] as child}
  <ComponentRenderer defn={child} {contextKey} {emitter}/>
{/each}