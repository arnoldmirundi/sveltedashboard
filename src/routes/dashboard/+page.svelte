<script>
  import { onMount } from "svelte";

  let reports = [];
  let isLoading = true;
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch("/reports/index.json");
      if (!response.ok) throw new Error("Failed to fetch reports");

      const fileNames = await response.json();

      reports = fileNames.map(file => ({
        name: `Report ${file.replace(".csv", "").replace("report_", "")}`, 
        id: file.replace(".csv", "") 
      }));

      console.log("Transformed Reports:", reports); 
    } catch (err) {
      console.error("Error fetching reports:", err);
      error = err.message;
    } finally {
      isLoading = false;
    }
  });
</script>

<style>
  :root {
    --bg-color: #121212;
    --text-color: #e0e0e0;
    --accent-color: #00c853;
    --hover-color: #007c3b;
  }

  .container {
    padding: 2rem;
    max-width: 600px;
    margin: auto;
    font-family: "Inter", sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 200, 83, 0.2);
  }

  h2 {
    text-align: center;
    border-bottom: 2px solid var(--accent-color);
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    background: #1e1e1e;
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.3s ease-in-out;
  }

  li:hover {
    background: #292929;
  }

  a {
    text-decoration: none;
    color: var(--accent-color);
    font-weight: bold;
    padding: 6px 10px;
    border-radius: 4px;
    transition: background 0.3s ease-in-out;
  }

  a:hover {
    background: var(--hover-color);
    color: #fff;
  }

  .error {
    color: #ff5252;
    text-align: center;
    font-weight: bold;
  }

  .empty-msg {
    text-align: center;
    font-size: 1.2rem;
    margin-top: 2rem;
    color: #888;
  }
</style>

<div class="container">
  <h2>Available Reports</h2>

  {#if isLoading}
    <p>Loading reports...</p>
  {:else if error}
    <p class="error">Error: {error}</p>
  {:else if reports.length > 0}
    <ul>
      {#each reports as report}
        <li>
          <span>{report.name}</span>
          <a href={`/dashboard/report/${report.id}`}>View Report</a>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="empty-msg">No reports available.</p>
  {/if}
</div>
