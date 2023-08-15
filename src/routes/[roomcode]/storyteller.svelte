<script lang="ts">
  import Button from "/@src/components/button.svelte";
  import Spacer from "/@src/components/spacer.svelte";
  import { SOCKET } from "/@src/lib/client/socketIoClient";
  import PerList from "/@src/routes/[roomcode]/perList.svelte";
  import type { GameData, StorytellerData } from "/@src/shared/types";

  export let roomcode: string;
  export let storytellerData: StorytellerData;

  SOCKET.on("storytellerDataUpdated", (storytellerDataNew) => {
    storytellerData = storytellerDataNew;
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

<PerList
  personalitiesNames={storytellerData.personalitiesNames}
  attemptsLeft={storytellerData.attemptsLeft}
/>

<Spacer space={30} />

<Button
  onClick={() => {}}
  enabled={storytellerData.personalitiesNames.length >= 2}
>
  {"Start Action"}
</Button>

<Spacer space={30} />

<style>
  .title {
    font-family: "Secular One";
    font-weight: 00;
  }
</style>
