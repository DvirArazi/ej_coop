<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "/@src/components/button.svelte";
  import Container from "/@src/components/container.svelte";
    import Modal from "/@src/components/modal.svelte";
  import Spacer from "/@src/components/spacer.svelte";
  import { SOCKET } from "/@src/lib/client/socketIoClient";

  let identified = false;

  let name = "";
  let roomcode = "";
  let joinEnabled = false;
  let noRoom = false;

  SOCKET.on("identified", (nameNew, associations) => {
    name = nameNew;

    identified = true;
  });

  $: {
    joinEnabled = name != "" && roomcode.length == 4;
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
    if (identified) {
      SOCKET.emit("updateName", name);
    }
  }
</script>

<Modal
  showModal={true}
>
  {"just some text"}
</Modal>

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
          bind:value={name}
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
  <Button onClick={joinRoom} enabled={joinEnabled}>
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
</div>

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
