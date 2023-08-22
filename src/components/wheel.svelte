<script lang="ts">
  import { onMount } from "svelte";
  import { DIE_RESOLUTION } from "/@src/shared/constants";

  export let persNames: string[];
  export let votes: (boolean | null)[];
  export let risk: number;
  export let spinTime: number;

  const w = 500;
  const h = 500;
  const skull = new Image();
  skull.src = "/svgs/skull.svg";

  let isMounted = false;
  let wheelCanvas: HTMLCanvasElement;
  let wCtx: CanvasRenderingContext2D;
  let pointerCanvas: HTMLCanvasElement;
  let pCtx: CanvasRenderingContext2D;

  $: if (
    persNames !== undefined &&
    votes !== undefined &&
    risk !== undefined &&
    spinTime !== undefined &&
    isMounted == true
  ) {
    if (skull.complete) draw();
    else skull.onload = draw;
  }
  onMount(() => (isMounted = true));

  function draw() {
    wCtx = wheelCanvas.getContext("2d")!;
    wCtx.clearRect(0, 0, w, h);

    const alpha = (2 * Math.PI * (1 - risk) * 0.5) / persNames.length;
    for (let i = 0; i < persNames.length; i++) {
      const [color0, color1] =
        votes[i] == null
          ? ["#b3ecff", "#66d9ff"]
          : votes[i]
          ? ["#99FF99", "#4DFF4D"]
          : ["#ff4d4d", "#ff0000"];
      drawDoubleSlice(1.5 * Math.PI, alpha, color0, color1, i);
      drawName(i, alpha);
    }

    const beta = Math.PI / DIE_RESOLUTION;
    for (let i = 0; i < risk * DIE_RESOLUTION; i++) {
      drawDoubleSlice(1.5 * Math.PI, -beta, "#ff0000", "#ff4d4d", i);
      drawSkull(i, beta);
    }

    pCtx = pointerCanvas.getContext("2d")!;

    pCtx.fillStyle = "rgb(0, 255, 128)";
    pCtx.beginPath();
    pCtx.moveTo(0.5 * w, 0);
    pCtx.lineTo(0.5 * w, 50);
    pCtx.lineTo(0.5 * w - 20, 0);
    pCtx.fill();
    pCtx.fillStyle = "rgb(0, 230, 115)";
    pCtx.beginPath();
    pCtx.moveTo(0.5 * w, 0);
    pCtx.lineTo(0.5 * w, 50);
    pCtx.lineTo(0.5 * w + 20, 0);
    pCtx.fill();
  }

  function drawDoubleSlice(
    start: number,
    angle: number,
    color0: string,
    color1: string,
    index: number
  ) {
    function drawSlice(color: string, pointA: number) {
      const pointB = pointA + angle;
      const [from, to] = pointA < pointB ? [pointA, pointB] : [pointB, pointA];

      wCtx.fillStyle = color;
      wCtx.beginPath();
      wCtx.arc(0.5 * w, 0.5 * h, 0.5 * w, from, to + 0.0);
      wCtx.lineTo(0.5 * w, 0.5 * h);
      wCtx.fill();
    }

    drawSlice(color0, start + 2 * index * angle);
    drawSlice(color1, start + (2 * index + 1) * angle);
  }

  function drawName(nameI: number, angle: number) {
    const a = 0.3 * w,
      b = 0.3 * w;

    wCtx.save();

    wCtx.fillStyle = "#000000";
    wCtx.translate(0.5 * w, 0.5 * h);
    let text = persNames[nameI];

    let metrics = wCtx.measureText(text);
    let tw = metrics.width;
    let th = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    wCtx.font = `bold ${
      10 * Math.min(b / tw, (0.8 * (a - b / 2) * 2 * Math.tan(angle)) / th)
    }px Rubik`;

    metrics = wCtx.measureText(text);
    tw = metrics.width;
    th = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    wCtx.rotate(-0.25 * 2 * Math.PI + (nameI + 0.5) * 2 * angle);
    wCtx.fillText(text, a - 0.5 * tw, 0.5 * th);

    wCtx.restore();
  }

  function drawSkull(skullI: number, angle: number) {
    const sw = 0.2 * w;
    const sh = 0.2 * h;

    wCtx.save();
    wCtx.translate(0.5 * w, 0.5 * h);
    wCtx.rotate(-(skullI + 0.5) * 2 * angle);
    wCtx.drawImage(skull, -0.5 * sw, -(0.5 - 0.02) * w, sw, sh);
    wCtx.restore();
  }
</script>

<div class="container">
  <div class="wrapper">
    <canvas class="pointer" bind:this={pointerCanvas} width={w} height={h} />
  </div>
  <div class="padder" />
  <canvas
    class="wheel animation"
    bind:this={wheelCanvas}
    width={w}
    height={h}
    style="--spinTime: {spinTime};"
  />
</div>

<style>
  .container {
    position: relative;
  }
  .wrapper {
    position: absolute;
    width: 100%;
    z-index: 10;
  }
  .pointer {
    width: 100%;
    height: 100%;
  }
  .padder {
    padding-top: 5%;
  }
  .wheel {
    transform-origin: 50% 50%;
    width: 100%;
    height: 100%;

    border-radius: 100%;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.2);
  }

  .animation {
    animation-name: spin;
    animation: spin calc(var(--spinTime) * 1s)
      cubic-bezier(0.333, 0.666, 0.666, 1) 0s 1 forwards;
  }

  @keyframes spin {
    from {
      transform: rotate(0rad);
    }
    to {
      transform: rotate(calc(var(--revolutionsC) * 2rad * pi));
    }
  }
</style>
