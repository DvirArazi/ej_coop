<script lang="ts">
  import Button from "/@src/components/button.svelte";
  import Spacer from "/@src/components/spacer.svelte";
  import { SOCKET } from "/@src/lib/client/socketIoClient";
  import PerList from "/@src/routes/[roomcode]/perList.svelte";
  import type { GameData, SttData } from "/@src/shared/types";

  export let roomcode: string;
  export let sttData: SttData;

  SOCKET.on("storytellerDataUpdated", (sttDataNew) => {
    sttData = sttDataNew;
  });

  function onShareClick() {
    navigator.share({
      url: window.location.origin + "/" + roomcode,
    });
  }
</script>

<div class="title">{`Room: ${roomcode}`}</div>

<Spacer space={10} />

<div>{"Storyteller"}</div>

<Spacer space={30} />

<Button onClick={onShareClick}>{"Share Room Link"}</Button>

<Spacer space={30} />

{#if sttData.persNames.length > 0}
  <PerList
    personalitiesNames={sttData.persNames}
    attemptsLeft={sttData.attemptsLeft}
  />

  <Spacer space={30} />

  <Button onClick={() => {}} enabled={sttData.persNames.length >= 2}>
    {"Start Action"}
  </Button>
{/if}

<Spacer space={30} />

<style>
  .title {
    font-family: "Secular One";
    font-weight: 00;
  }
</style>
