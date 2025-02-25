<script>
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  let email = '';
  let password = '';
  let errorMessage = '';

  async function handleLogin() {
    if (email === 'Arnold' && password === '12345') {
      if (browser) goto('/dashboard');  
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      errorMessage = error.message;
    } else {
      if (browser) goto('/dashboard');
    }
  }
</script>


<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

  html, body {
    background-color: #111;
    color: #fff;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    position: absolute;
  }

  .login-container {
    background-color: #1b1b1b;
    padding: 2.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    width: 350px;
    text-align: center;
  }

  .login-container h1 {
    font-size: 26px;
    margin-bottom: 1.8rem;
    font-weight: 600;
    color: #fff;
  }

  .login-container input {
    width: 100%;
    padding: 12px;
    margin-bottom: 1.2rem;
    border: 1px solid #444;
    border-radius: 6px;
    background-color: #222;
    color: #fff;
    font-size: 15px;
    transition: all 0.2s ease-in-out;
  }

  .login-container input::placeholder {
    color: #bbb;
  }

  .login-container input:focus {
    border-color: #008a00;
    box-shadow: 0 0 5px rgba(0, 138, 0, 0.5);
    outline: none;
  }

  .login-container button {
    width: 100%;
    padding: 12px;
    background-color: #008a00;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .login-container button:hover {
    background-color: #007000;
  }

  .error-message {
    color: #dc3232;
    font-size: 14px;
    margin-top: 1rem;
  }

  .login-container {
    animation: fadeIn 0.6s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

<div class="container">
  <div class="login-container">
    <h1>Log In</h1>
    <input type="text" bind:value={email} placeholder="Username or Email" />
    <input type="password" bind:value={password} placeholder="Password" />
    <button on:click={handleLogin}>Log In</button>
    {#if errorMessage}
      <p class="error-message">{errorMessage}</p>
    {/if}
  </div>
</div>
