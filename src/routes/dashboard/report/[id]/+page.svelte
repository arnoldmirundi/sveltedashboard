<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import {goto} from "$app/navigation";
  import { browser } from "$app/environment";

  let reportId;
  let reportData = null;
  let isLoading = true;
  let error = null;
  let sortedSalesByAsin = [];

  let sortCriteria = "shippedUnits-asc"; 

  $: reportId = $page.params.id;

  onMount(async () => {
    try {
      const reportUrl = `/reports/${reportId.endsWith(".csv") ? reportId : reportId + ".csv"}`;
      console.log("Fetching report:", reportUrl);

      const response = await fetch(reportUrl);
      if (!response.ok) throw new Error("Failed to load report");

     reportData = await response.json();

      if (reportData?.salesByAsin) {
        sortedSalesByAsin = [...reportData.salesByAsin];
        sortData(); 
      }
    } catch (err) {
      console.error("Error loading report:", err);
      error = err.message;
    } finally {
      isLoading = false;
    }
  });

  function parseJSON(text) {
    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      return null;
    }
  }

  function goToAnalysis(id) {
    if (!id) {
        console.error("Error: Missing report ID");
        return;
    }

    if (browser) {
        goto(`/dashboard/analysis/${id}`);
    }
}

  function sortData() {
    if (!reportData?.salesByAsin) return;

    const [key, order] = sortCriteria.split("-");
    const isAsc = order === "asc";

    sortedSalesByAsin = [...reportData.salesByAsin].sort((a, b) => {
      return isAsc ? a[key] - b[key] : b[key] - a[key];
    });
  }
</script>

<style>
  :root {
    --bg-color: #121212;
    --text-color: #e0e0e0;
    --accent-color: #00c853;
    --hover-color: #007c3b;
    --card-bg: #1e1e1e;
  }

  .container {
    padding: 2rem;
    max-width: 1000px;
    margin: auto;
    font-family: "Inter", sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 200, 83, 0.2);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .btn {
    padding: 10px 15px;
    border: none;
    border-radius: 6px;
    background: var(--accent-color);
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s;
    text-decoration: none;
  }

  .btn:hover {
    background: var(--hover-color);
  }

  .sort-container {
    margin-bottom: 10px;
  }

  select {
    padding: 8px;
    border-radius: 5px;
    background: var(--card-bg);
    color: var(--text-color);
    border: 1px solid var(--accent-color);
  }

  .table-container {
    overflow-x: auto;
    margin-top: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: var(--card-bg);
    border-radius: 6px;
    overflow: hidden;
  }

  th, td {
    padding: 10px;
    border: 1px solid #444;
    text-align: left;
  }

  th {
    background: var(--accent-color);
    color: black;
  }

  .error {
    color: #ff5252;
    font-weight: bold;
  }
</style>

<div class="container">
  {#if isLoading}
    <p>Loading report...</p>
  {:else if error}
    <p class="error">Error: {error}</p>
  {:else if reportData}
    <div class="header">
      <h2>Report Details: {reportId}</h2>
      <button class="btn" on:click={() => goToAnalysis(reportId)}>Go to Analysis</button>
    </div>

    <h3>Report Metadata</h3>
    <div class="table-container">
      <table>
        <tbody>
          <tr><th>Report Type</th><td>{reportData.reportSpecification?.reportType}</td></tr>
          <tr><th>Report Period</th><td>{reportData.reportSpecification?.reportOptions?.reportPeriod}</td></tr>
          <tr><th>Last Updated</th><td>{reportData.reportSpecification?.lastUpdatedDate}</td></tr>
          <tr><th>Data Start</th><td>{reportData.reportSpecification?.dataStartTime}</td></tr>
          <tr><th>Data End</th><td>{reportData.reportSpecification?.dataEndTime}</td></tr>
          <tr><th>Marketplace ID</th><td>{reportData.reportSpecification?.marketplaceIds?.join(", ")}</td></tr>
        </tbody>
      </table>
    </div>

    <h3>Sales Summary</h3>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Customer Returns</th>
            <th>Shipped Units</th>
            <th>Shipped Revenue (USD)</th>
            <th>Shipped COGS (USD)</th>
          </tr>
        </thead>
        <tbody>
          {#each reportData.salesAggregate as sale}
            <tr>
              <td>{sale.startDate}</td>
              <td>{sale.endDate}</td>
              <td>{sale.customerReturns}</td>
              <td>{sale.shippedUnits}</td>
              <td>${sale.shippedRevenue.amount}</td>
              <td>${sale.shippedCogs.amount}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <h3>Sales by ASIN</h3>

    <div class="sort-container">
      <label for="sort">Sort By: </label>
      <select id="sort" bind:value={sortCriteria} on:change={sortData}>
        <option value="shippedUnits-asc">Shipped Units (Ascending)</option>
        <option value="shippedUnits-desc">Shipped Units (Descending)</option>
        <option value="customerReturns-asc">Customer Returns (Ascending)</option>
        <option value="customerReturns-desc">Customer Returns (Descending)</option>
      </select>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ASIN</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Customer Returns</th>
            <th>Shipped Units</th>
            <th>Shipped Revenue (USD)</th>
            <th>Shipped COGS (USD)</th>
          </tr>
        </thead>
        <tbody>
          {#each sortedSalesByAsin as asin}
            <tr>
              <td>{asin.asin}</td>
              <td>{asin.startDate}</td>
              <td>{asin.endDate}</td>
              <td>{asin.customerReturns}</td>
              <td>{asin.shippedUnits}</td>
              <td>${asin.shippedRevenue.amount}</td>
              <td>${asin.shippedCogs.amount}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
