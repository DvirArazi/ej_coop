<script lang="ts">
  import { onMount } from "svelte";
  import "/@src/css/global.css";
  import { initSocketIoClient } from "/@src/lib/client/socketIoClient";

  let ready = false;

  async function init() {
    await initSocketIoClient();
    ready = true;
  }
  init();

  onMount(() => {
    // window.addEventListener("scroll", function () {
    //   var scrollTop =
    //     document.documentElement.scrollTop || document.body.scrollTop;
    //   if (scrollTop > 0) {
    //     document.documentElement.style.backgroundPosition =
    //       "center " + -scrollTop + "px";
    //   } else {
    //     document.documentElement.style.backgroundPosition = "center center";
    //   }
    // });
  });
</script>

{#if ready}
  <slot />
{/if}