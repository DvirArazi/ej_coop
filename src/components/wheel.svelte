<script lang="ts">
    import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  onMount(()=>{
    context = canvas.getContext('2d')!;

    
  });
</script>

