<script>
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  if (browser) {
      goto('/login');
  }
</script>
