<script lang="ts">
  import Button from "/@src/components/button.svelte";
  import Modal from "/@src/components/modal.svelte";
  import Spacer from "/@src/components/spacer.svelte";
  import Wheel from "/@src/components/wheel.svelte";
  import { SpinRole } from "/@src/lib/client/types";

  export let risk: number;
  export let persNames: string[];
  export let spinRole: SpinRole;
  export let secondsToVote: number;

  let tiltAngle = 0;

  let ableToVote: boolean = false;
  $: ableToVote = secondsToVote > 0;

  console.log(spinRole);
</script>

<Modal>
  <Wheel {risk} {persNames} {tiltAngle} />

  <Spacer space={30} />

  {#if spinRole === SpinRole.Stt}
    <Button enabled={false} onClick={() => {}}>{"Continue"}</Button>
  {:else if spinRole === SpinRole.Prom}
    <Button enabled={!ableToVote} onClick={() => {}}>{"Spin"}</Button>
  {:else}
    <div class="vote">
      <Button enabled={ableToVote} onClick={() => {}}>
        <img src="svgs/thumb_up_FILL0_wght400_GRAD0_opsz48.svg" alt="write" />
      </Button>
      <Button enabled={ableToVote} onClick={() => {}}>
        <img src="svgs/thumb_down_FILL0_wght400_GRAD0_opsz48.svg" alt="write" />
      </Button>
    </div>
  {/if}

  <Spacer space={30} />

  <div>{`time to vote: ${secondsToVote}s`}</div>
</Modal>

<style>
  .vote {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
