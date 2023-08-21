<script lang="ts">
  import Modal from "./modal.svelte";
  import Button from "/@src/components/button.svelte";
  import Container from "/@src/components/container.svelte";
  import Spacer from "/@src/components/spacer.svelte";
  import { DIE_RESOLUTION } from "/@src/shared/constants";

  export let onRiskNumSet: (riskNum: number) => void;
  export let onClose: () => void;

  let riskNum: number = 0;

  function handleRiskInput(event: Event) {
    const max = DIE_RESOLUTION - 1;

    let target = event.target as HTMLInputElement;
    const valueNum = Number.parseInt(target.value);
    if (isNaN(valueNum)) {
      riskNum = 0;
      target.value = "";
      return;
    } else if (valueNum < 1) riskNum = 1;
    else if (valueNum > max) riskNum = max;
    else riskNum = Math.floor(valueNum);

    target.value = riskNum.toString();
  }
</script>

<Modal>
  <div class="xDiv">
    <button class="xButton" on:click={onClose}>{"×"}</button>
  </div>

  <Spacer space={30} />

  <Container>
    <div class="container">
      <div>{"Risk:"}</div>

      <Spacer space={50} />

      <div class="risk">
        <input
          type="text"
          placeholder={`1-${DIE_RESOLUTION - 1}`}
          on:input={handleRiskInput}
        />
        {DIE_RESOLUTION}
      </div>
    </div>

    <Spacer space={40} />

    <Button onClick={() => onRiskNumSet(riskNum)} isEnabled={riskNum !== 0}>
      {"Continue"}
    </Button>
    <Spacer space={20} />
  </Container>

  <Spacer space={40} />

  <div class="bottom">
    <div class="button">
      <Button onClick={() => onRiskNumSet(10)}>{"Instant Success"}</Button>
    </div>

    <Spacer space={30} />

    <div class="button">
      <Button onClick={() => onRiskNumSet(0)}>{"Instant Failure"}</Button>
    </div>
  </div>
</Modal>

<style>
  .xDiv {
    display: flex;
    justify-content: flex-end;
  }

  .xButton {
    background-color: transparent;
    border: 0px;
    font-size: 50px;
    line-height: 15px;
    transform: translateX(15px);
    cursor: pointer;
  }

  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    justify-content: center;
    /* max-width: 500px; */
  }

  .risk {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 40px;
  }

  .bottom {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .button {
    width: 170px;
  }

  input[type="text"] {
    text-align: center;
    max-width: 70px;
    font-size: 40px;
  }
</style>
