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
    background-color: #a2e8ff;
    max-width: 500px;
    margin: auto;
    text-align: center;
    box-shadow: 0px 5px 10px 5px rgba(0, 0, 0, 0.15);
    padding: 15px;
    border-radius: 10px;
  }
</style>
