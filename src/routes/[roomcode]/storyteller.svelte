<script lang="ts">
  import Button from "/@src/components/button.svelte";
  import InitModal from "/@src/components/initModal.svelte";
    import InstantModal from "/@src/components/instantModal.svelte";
  import Spacer from "/@src/components/spacer.svelte";
  import WheelModal from "/@src/components/wheelModal.svelte";
  import { SOCKET } from "/@src/lib/client/socketIoClient";
  import { SpinRole } from "/@src/lib/client/types";
  import PerList from "/@src/routes/[roomcode]/perList.svelte";
  import { DIE_RESOLUTION } from "/@src/shared/constants";
  import { Phase, type SttData } from "/@src/shared/types";

  export let roomcode: string;
  export let sttData: SttData;

  let isInitModalOpen = false;

  SOCKET.on("storytellerDataUpdated", (sttDataNew) => {
    if (sttDataNew.roomcode != roomcode) return;

    sttData = sttDataNew;
  });

  function onShareClick() {
    navigator.share({
      url: window.location.origin + "/" + roomcode,
    });
  }

  function handleRiskSet(risk: number | boolean) {
    SOCKET.emit("riskSet", roomcode, risk);
    isInitModalOpen = false;
  }

  function handleContinue() {
    SOCKET.emit("continue", roomcode)
  }
</script>

<div class="title">{`Room: ${roomcode}`}</div>

<Spacer space={10} />

<div>{"Storyteller"}</div>

<Spacer space={30} />

<Button onClick={onShareClick}>{"Share Room Link"}</Button>

<Spacer space={30} />

{#if sttData.persNames.length > 0}
  <PerList persNames={sttData.persNames} attemptsLeft={sttData.attemptsLeft} />

  <Spacer space={30} />

  <Button
    onClick={() => (isInitModalOpen = true)}
    isEnabled={sttData.persNames.length >= 2}
  >
    {"Start Action"}
  </Button>
{/if}

<Spacer space={30} />

{#if isInitModalOpen}
  <InitModal
    onRiskNumSet={handleRiskSet}
    onClose={() => (isInitModalOpen = false)}
  />
{/if}

{#if sttData.phaseData.phase == Phase.Vote}
  {#if typeof sttData.phaseData.risk !== "boolean"}
  <WheelModal
    persNames={sttData.persNames}
    votes={sttData.phaseData.votes}
    risk={sttData.phaseData.risk}
    spinRole={SpinRole.Stt}
    secondsToVote={sttData.phaseData.secondsToVote}
    revolutionsC={sttData.phaseData.revolutionsC}
    onContinue={handleContinue}
  />
  {:else}
  <InstantModal
    isSuccess={sttData.phaseData.risk}
    onContinue={handleContinue}
  />
  {/if}
{/if}

<style>
  .title {
    font-family: "Secular One";
    font-weight: 00;
  }
</style>
