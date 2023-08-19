<script lang="ts">
  import { page } from "$app/stores";
</script>

<div>{$page.status}</div>
<div>{$page.error?.message}</div>
