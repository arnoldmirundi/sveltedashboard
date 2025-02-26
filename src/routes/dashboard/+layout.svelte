<script>
  import { page } from '$app/stores';

  let links = [
    { name: "Home", href: "/dashboard" },
    { name: "Report Details", href: "/dashboard/report" },
    { name: "Analysis", href: "/dashboard/analysis" }
  ];
</script>

<style>
  * {
    font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  nav {
  background-color: #003200; 
  padding: 0.5rem 1rem; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px; 
  position: fixed;
  top: 0; 
  left: 0;
  width: 100%;
  z-index: 1000; 
}

body {
  margin: 0; 
  padding: 0; 
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px; 
}

.logo {
  height: 40px;
  width: auto;
  display: block;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  font-family: "Arial", sans-serif; 
}

.nav-links {
  display: flex;
  gap: 15px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  font-size: 1rem;
  font-weight: 500;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
}

.content {
  padding-top: 70px;
}


  @media (max-width: 768px) {
    nav {
      flex-direction: column;
      text-align: center;
    }

    .nav-links {
      margin-top: 10px;
      flex-direction: column;
      gap: 10px;
    }
  }
</style>

<nav>
  <div class="logo-container">
    <img src="/logo.png" alt="Refundhawk logo" class="logo">
    <span class="brand-name">RefundHawk</span>
  </div>

  <div class="nav-links">
    {#each links as link}
    <a href={link.href} class:active={$page?.url?.pathname?.startsWith(link.href)} sveltekit:prefetch>
        {link.name}
      </a>
    {/each}
  </div>
</nav>

<div class="content">
  <slot />
</div>
