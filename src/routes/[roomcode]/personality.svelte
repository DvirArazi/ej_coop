<script lang="ts">
  import { onMount } from "svelte";
  import Spacer from "/@src/components/spacer.svelte";
  import { SOCKET } from "/@src/lib/client/socketIoClient";
  import { Phase, type PerData } from "/@src/shared/types";
  import PerList from "/@src/routes/[roomcode]/perList.svelte";
  import WheelModal from "/@src/components/wheelModal.svelte";
  import { SpinRole } from "/@src/lib/client/types";
  import InstantModal from "/@src/components/instantModal.svelte";

  export let roomcode: string;
  export let perData: PerData;

  let cheat: HTMLDivElement;
  let nameInputWidth: number;
  let name: string;
  let isNameInputEmpty = false;

  SOCKET.on("personalityDataUpdated", (perDataNew) => {
    if (perDataNew.roomcode != roomcode) return;

    perData = perDataNew;
    name = perData.persNames[perData.index];
  });

  function handleNameInput(event: Event) {
    // let target = event.target as HTMLInputElement;
    // target.value = name;
    SOCKET.emit("updateName", name);

    updateNameInputWidth();
  }

  function handleVote(vote: boolean) {
    SOCKET.emit("vote", roomcode, vote);
  }

  function handleSpin() {
    SOCKET.emit("spin", roomcode);
  }

  function updateNameInputWidth() {
    console.log(perData);

    name = perData.persNames[perData.index];

    cheat.style.display = "block";
    cheat.innerText = name;
    isNameInputEmpty = cheat.offsetWidth === 0;
    if (isNameInputEmpty) {
      nameInputWidth = 300;
    } else {
      const w = cheat.offsetWidth + 15;
      nameInputWidth = w > 150 ? w : 150;
    }
    cheat.style.display = "none";
  }

  onMount(updateNameInputWidth);
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

<div class="title">{`Room: ${roomcode}`}</div>

<Spacer space={10} />

<input
  type="text"
  placeholder="Enter your name"
  bind:value={name}
  on:input={handleNameInput}
  style={`
    width: ${nameInputWidth}px;
    font-size: ${isNameInputEmpty ? 30 : 40}px;
  `}
/>

<Spacer space={60} />

<PerList persNames={perData.persNames} attemptsLeft={perData.attemptsLeft} />

<div
  contenteditable="true"
  bind:this={cheat}
  bind:innerText={name}
  class="cheat"
/>

<style>
  input[type="text"] {
    width: 300px;
    text-align: center;
  }
  .title {
    font-family: "Secular One";
    font-weight: 00;
  }
  .cheat {
    width: min-content;
  }
  input[type="text"],
  .cheat {
    font-size: 40px;
  }
</style>
