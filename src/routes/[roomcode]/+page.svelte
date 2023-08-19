<script lang="ts">
  import { SOCKET } from "/@src/lib/client/socketIoClient";
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";
  import { error } from "@sveltejs/kit";
  import type { GameData } from "/@src/shared/types";
  import Storyteller from "/@src/routes/[roomcode]/storyteller.svelte";
  import Personality from "/@src/routes/[roomcode]/personality.svelte";

  export let data: PageData;
  const roomcode = data.params.roomcode;
  {
    let roomcodeUpper = roomcode.toUpperCase();
    if (roomcode !== roomcodeUpper) goto(`/${roomcodeUpper}`);
  }
  let gameData: GameData | "loading" | null = "loading";

  SOCKET.emit("enterRoom", roomcode, (gameDataNew) => {
    // console.log("gameDataNew: ", gameDataNew);
    // if (gameDataNew == null) {
    //   console.log("throwing");
    //   throw error(404, `Room ${roomcode} could not be found.`);
    // }

    gameData = gameDataNew;
  });

  $: if (gameData == null) {
    throw error(404, `Room ${roomcode} could not be found.`);
  }
</script>

{#if gameData === "loading" || gameData == null}
  <p>{"Loading..."}</p>
{:else if gameData.isStt}
  <Storyteller {roomcode} sttData={gameData.sttData} />
{:else}
  <Personality {roomcode} perData={gameData.perData} />
{/if}
