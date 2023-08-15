<script lang="ts">
  import Spacer from "/@src/components/spacer.svelte";

  export let name: String;
  export let attemptsC: number | undefined = undefined;
</script>

<div class="outer">
  <div class={`name`}>
    {#if name != ""}
      {name}
    {:else}
      <div class="unnamed">{"Unnamed"}</div>
    {/if}
  </div>
  {#if attemptsC != undefined}
    <div class="attempts">
      <img src="svgs/stylus_note_FILL0_wght400_GRAD0_opsz48.svg" alt="write" />
      <Spacer space={8} />
      {`x ${attemptsC}`}
    </div>
  {/if}
</div>

<style>
  img {
    height: 45px;
    transform: translateY(-3px);
  }
  .outer {
    background-color: rgb(0, 255, 128);
    border-radius: 5px;
    padding: 10px 15px;
    height: 50px;

    display: flex;
    flex-direction: row;
    justify-content: right;
    align-items: center;
  }
  .name {
    text-align: left;
    width: 100%;
  }
  .unnamed {
    color: rgb(109, 109, 109);
    font-style: italic;
  }
  .attempts {
    white-space: nowrap;

    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
