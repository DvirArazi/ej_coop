<script lang="ts">
  import "/@src/css/global.css";
  import { SOCKET, initSocketIoClient } from "/@src/lib/client/socketIoClient";
  import Spacer from "../components/spacer.svelte";

  let isRegistered = false;

  console.log(2);
  initSocketIoClient(
    () => (isRegistered = true),
    () => (isRegistered = false)
  );
</script>

{#if !isRegistered}
  <Spacer space={50} />
  <div>{"Loading..."}</div>
{:else}
  <img src="/svgs/ccchaos.svg" alt="background" />
  <slot />
{/if}

<style>
  img {
    position: fixed;
    inset: 0;
    object-fit: fit;
    scale: 1.5;
    width: 100vw;
    height: 100vh;
    z-index: -1;

    /* transform-origin: 50% 50%; */
    /* scale: 2.5; */
    /* animation: rotate 80s linear infinite; */
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
