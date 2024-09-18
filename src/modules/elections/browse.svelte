<script lang="ts">
  let text = 'Initial content for Tab 2';
</script>

<div>
  <h2 class="text-xl font-semibold mb-4">Tab 2 Content</h2>
  <input
    type="text"
    class="border p-2 rounded"
    bind:value={text}
  />
  <p class="mt-4">Text: {text}</p>
</div>
