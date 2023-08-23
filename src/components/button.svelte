<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  export let onClick: () => void;
  export let isEnabled = true;
  export let isPositive = true;
  export let isPadded = true;

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
    class={isDown ? "" : "shadow"}
    style={`
    padding-bottom: ${isDown ? 3 : 7}px;
    margin-top: ${isDown ? 7 : 3}px;
    --color0: ${isPositive ? "#00994d" : "#cc0000"};
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
    <div class="shadowFix">
      <div class="front" style={isPadded ? "padding: 15px 25px;" : ""}>
        <slot />
      </div>
    </div>
  </button>
</div>

<style>
  button {
    box-sizing: border-box;
    border: solid black 3px;
    box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 0.7),
      2px 2px 0px 0px rgba(0, 0, 0, 0.7), 1px 1px 0px 0px rgba(0, 0, 0, 0.7);

    background-color: var(--color0);
    border-radius: 12px;
    width: fit-content;
    margin: auto;
    padding: 0px;
    /* border: 0px; */
    cursor: pointer;
    outline: none;
  }

  /* .shadowFix {
    width: 100%;
    height: 100%;
    box-shadow: 5px 5px 0px 0px rgba(0, 0, 0, 1);
  } */

  .front {
    /* border-style: solid; */
    background-color: var(--color1);
    border-radius: 10px;
    font-family: "Rubik";
    font-size: 24px;
    font-weight: 900;
  }

  .shadow {
    box-shadow: 5px 5px 0px 0px rgba(0, 0, 0, 1),
      4px 4px 0px 0px rgba(0, 0, 0, 1), 3px 3px 0px 0px rgba(0, 0, 0, 1),
      2px 2px 0px 0px rgba(0, 0, 0, 1), 1px 1px 0px 0px rgba(0, 0, 0, 1);
  }
</style>
