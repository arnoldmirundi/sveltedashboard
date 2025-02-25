<script>
    import { onMount, afterUpdate } from "svelte";
    import { page } from "$app/stores";
    import Chart from 'chart.js/auto';

    let reportId;
    let reportData = null;
    let isLoading = true;
    let error = null;
    let customerReturnsChart, shippedUnitsChart, shippedRevenueChart;

    $: reportId = $page.params.id;

    onMount(async () => {
        try {
            const reportUrl = `/reports/${reportId.endsWith(".csv") ? reportId : reportId + ".csv"}`;
            console.log("Fetching report:", reportUrl);

            const response = await fetch(reportUrl);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to load report: ${response.status} - ${errorText}`);
            }

            reportData = await response.json();

        } catch (err) {
            console.error("Error loading report:", err);
            error = err.message;
        } finally {
            isLoading = false;
        }
    });

    afterUpdate(() => {
        if (reportData && Array.isArray(reportData.salesByAsin) && !customerReturnsChart) {
            createCharts();
        }
    });

    function createCharts() {
        if (!reportData || !reportData.salesByAsin || reportData.salesByAsin.length === 0) {
            console.error("Error: Report data is incomplete or empty for charts.");
            return;
        }

        const labels = reportData.salesByAsin.map(item => item.asin);
        const customerReturns = reportData.salesByAsin.map(item => item.customerReturns || 0);
        const shippedUnits = reportData.salesByAsin.map(item => item.shippedUnits || 0);
        const shippedRevenue = reportData.salesByAsin.map(item => item.shippedRevenue?.amount || 0);

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#ddd' } } },
            scales: {
                x: { title: { display: true, text: 'ASIN' }, ticks: { color: '#ccc' }, grid: { color: '#444' } },
                y: { ticks: { color: '#ccc' }, grid: { color: '#444' } }
            }
        };

        if (customerReturnsChart) customerReturnsChart.destroy();
        if (shippedUnitsChart) shippedUnitsChart.destroy();
        if (shippedRevenueChart) shippedRevenueChart.destroy();

        const createChart = (ctx, type, data, label, color) => {
            if (ctx) {
                return new Chart(ctx, {
                    type,
                    data: { labels, datasets: [{ label, data, backgroundColor: color }] },
                    options: chartOptions
                });
            }
            return null;
        };

        customerReturnsChart = createChart(document.getElementById('customerReturnsChart'), 'bar', customerReturns, 'Customer Returns', '#ff4444');
        shippedUnitsChart = createChart(document.getElementById('shippedUnitsChart'), 'bar', shippedUnits, 'Shipped Units', '#4287f5');
        shippedRevenueChart = createChart(document.getElementById('shippedRevenueChart'), 'bar', shippedRevenue, 'Shipped Revenue ($)', '#4caf50');
    }

</script>

<style>
    .container {
        max-width: 1000px;
        margin: auto;
        padding: 20px;
        font-family: "Inter", sans-serif;
        background-color: #121212;
        color: #e0e0e0;
        border-radius: 8px;
        box-shadow: 0px 0px 10px rgba(0, 200, 83, 0.2);
    }

    h2 {
        color: #00c853; 
        margin-bottom: 1rem;
    }

    .chart-container {
        position: relative;
        height: 300px;
        margin-top: 20px;
        background: #222;
        padding: 10px;
        border-radius: 8px;
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
    {:else if reportData && reportData.salesByAsin}
        <h2>Report Charts: {reportId}</h2>

        <h3>Customer Returns</h3>
        <div class="chart-container"><canvas id="customerReturnsChart"></canvas></div>

        <h3>Shipped Units</h3>
        <div class="chart-container"><canvas id="shippedUnitsChart"></canvas></div>

        <h3>Shipped Revenue</h3>
        <div class="chart-container"><canvas id="shippedRevenueChart"></canvas></div>
    {/if}
</div>