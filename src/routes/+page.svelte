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
  <Spacer space={20} />
  <div class="title coop">{"CO-OP"}</div>

  <Spacer space={60} />

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

  {#if userData.associations.length > 0}
    <div>{"Return to:"}</div>
    {#each userData.associations as association}
      <Spacer space={20} />
      <Button
        onClick={() => {
          goto(`/${association.roomcode}`);
        }}
      >
        {`room ${association.roomcode} as ${
          association.isStt ? "the storyteller" : " a personality"
        }`}
      </Button>
    {/each}

    <Spacer space={30} />
  {/if}
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

  .coop {
    line-height: 0px;
    font-size: 70px;
    color: #a2e8ff;
    width: 80%;
    margin: auto;
    
    transform: rotate(-6deg);
    animation: grow-shrink 3s ease-in-out infinite;

    text-shadow: rgb(0, 0, 0) 6px 0px 0px, rgb(0, 0, 0) 5.91686px 0.995377px 0px,
      rgb(0, 0, 0) 5.66974px 1.96317px 0px, rgb(0, 0, 0) 5.2655px 2.87655px 0px,
      rgb(0, 0, 0) 4.71532px 3.71022px 0px, rgb(0, 0, 0) 4.03447px 4.44106px 0px,
      rgb(0, 0, 0) 3.24181px 5.04883px 0px, rgb(0, 0, 0) 2.35931px 5.51667px 0px,
      rgb(0, 0, 0) 1.41143px 5.83163px 0px,
      rgb(0, 0, 0) 0.424423px 5.98497px 0px,
      rgb(0, 0, 0) -0.574341px 5.97245px 0px,
      rgb(0, 0, 0) -1.55719px 5.79441px 0px,
      rgb(0, 0, 0) -2.49688px 5.45578px 0px,
      rgb(0, 0, 0) -3.36738px 4.96596px 0px,
      rgb(0, 0, 0) -4.14455px 4.33852px 0px,
      rgb(0, 0, 0) -4.80686px 3.59083px 0px,
      rgb(0, 0, 0) -5.33596px 2.74364px 0px,
      rgb(0, 0, 0) -5.71718px 1.8204px 0px,
      rgb(0, 0, 0) -5.93996px 0.84672px 0px,
      rgb(0, 0, 0) -5.99811px -0.150428px 0px,
      rgb(0, 0, 0) -5.89004px -1.14341px 0px,
      rgb(0, 0, 0) -5.61874px -2.1047px 0px,
      rgb(0, 0, 0) -5.19172px -3.00766px 0px,
      rgb(0, 0, 0) -4.62082px -3.82727px 0px,
      rgb(0, 0, 0) -3.92186px -4.54081px 0px,
      rgb(0, 0, 0) -3.11421px -5.12852px 0px,
      rgb(0, 0, 0) -2.22026px -5.57409px 0px,
      rgb(0, 0, 0) -1.26477px -5.86518px 0px,
      rgb(0, 0, 0) -0.274238px -5.99373px 0px,
      rgb(0, 0, 0) 0.723898px -5.95617px 0px,
      rgb(0, 0, 0) 1.70197px -5.75355px 0px,
      rgb(0, 0, 0) 2.63288px -5.39147px 0px,
      rgb(0, 0, 0) 3.49082px -4.87998px 0px,
      rgb(0, 0, 0) 4.25202px -4.23324px 0px,
      rgb(0, 0, 0) 4.89538px -3.46919px 0px,
      rgb(0, 0, 0) 5.40307px -2.60899px 0px,
      rgb(0, 0, 0) 5.76102px -1.67649px 0px,
      rgb(0, 0, 0) 5.95932px -0.697531px 0px;
  }

  @keyframes grow-shrink {
    0% {
      transform: rotate(-6deg) scale(1);
    }
    50% {
      transform: rotate(-5deg) scale(1.1);
    }
    100% {
      transform: rotate(-6deg) scale(1);
    }
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
