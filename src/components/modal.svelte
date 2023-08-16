<script lang="ts">
  export let showModal: boolean;

  let dialog: HTMLDialogElement;

  $: if (dialog && showModal) dialog.showModal();

  $: document.body.style.overflow = showModal ? "hidden" : "scroll";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->

<dialog bind:this={dialog} on:close={() => (showModal = false)}>
  <div class="outer">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click|stopPropagation>
      <slot />
      <!-- svelte-ignore a11y-autofocus -->
      <!-- <button autofocus on:click={() => dialog.close()}>close modal</button> -->
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

    overflow-x: hidden;
  }

  .outer {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 5px 10px 5px rgba(0, 0, 0, 0.15);
    max-width: 500px;
    text-align: center;
    margin: auto;
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
