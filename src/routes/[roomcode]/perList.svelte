<script lang="ts">
  import Card from "/@src/components/card.svelte";
  import Container from "/@src/components/container.svelte";
  import Spacer from "/@src/components/spacer.svelte";

  export let personalitiesNames: string[];
  export let attemptsLeft: number;
</script>

<Container>
  <Card
    name={personalitiesNames[0]}
    attemptsC={attemptsLeft}
  />
  <Spacer space={20} />
  <div class="line" />
  {#each personalitiesNames.slice(1) as name, _}
    <Spacer space={20} />
    <Card {name} />
  {/each}
</Container>

<style>
  .line {
    border-bottom: 3px solid black;
    margin: 0 15px;
  }
</style>
