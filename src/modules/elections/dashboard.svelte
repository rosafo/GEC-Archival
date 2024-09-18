<script lang="ts">
  let count = 0;
</script>

<div>
  <h2 class="text-xl font-semibold mb-4">Tab 1 Content</h2>
  <button
    class="bg-blue-500 text-white py-2 px-4 rounded"
    on:click={() => count++}
  >
    Clicked {count} times
  </button>
</div>
