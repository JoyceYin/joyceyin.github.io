// Load header and footer with Bootstrap
document.addEventListener('DOMContentLoaded', function() {
    // Load Header
    fetch('/components/header.html')
        .then(response => {
            if (!response.ok) throw new Error('Header not found');
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            // Highlight active page
            highlightActiveLink();
            loadPDF();

            // Initialize Bootstrap JS components if needed
            if (typeof bootstrap !== 'undefined') {
                // Bootstrap will auto-initialize
            }
        })
        .catch(error => console.error('Error loading header:', error));
    
    // Load Footer
    fetch('/components/footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Footer not found');
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
            // Update copyright year
            updateCopyrightYear();
        })
        .catch(error => console.error('Error loading footer:', error));
});

// Highlight active navigation link
function highlightActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log(currentPage)
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Update copyright year
function updateCopyrightYear() {
    const yearElement = document.querySelector('.footer .copyright-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Alternative: update text containing 2026
    const footerText = document.querySelector('.footer p.mb-0');
    if (footerText) {
        const year = new Date().getFullYear();
        footerText.textContent = footerText.textContent.replace('2026', year);
    }
}

function loadPDF() {
    const pdfModal = document.getElementById('pdfModal');
    const openBtn = document.getElementById('openPdfBtn');
    const overlay = document.getElementById('pdfModalOverlay');
    
    // Open PDF Modal
    if (openBtn) {
        openBtn.addEventListener('click', function(e) {
            console.log("in")
            e.preventDefault();
            pdfModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    }
    
    // Close functions
    function closePdfModal() {
        pdfModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }
    
    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', closePdfModal);
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
            closePdfModal();
        }
    });
}