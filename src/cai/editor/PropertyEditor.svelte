<script lang="ts">
  import { Button, Slider, Monitor, Pane, Text, Element } from "svelte-tweakpane-ui"
  import PropertyPage from "./PropertyPage.svelte"

  export let value
  export let config

  if (!value.classes) {
    value.classes = ""
  }
</script>


<Pane>
  <PropertyPage bind:value bind:config />
</Pane>