<script lang="ts">
  import { onMount } from "svelte";
  import { DIE_RESOLUTION } from "/@src/shared/constants";

  export let persNames: string[];
  export let failRatio: number;
  export let tiltAngle: number;

  const w = 500;
  const h = 500;
  const skull = new Image();
  skull.src = "/svgs/skull.svg";

  let wheelCanvas: HTMLCanvasElement;
  let wCtx: CanvasRenderingContext2D;
  let pointerCanvas: HTMLCanvasElement;
  let pCtx: CanvasRenderingContext2D;

  onMount(() => {
    skull.onload = () => {
      wCtx = wheelCanvas.getContext("2d")!;

      const alpha = (2 * Math.PI * (1 - failRatio) * 0.5) / persNames.length;
      for (let i = 0; i < persNames.length; i++) {
        drawDoubleSlice(1.5 * Math.PI, alpha, "#b3ecff", "#66d9ff", i);
        drawName(i, alpha);
      }

      const beta = Math.PI / DIE_RESOLUTION;
      for (let i = 0; i < failRatio * DIE_RESOLUTION; i++) {
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
    };
  });

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
      wCtx.arc(0.5 * w, 0.5 * h, 0.5 * w, from, to);
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
    class="wheel"
    bind:this={wheelCanvas}
    width={w}
    height={h}
    style={`transform: rotate(${tiltAngle}rad);`}
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
</style>
