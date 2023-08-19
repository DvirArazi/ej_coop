<script lang="ts">
  import Card from "/@src/components/card.svelte";
  import Container from "/@src/components/container.svelte";
  import Spacer from "/@src/components/spacer.svelte";

  export let persNames: string[];
  export let attemptsLeft: number;
</script>

<Container>
  <Card name={persNames[0]} attemptsC={attemptsLeft} />

  {#if persNames.length > 1}
    <Spacer space={20} />
    <div class="line" />
    {#each persNames.slice(1) as name, _}
      <Spacer space={20} />
      <Card {name} />
    {/each}
  {/if}
</Container>

<style>
  .line {
    border-bottom: 3px solid black;
    margin: 0 15px;
  }
</style>
