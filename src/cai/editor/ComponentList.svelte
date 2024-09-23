<script lang="ts">
  import { createEventDispatcher } from "svelte"
  export let components: any[]

  const dispatch = createEventDispatcher()
</script>


<div class="mx-3">
  {#each components as component}
    <div>
      <div class="bg-gray-200 p-1">
        <iconify-icon icon="{component.icon || "ic:home"}" />
        {component.name}
      </div>
      <ul class="ml-2">
        {#each component.items as item}
          <li class="my-1 p-1 cursor-pointer hover:bg-teal-100" on:click={_ => dispatch("click", item)}>
            <iconify-icon icon="{item.icon || "ic:home"}" />
            {item.name}
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</div>