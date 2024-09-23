<script lang="ts">
  import ComponentRenderer from "$cai/ComponentRenderer.svelte";
	import type { IParsedComponent } from "$cai/types";
  import type { Emitter } from "mitt"

  export let contextKey: symbol
  export let children: IParsedComponent[] = []
  export let classes: string = ""
  export let emitter: Emitter<any> | null
</script>



<div class="grid {classes}">
  {#each children || [] as child}
    <ComponentRenderer defn={child} {contextKey} {emitter}/>
  {/each}
</div>