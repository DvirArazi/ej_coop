<script lang="ts">
  import { onDestroy } from "svelte";
  import Button from "/@src/components/button.svelte";
  import InitModal from "/@src/components/initModal.svelte";
  import InstantModal from "/@src/components/instantModal.svelte";
  import RoomcodeText from "/@src/components/roomcodeText.svelte";
  import Spacer from "/@src/components/spacer.svelte";
  import WheelModal from "/@src/components/wheelModal.svelte";
  import { SOCKET } from "/@src/lib/client/socketIoClient";
  import { SpinRole } from "/@src/lib/client/types";
  import PerList from "/@src/routes/[roomcode]/perList.svelte";
  import { Phase, type SttData } from "/@src/shared/types";

  export let roomcode: string;
  export let sttData: SttData;

  let isInitModalOpen = false;

  SOCKET.on("storytellerDataUpdated", (sttDataNew) => {
    if (sttDataNew.roomcode != roomcode) return;

    sttData = sttDataNew;
  });

  async function copyRoomLink(roomLink: string) {
    if (navigator.clipboard?.writeText !== undefined) {
      await navigator.clipboard.writeText(roomLink);
      return;
    }

    const input = document.createElement("input");
    input.value = roomLink;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }

  async function onShareClick() {
    const roomLink = window.location.origin + "/" + roomcode;
    const shareData = {
      url: roomLink,
      title: "Everybody's Jim - CO-OP",
      text: "Share the link to invite players",
    };

    if (navigator.share !== undefined) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    await copyRoomLink(roomLink);
  }

  function handleRiskSet(risk: number | boolean) {
    SOCKET.emit("riskSet", roomcode, risk);
    isInitModalOpen = false;
  }

  function handleContinue() {
    SOCKET.emit("continue", roomcode);
  }

  function handleCancelSpin() {
    SOCKET.emit("cancelSpin", roomcode);
  }

  function handleDeleteRoom() {
    SOCKET.emit("deleteRoom", roomcode);
  }

  function handleRemove(perI: number) {
    SOCKET.emit("removePer", roomcode, perI);
  }

  onDestroy(() => {
    SOCKET.off("storytellerDataUpdated");
  });
</script>

<Spacer space={20} />

<RoomcodeText {roomcode} />

<Spacer space={10} />

<div>{"Storyteller"}</div>

<Spacer space={30} />

<Button onClick={onShareClick}>{"Share Room Link"}</Button>

<Spacer space={30} />

{#if sttData.persNames.length == 0}
  <div>{"Share the room link to invite players"}</div>
{:else}
  <PerList
    persNames={sttData.persNames}
    attemptsLeft={sttData.attemptsLeft}
    onRemove={handleRemove}
  />

  <Spacer space={30} />

  <Button
    onClick={() => (isInitModalOpen = true)}
    isEnabled={sttData.persNames.length >= 2}
  >
    {"Start Action"}
  </Button>
{/if}

<Spacer space={30} />

<Button onClick={handleDeleteRoom} isPositive={false}>{"Delete Room"}</Button>

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
      onClose={handleCancelSpin}
    />
  {:else}
    <InstantModal
      isSuccess={sttData.phaseData.risk}
      onContinue={handleContinue}
    />
  {/if}
{/if}
