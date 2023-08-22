<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  export let onClick: () => void;
  export let isEnabled = true;
  export let isPositive = true;

  let isDown = false;

  function onMouseUp() {
    isDown = false;
  }

  onMount(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchend", onMouseUp);
  });
  onDestroy(() => {
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("touchend", onMouseUp);
  });
</script>

<div>
  <button
    style={`
    padding-bottom: ${isDown ? 0 : 7}px;
    margin-top: ${isDown ? 7 : 0}px;
    --color0: ${isPositive ? "#00e673" : "#FF0000"};
    --color1: ${isPositive ? "#00ff80" : "#FF4D4D"};
  `}
    on:mousedown={() => (isDown = true)}
    on:mouseup={onClick}
    on:touchstart={() => {
      if (isEnabled) isDown = true;
    }}
    on:touchend|self={() => {
      if (isEnabled) onClick();
    }}
    disabled={!isEnabled}
  >
    <div class="front">
      <slot />
    </div>
  </button>
</div>

<style>
  button {
    background-color: var(--color0);
    border-radius: 10px;
    width: fit-content;
    margin: auto;
    padding: 0px;
    border: 0px;
    cursor: pointer;
    outline: none;
  }
  .front {
    background-color: var(--color1);
    padding: 15px 25px;
    border-radius: 10px;
    font-family: "Rubik";
    font-size: 24px;
    font-weight: 900;
  }
</style>
