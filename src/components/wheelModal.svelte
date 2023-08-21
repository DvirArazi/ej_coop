<script lang="ts">
  import { onMount } from "svelte";
  import Button from "/@src/components/button.svelte";
  import Modal from "/@src/components/modal.svelte";
  import Spacer from "/@src/components/spacer.svelte";
  import Wheel from "/@src/components/wheel.svelte";
  import { SpinRole } from "/@src/lib/client/types";
  import { getIsSuccess } from "/@src/shared/funcs";

  const acc = -1; // rad/s^2

  export let risk: number;
  export let persNames: string[];
  export let votes: (boolean | null)[];
  export let spinRole: SpinRole;
  export let secondsToVote: number;
  export let revolutionsC: number; // revolutions
  export let onVote: (vote: boolean) => void = () => {};
  export let onSpin: () => void = () => {};
  export let onContinue: () => void = () => {};

  let tiltAngle = 0;
  let isSuccess: boolean | null = null;
  let ableToVote = false;
  let startS = 0;
  let velocityStart = 0;
  let tiltAnglePrev = 0;

  $: ableToVote = secondsToVote > 0;

  $: if (revolutionsC != 0) {
    startS = performance.now() / 1000;
    velocityStart = Math.sqrt(-2 * acc * revolutionsC * (2 * Math.PI));
    tiltAnglePrev = 0;
    requestAnimationFrame(spinWheel);
  }

  function spinWheel() {
    const passedS = performance.now() / 1000 - startS;

    tiltAnglePrev = tiltAngle;

    tiltAngle = velocityStart * passedS + (acc * passedS * passedS) / 2;

    if (tiltAngle - tiltAnglePrev <= 0) {
      isSuccess = getIsSuccess(revolutionsC, risk, votes);
      return;
    }

    requestAnimationFrame(spinWheel);
  }
</script>

<Modal>
  {#if isSuccess != null}
    <div class="conclusion1">
      <div
        class="conclusion"
        style="--outline-color: {isSuccess ? '#00e600' : '#e60000'}"
      >
        {isSuccess ? "SUCCESS!" : "FAILURE!"}
      </div>
    </div>
  {/if}

  <Wheel {risk} {persNames} {tiltAngle} {votes} />

  <Spacer space={30} />

  {#if spinRole === SpinRole.Stt}
    <Button isEnabled={revolutionsC > 0 && isSuccess != null} onClick={onContinue}
      >{"Continue"}
    </Button>
  {:else if spinRole === SpinRole.Prom}
    <Button isEnabled={!ableToVote && revolutionsC <= 0} onClick={onSpin}>
      {"Spin"}
    </Button>
  {:else}
    <div class="vote">
      <Button isEnabled={ableToVote} onClick={() => onVote(true)}>
        <img src={ableToVote ? "svgs/thumb_up.svg" : "svgs/thumb_up_disabled.svg"} alt="write" />
      </Button>
      <Button isEnabled={ableToVote} onClick={() => onVote(false)}>
        {ableToVote}
        <!-- <img src={ableToVote ? "svgs/thumb_down.svg" : "svgs/thumb_down_disabled.svg"} alt="write" /> -->
      </Button>
    </div>
  {/if}

  <Spacer space={30} />

  <div>
    {secondsToVote > 0 ? `Time to vote: ${secondsToVote}s` : "Voting is over!"}
  </div>
</Modal>

<style>
  .vote {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
  }

  .conclusion1 {
    position: relative;
    width: 100%;
  }

  .conclusion {
    position: absolute;
    top: 15px;
    left: 0;
    right: 0;
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 20;

    font-size: 60px;
    transform-origin: 50% 50%;
    transform: rotate(-12deg);
    color: #fff;
    text-shadow: var(--outline-color) 6px 0px 0px,
      var(--outline-color) 5.91686px 0.995377px 0px,
      var(--outline-color) 5.66974px 1.96317px 0px,
      var(--outline-color) 5.2655px 2.87655px 0px,
      var(--outline-color) 4.71532px 3.71022px 0px,
      var(--outline-color) 4.03447px 4.44106px 0px,
      var(--outline-color) 3.24181px 5.04883px 0px,
      var(--outline-color) 2.35931px 5.51667px 0px,
      var(--outline-color) 1.41143px 5.83163px 0px,
      var(--outline-color) 0.424423px 5.98497px 0px,
      var(--outline-color) -0.574341px 5.97245px 0px,
      var(--outline-color) -1.55719px 5.79441px 0px,
      var(--outline-color) -2.49688px 5.45578px 0px,
      var(--outline-color) -3.36738px 4.96596px 0px,
      var(--outline-color) -4.14455px 4.33852px 0px,
      var(--outline-color) -4.80686px 3.59083px 0px,
      var(--outline-color) -5.33596px 2.74364px 0px,
      var(--outline-color) -5.71718px 1.8204px 0px,
      var(--outline-color) -5.93996px 0.84672px 0px,
      var(--outline-color) -5.99811px -0.150428px 0px,
      var(--outline-color) -5.89004px -1.14341px 0px,
      var(--outline-color) -5.61874px -2.1047px 0px,
      var(--outline-color) -5.19172px -3.00766px 0px,
      var(--outline-color) -4.62082px -3.82727px 0px,
      var(--outline-color) -3.92186px -4.54081px 0px,
      var(--outline-color) -3.11421px -5.12852px 0px,
      var(--outline-color) -2.22026px -5.57409px 0px,
      var(--outline-color) -1.26477px -5.86518px 0px,
      var(--outline-color) -0.274238px -5.99373px 0px,
      var(--outline-color) 0.723898px -5.95617px 0px,
      var(--outline-color) 1.70197px -5.75355px 0px,
      var(--outline-color) 2.63288px -5.39147px 0px,
      var(--outline-color) 3.49082px -4.87998px 0px,
      var(--outline-color) 4.25202px -4.23324px 0px,
      var(--outline-color) 4.89538px -3.46919px 0px,
      var(--outline-color) 5.40307px -2.60899px 0px,
      var(--outline-color) 5.76102px -1.67649px 0px,
      var(--outline-color) 5.95932px -0.697531px 0px, 0px 0px 30px #000000,
      0px 0px 30px #000000;
  }
</style>
