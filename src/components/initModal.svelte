<script lang="ts">
  import Modal from "./modal.svelte";
  import Button from "/@src/components/button.svelte";
  import Container from "/@src/components/container.svelte";
  import Spacer from "/@src/components/spacer.svelte";
  import { DIE_RESOLUTION } from "/@src/shared/constants";

  export let onRiskNumSet: (risk: number | boolean) => void;
  export let onClose: () => void;

  let riskNum: number | null = null;

  function handleRiskInput(event: Event) {
    const max = DIE_RESOLUTION - 1;

    let target = event.target as HTMLInputElement;
    const valueNum = Number.parseInt(target.value);
    if (isNaN(valueNum)) {
      riskNum = null;
      target.value = "";
      return;
    } else if (valueNum < 0) riskNum = 0;
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
          placeholder={`0-${DIE_RESOLUTION - 1}`}
          on:input={handleRiskInput}
        />
        {DIE_RESOLUTION}
      </div>
    </div>

    <Spacer space={40} />

    <Button
      onClick={() => {
        if (riskNum !== null) onRiskNumSet(riskNum / DIE_RESOLUTION);
      }}
      isEnabled={riskNum !== null}
    >
      {"Continue"}
    </Button>
    <Spacer space={20} />
  </Container>

  <Spacer space={30} />

  <Button onClick={() => onRiskNumSet(true)}>{"Instant Success"}</Button>

  <Spacer space={20} />

  <Button onClick={() => onRiskNumSet(false)} isPositive={false}>{"Instant Failure"}</Button>

  <Spacer space={10} />
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

  input[type="text"] {
    text-align: center;
    max-width: 80px;
    font-size: 40px;
  }
</style>
