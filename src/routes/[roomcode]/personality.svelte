<script lang="ts">
  import { onMount } from "svelte";
  import Button from "/@src/components/button.svelte";
  import Card from "/@src/components/card.svelte";
  import Container from "/@src/components/container.svelte";
  import Spacer from "/@src/components/spacer.svelte";
  import { SOCKET } from "/@src/lib/client/socketIoClient";
  import type { PerData } from "/@src/shared/types";
  import PerList from "/@src/routes/[roomcode]/perList.svelte";

  export let roomcode: string;
  export let personalityData: PerData;

  let cheat: HTMLDivElement;
  let nameInputWidth: number;
  let isNameInputEmpty = false;

  SOCKET.on("personalityDataUpdated", (personalityDataNew) => {
    personalityData = personalityDataNew;
  });

  function handleNameInputChange() {
    SOCKET.emit("updateName", personalityData.name);

    updateNameInputWidth();
  }

  function updateNameInputWidth() {
    cheat.style.display = "block";
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

<div class="title">{`Room: ${roomcode}`}</div>

<Spacer space={10} />

<input
  type="text"
  bind:value={personalityData.name}
  placeholder="Enter your name"
  on:input={handleNameInputChange}
  style={`
    width: ${nameInputWidth}px;
    font-size: ${isNameInputEmpty ? 30 : 40}px;
  `}
/>

<Spacer space={60} />

<PerList
  personalitiesNames={personalityData.personalitiesNames}
  attemptsLeft={personalityData.attemptsLeft}
/>

<div
  contenteditable="true"
  bind:this={cheat}
  bind:innerText={personalityData.name}
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
