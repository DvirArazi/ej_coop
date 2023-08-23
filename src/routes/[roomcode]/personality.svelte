<script lang="ts">
  import { onMount } from "svelte";
  import Spacer from "/@src/components/spacer.svelte";
  import { SOCKET } from "/@src/lib/client/socketIoClient";
  import { Phase, type PerData } from "/@src/shared/types";
  import PerList from "/@src/routes/[roomcode]/perList.svelte";
  import WheelModal from "/@src/components/wheelModal.svelte";
  import { SpinRole } from "/@src/lib/client/types";
  import InstantModal from "/@src/components/instantModal.svelte";
  import Button from "/@src/components/button.svelte";
  import RoomcodeText from "/@src/components/roomcodeText.svelte";

  export let roomcode: string;
  export let perData: PerData;

  let cheat: HTMLDivElement;
  let nameInputWidth: number;
  let name: string;
  let isNameInputEmpty = false;

  $: if (cheat !== undefined) {
    cheat.style.display = "block";
    cheat.innerText = name;
    isNameInputEmpty = cheat.offsetWidth === 0;
    if (isNameInputEmpty) {
      nameInputWidth = 200;
    } else {
      const w = cheat.offsetWidth + 15;
      nameInputWidth = w > 150 ? w : 150;
    }
    cheat.style.display = "none";
  }

  SOCKET.on("personalityDataUpdated", (perDataNew) => {
    if (perDataNew.roomcode != roomcode) return;

    perData = perDataNew;
    name = perData.persNames[perData.index];
  });

  function handleNameInput(event: Event) {
    SOCKET.emit("updateName", name);
  }

  function handleVote(vote: boolean) {
    SOCKET.emit("vote", roomcode, vote);
  }

  function handleSpin() {
    SOCKET.emit("spin", roomcode);
  }

  function handleLeaveRoom() {
    SOCKET.emit("removePer", roomcode, perData.index);
  }

  onMount(() => {
    name = perData.persNames[perData.index];
    cheat.innerText = name;
  });
</script>

{#if perData.phaseData.phase == Phase.Vote}
  {#if typeof perData.phaseData.risk !== "boolean"}
    <WheelModal
      persNames={perData.persNames}
      votes={perData.phaseData.votes}
      risk={perData.phaseData.risk}
      spinRole={perData.index === 0 ? SpinRole.Prom : SpinRole.Voter}
      secondsToVote={perData.phaseData.secondsToVote}
      revolutionsC={perData.phaseData.revolutionsC}
      onVote={handleVote}
      onSpin={handleSpin}
    />
  {:else}
    <InstantModal isSuccess={perData.phaseData.risk} />
  {/if}
{/if}

<Spacer space={20} />

<RoomcodeText {roomcode} />

<Spacer space={10} />

<input
  type="text"
  placeholder="Enter your name"
  bind:value={name}
  on:input={handleNameInput}
  style={`
    width: ${nameInputWidth}px;
    font-size: ${isNameInputEmpty ? 24 : 35}px;
  `}
/>

<Spacer space={60} />

<PerList
  persNames={perData.persNames}
  attemptsLeft={perData.attemptsLeft}
  meI={perData.index}
/>

<div
  contenteditable="true"
  bind:this={cheat}
  bind:innerText={name}
  class="cheat"
/>

<Spacer space={30} />

<Button onClick={handleLeaveRoom} isPositive={false}>{"Leave Room"}</Button>

<Spacer space={30} />

<style>
  input[type="text"] {
    width: 300px;
    text-align: center;
  }

  .cheat {
    width: min-content;
  }

  input[type="text"],
  .cheat {
    font-size: 35px;
  }
</style>
