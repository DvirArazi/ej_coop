<script lang="ts">
  import { SOCKET } from "/@src/lib/client/socketIoClient";
  import type { PageData } from "./$types";
  import { goto } from "$app/navigation";
  import type { GameData } from "/@src/shared/types";
  import Storyteller from "/@src/routes/[roomcode]/storyteller.svelte";
  import Personality from "/@src/routes/[roomcode]/personality.svelte";
  import Spacer from "/@src/components/spacer.svelte";
    import { onDestroy } from "svelte";

  export let data: PageData;

  let roomcode = data.params.roomcode;
  let gameData: GameData | "loading" | null = "loading";

  {
    let roomcodeUpper = roomcode.toUpperCase();
    if (roomcode !== roomcodeUpper) {
      roomcode = roomcodeUpper;
      goto(`/${roomcodeUpper}`);
    }
  }

  SOCKET.on("goBack", (roomcodeNew)=>{
    if (roomcode === roomcodeNew) goto('/');
  });

  SOCKET.emit("enterRoom", roomcode, (gameDataNew) => {
    gameData = gameDataNew;
  });

  onDestroy(()=>{
    SOCKET.off("goBack");
  });
</script>

{#if gameData === "loading"}
  <Spacer space={50} />
  <div>{"Loading..."}</div>
{:else if gameData === null}
  <Spacer space={50} />
  <div>{`Room ${roomcode} could not be found`}</div>
{:else if gameData.isStt}
  <Storyteller {roomcode} sttData={gameData.sttData} />
{:else}
  <Personality {roomcode} perData={gameData.perData} />
{/if}
