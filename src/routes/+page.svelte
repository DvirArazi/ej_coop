<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "/@src/components/button.svelte";
  import Container from "/@src/components/container.svelte";
  import Spacer from "/@src/components/spacer.svelte";
  import { SOCKET } from "/@src/lib/client/socketIoClient";
  import type { UserData } from "/@src/shared/types";

  let userData: UserData | null = null;
  let roomcode = "";
  let joinEnabled = false;
  let noRoom = false;

  // SOCKET.on("identified", (userDataNew) => {
  //   userData = userDataNew;

  //   console.log("userData: ", userData);
  // });

  SOCKET.emit("getUserData", (userDataNew) => {
    userData = userDataNew;
  });

  $: {
    joinEnabled =
      userData !== null && userData.name !== "" && roomcode.length === 4;
  }

  function createRoom() {
    SOCKET.emit("createRoom", (roomcodeNew) => {
      goto(`/${roomcodeNew}`);
    });
  }

  function joinRoom() {
    SOCKET.emit("doesRoomExist", roomcode, (roomExists) => {
      noRoom = !roomExists;
      if (noRoom) return;

      goto(`/${roomcode}`);
    });
  }

  function handleRoomcodeInputChange() {
    roomcode = roomcode.toUpperCase().substring(0, 4);
    noRoom = false;
  }

  function handleNameInputChange() {
    if (userData !== null) {
      SOCKET.emit("updateName", userData.name);
    }
  }
</script>

{#if userData === null}
  <Spacer space={50} />
  <div>{"Loading..."}</div>
{:else}
  <div class="title title0">{"EVERYBODY'S"}</div>
  <div class="title title1">{"JIM"}</div>

  <Spacer space={30} />

  <Button onClick={createRoom}>{"Create a Room"}</Button>

  <Spacer space={30} />

  <Container>
    <table>
      <tr>
        <td class="text">{"Your Name:"}</td>
        <td class="line">
          <input
            type="text"
            bind:value={userData.name}
            on:input={handleNameInputChange}
          />
        </td>
      </tr>
      <Spacer space={10} />
      <tr>
        <td class="text">{"Room Code:"}</td>
        <td class="line">
          <input
            type="text"
            class="roomcode"
            bind:value={roomcode}
            placeholder="XXXX"
            on:input={handleRoomcodeInputChange}
          />
        </td>
      </tr>
    </table>
    <Spacer space={40} />
    <Button onClick={joinRoom} isEnabled={joinEnabled}>
      {"Join a Room"}
    </Button>

    {#if noRoom}
      <Spacer space={10} />
      <div class="red">{"Room does not exist"}</div>
    {/if}

    <Spacer space={5} />
  </Container>

  <Spacer space={30} />

  <div>
    {"Return to:"}
    {#each userData.associations as association}
      <Button onClick={() => {}}>{"button"}</Button>
    {/each}
  </div>
{/if}

<style>
  td {
    box-sizing: border-box;
  }
  input[type="text"] {
    text-align: center;
  }
  .title {
    font-family: "Secular One";
  }
  .title0 {
    font-size: 50px;
  }
  .title1 {
    font-size: 210px;
    line-height: 150px;
  }
  .text {
    min-width: 180px;
    /* padding-right: 10px; */
  }
  .line {
    padding: 0 10px;
  }
  .roomcode {
    letter-spacing: 5px;
  }
  .red {
    color: rgb(255, 0, 0);
  }
</style>
