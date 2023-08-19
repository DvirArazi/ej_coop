<script lang="ts">
  import Button from "/@src/components/button.svelte";
  import InitModal from "/@src/components/initModal.svelte";
  import Spacer from "/@src/components/spacer.svelte";
  import { SOCKET } from "/@src/lib/client/socketIoClient";
  import PerList from "/@src/routes/[roomcode]/perList.svelte";
  import { DIE_RESOLUTION } from "/@src/shared/constants";
  import type { SttData } from "/@src/shared/types";

  export let roomcode: string;
  export let sttData: SttData;
  console.log(sttData);

  let isInitModalOpen = false;

  SOCKET.on("storytellerDataUpdated", (sttDataNew) => {
    if (sttDataNew.roomcode != roomcode) return;

    console.log("sttData: ", sttData);
    sttData = sttDataNew;
  });

  function onShareClick() {
    navigator.share({
      url: window.location.origin + "/" + roomcode,
    });
  }

  function handleRiskSet(riskNum: number) {
    SOCKET.emit("riskSet", roomcode, riskNum / DIE_RESOLUTION);
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

  <Button
    onClick={() => (isInitModalOpen = true)}
    enabled={sttData.persNames.length >= 2}
  >
    {"Start Action"}
  </Button>
{/if}

<Spacer space={30} />

<InitModal
  isOpen={isInitModalOpen}
  onRiskNumSet={handleRiskSet}
  onClose={() => isInitModalOpen = false}
/>

<style>
  .title {
    font-family: "Secular One";
    font-weight: 00;
  }
</style>
