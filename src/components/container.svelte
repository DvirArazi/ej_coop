<script lang="ts">
</script>

<div class="outer">
  <div class="inner">
    <slot />
  </div>
</div>

<style>
  .outer {
    padding: 0 10px;
  }
  .inner {
    border: solid black 3px;
    background-color: #a2e8ff;
    max-width: 500px;
    margin: auto;
    text-align: center;
    box-shadow: 10px 10px 0px 0px rgba(0, 0, 0, 1);
    padding: 15px;
    border-radius: 10px;
  }
</style>
