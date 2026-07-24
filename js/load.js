// ===== LOADING CONTROLS =====
document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Option 1: Hide after page loads (default)
    window.addEventListener('load', function() {
        setTimeout(function() {
            loadingOverlay.classList.add('hidden');
        }, 500); // Small delay for smooth transition
    });

    
    // Example: Show loading when fetching data
    async function fetchData() {
        showLoading();
        try {
            const response = await fetch('/api/data');
            const data = await response.json();
            // Process data...
        } catch (error) {
            console.error('Error:', error);
        } finally {
            hideLoading();
        }
    }
});