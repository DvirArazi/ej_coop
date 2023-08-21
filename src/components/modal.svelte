<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  let dialog: HTMLDialogElement;

  onMount(() => {
    document.body.style.overflow = "hidden";
    dialog.showModal();
  });

  onDestroy(() => {
    document.body.style.overflow = "auto";
    dialog.close();
  });
</script>

<dialog bind:this={dialog}>
  <div class="outer">
    <div>
      <slot />
    </div>
  </div>
</dialog>

<style>
  dialog {
    border: none;
    outline: none;
    background-color: transparent;
    width: 100%;
    height: 100%;
    padding-top: 200px;

    overflow-x: hidden;
  }

  .outer {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 5px 10px 5px rgba(0, 0, 0, 0.15);
    max-width: 400px;
    text-align: center;
    margin: auto;
    user-select: none;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }

  dialog > div {
    padding: 1em;
  }

  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }

  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
