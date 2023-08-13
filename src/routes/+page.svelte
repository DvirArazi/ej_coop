<script lang="ts">
  import { goto } from "$app/navigation";
import { SOCKET } from "src/lib/client/socketIoClient";
  import { onMount } from "svelte";

  let name: string;

  let identified = false;

  SOCKET.on("identified", (user) => {
    name = user.name;

    identified = true;
  });

  $: {
    if (identified) {
      SOCKET.emit("updateName", name);
    }
  }

  function createRoom() {
    SOCKET.emit("createRoom", (roomcode) => {
      goto(`/${roomcode}`);
    });
  }
</script>

<div>{"Everybody's Jim"}</div>

<button on:click={createRoom}>{"Create a Room"}</button>

<div class="box">
  <div>
    <span>
      {"Your Name:"} <input type="text" bind:value={name} />
    </span>
  </div>
  <div>
    <span>
      {"Room Code:"} <input type="text" />
    </span>
  </div>
  <button>{"Join a Room"}</button>
</div>

<div>
  {"Return to:"}
</div>

<style>
  .box {
    border-style: solid;
  }
</style>
