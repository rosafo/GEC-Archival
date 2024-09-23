<script context="module" lang="ts">
  export let maxDepth = 15
</script>

<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dragHandleZone, dragHandle } from "./handle";
  import { ulid } from "ulid"
	
	// export let nodes
	export let node: IComponent
  export let selectedItem
  // export let depth = 0

  // $: childDepth = depth + 1
  $: isTemp = node?.id && node.id.startsWith("id:dnd-shadow")
	
	const flipDurationMs = 300;
	function handleDndConsider(e) {
		node.children = e.detail.items;
	}
	function handleDndFinalize(e) {
		node.children = e.detail.items;
    node = node
		// nodes = {...nodes};
	}

  // set the items
  $: {
    if (node) {
      if (!node.id) node.id = ulid()
      if (node.children) {
        node.children.forEach(x => {
          if (!x.id) x.id = ulid()
        })
      }
    }
  }
</script>

<div class="border hover:border-dashed hover:border-blue-400 cursor-pointer p-2" class:bg-blue-400={selectedItem?.id === node?.id} on:click|preventDefault|stopPropagation={_ => selectedItem = selectedItem?.id == node?.id ? null : node}>
  <b style="color:{node?.color}">{node?.name || node?.type}</b> 
  {#if node?.props?.name}
    #<b style="color:{node?.color}">{node.props.name}</b> 
  {/if}
  {#if node?.hasOwnProperty("children") && !isTemp}
    <section class="p-2 pb-4 xbg-orange-400" use:dragHandleZone={{items:node.children, flipDurationMs, morphDisabled:true}} 
      class:pb-6={!node.children.length}  class:bg-slate-200={!node.children.length}
            on:consider={handleDndConsider} 
            on:finalize={handleDndFinalize}>		
      {#each node.children as item(item.id)}
        <div animate:flip="{{duration: flipDurationMs}}" class="item relative bg-slate-300/30 hover:bg-slate-300/75">
          <div class="handle bg-slate-500/50 cursor-move" aria-label="drag-handle" use:dragHandle></div>
          <svelte:self node={item} bind:selectedItem/>
        </div>
      {/each}
    </section>
  {/if}
</div>


<style>
	sectionx {
		max-width: 400px;
		border: 0px solid black;
		padding: 0.4em;
		background-color: rgba(100, 100, 100, 0.1); 
	}
	divx {
		width: 90%;
		padding: 0.3em;
		border: 0px solid blue;
		margin: 0.15em 0;
	}
	.xitem{
		position: relative;
		background-color: rgba(00, 100, 100, 0.1);
	}
	.handle {
		position: absolute;
    right: 0;
		top: 0;
    width: 1em;
    height: 0.5em;
	}
</style>