<script lang="ts">
  import Button from "src/components/button.svelte";
  import Card from "src/components/card.svelte";
  import Container from "src/components/container.svelte";
  import Spacer from "src/components/spacer.svelte";
  import { SOCKET } from "src/lib/client/socketIoClient";
  import type { GameData } from "src/shared/types";

  export let roomcode: string;
  export let gameData: GameData;

  SOCKET.on("gameDataUpdated", (gameDataNew) => {
    gameData = gameDataNew;
  });
</script>

<div class="title">{`Room: ${roomcode}`}</div>

<Spacer space={10} />

<div>{"Storyteller"}</div>

<Spacer space={30} />

<Button onClick={() => {}}>{"Start Action"}</Button>

<Spacer space={30} />

<div>{"Personalities:"}</div>
<Container>
  {#each gameData.persNames as name, i}
    <Card {name} attemptsC={gameData.attemptsLeft} />
  {/each}
</Container>

<style>
  .title {
    font-family: "Secular One";
    font-weight: 00;
  }
</style>
