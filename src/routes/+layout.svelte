<script lang="ts">
  import "/@src/css/global.css";
  import { initSocketIoClient } from "/@src/lib/client/socketIoClient";

  let ready = false;

  async function init() {
    await initSocketIoClient();
    ready = true;
  }
  init();
</script>

{#if ready}
  <slot />
{/if}
