<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  export let onClick: () => void;
  export let enabled = true;

  let isDown = false;

  function onMouseUp() {
    isDown = false;
  }

  onMount(() => {
    window.addEventListener("mouseup", onMouseUp);
  });
  onDestroy(() => {
    window.removeEventListener("mouseup", onMouseUp);
  });
</script>

<button
  style={`
    padding-bottom: ${isDown ? 0 : 7}px;
    margin-top: ${isDown ? 7 : 0}px;
  `}
  on:mousedown={() => (isDown = true)}
  on:mouseup={onClick}
  disabled={!enabled}
>
  <div class="front">
    <slot />
  </div>
</button>

<style>
  button {
    background-color: rgb(0, 230, 115);
    border-radius: 10px;
    width: fit-content;
    margin: auto;
    padding: 0px;
    border: 0px;
    cursor: pointer;
  }
  .front {
    background-color: rgb(0, 255, 128);
    padding: 15px 25px;
    border-radius: 10px;
    font-family: "Rubik";
    font-size: 30px;
    font-weight: 900;
  }
</style>
