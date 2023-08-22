<script lang="ts">
  import Card from "/@src/components/card.svelte";
  import Container from "/@src/components/container.svelte";
  import Spacer from "/@src/components/spacer.svelte";

  export let persNames: string[];
  export let attemptsLeft: number;
  export let onRemove: ((perI: number) => void) | null = null;

  function onRemoveNN(perI: number) {
    onRemove!(perI);
  }
</script>

<Container>
  <Card
    name={persNames[0]}
    attemptsC={attemptsLeft}
    onRemove={onRemove !== null ? () => onRemoveNN(0) : null}
  />

  {#if persNames.length > 1}
    <Spacer space={20} />
    <hr />
    {#each persNames.slice(1) as name, i}
      <Spacer space={20} />
      <Card
        {name}
        onRemove={onRemove !== null ? () => onRemoveNN(i + 1) : null}
      />
    {/each}
  {/if}
</Container>

<style>
  hr {
    height: 2px;
    border: none;
    background: black;
    margin: 0 15px;
  }
</style>
