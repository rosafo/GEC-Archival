<script lang="ts">
  import { Slider, Checkbox, Text, List, type ListOpions } from "svelte-tweakpane-ui"

  export let value
  export let config
  export let folder = ""

  let ready = false

  $: {
    // set the default value
    if (!value) {
      value = {}
    }
    if (config?.fields) {
      for(let i = 0; i < config.fields.length; i++) {
        const field = config.fields[i]
        if (!value.hasOwnProperty(field.name)) {
          value[field.name] = field.default
        }
      }
    }
    ready = true
  }
</script>



<!-- Yo. This is the folder
<div>{JSON.stringify({config, value}, null, 2)}</div> -->
{#if config?.fields && ready}
  {#each config.fields as field}
    {#if field.type === "text"}
      <Text bind:value={value[field.name]} label={field.label} />
    {:else if field.type === "checkbox"}
      <Checkbox bind:value={value[field.name]} label={field.label} />
    {:else if field.type === "list"}
      <List bind:value={value[field.name]} label={field.label} options={field.options || []} />
    {:else}
      <div>Unknown type: {field.type}#{field.name}</div>
    {/if}
  {/each}
{/if}