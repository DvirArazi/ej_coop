<script lang="ts">
  import Card from "/@src/components/card.svelte";
  import Container from "/@src/components/container.svelte";
  import Spacer from "/@src/components/spacer.svelte";

  export let persNames: string[];
  export let attemptsLeft: number;
  export let meI: number | null = null;
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
    isMe={meI !== null ? meI === 0 : false}
  />

  {#if persNames.length > 1}
    <Spacer space={20} />
    <hr />
    {#each persNames.slice(1) as name, i}
      <Spacer space={20} />
      <Card
        {name}
        onRemove={onRemove !== null ? () => onRemoveNN(i + 1) : null}
        isMe={meI !== null ? meI === i + 1 : false}
      />
    {/each}
  {/if}
</Container>

<style>
  hr {
    height: 3px;
    border: none;
    border-radius: 10px;
    background: black;
    margin: 0 15px;
  }
</style>
