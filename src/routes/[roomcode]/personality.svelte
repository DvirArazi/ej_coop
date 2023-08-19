<script lang="ts">
  import { onMount } from "svelte";
  import Spacer from "/@src/components/spacer.svelte";
  import { SOCKET } from "/@src/lib/client/socketIoClient";
  import type { PerData } from "/@src/shared/types";
  import PerList from "/@src/routes/[roomcode]/perList.svelte";

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

  function handleNameInputChange() {
    SOCKET.emit("updateName", name);

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
  bind:value={name}
  placeholder="Enter your name"
  on:input={handleNameInputChange}
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
