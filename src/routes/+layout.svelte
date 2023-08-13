<script lang="ts">
  import { initSocketIoClient } from "src/lib/client/socketIoClient";
  import { onMount } from "svelte";

  // onMount(() => {
    initSocketIoClient();
  // });
</script>

<slot />
