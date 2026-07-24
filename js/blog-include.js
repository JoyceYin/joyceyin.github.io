// Main JavaScript - Renders cards from the single component template

document.addEventListener('DOMContentLoaded', function() {
    
    // Option 1: Using fetch to load the card template
    function loadCardsFromTemplate() {
        fetch('components/blog-card.html')
            .then(response => response.text())
            .then(template => {
                const container = document.getElementById('cardContainer');
                container.innerHTML = '';
                cardData.forEach(card => {
                    let cardHTML = template;
                    
                    // Replace placeholders with actual data
                    cardHTML = cardHTML.replace(/\{\{image\}\}/g, card.image);
                    cardHTML = cardHTML.replace(/\{\{imageAlt\}\}/g, card.imageAlt);
                    cardHTML = cardHTML.replace(/\{\{title\}\}/g, card.title);
                    cardHTML = cardHTML.replace(/\{\{description\}\}/g, card.description);
                    cardHTML = cardHTML.replace(/\{\{badge\}\}/g, card.badge || '');
                    cardHTML = cardHTML.replace(/\{\{link\}\}/g, card.link);
                    cardHTML = cardHTML.replace(/\{\{ctaText\}\}/g, card.ctaText);
                    
                    // Remove badge if null
                    if (!card.badge) {
                        cardHTML = cardHTML.replace(
                            /<span class="badge bg-success mb-3 px-3 py-2">.*?<\/span>/,
                            ''
                        );
                    }
                    
                    container.innerHTML += cardHTML;
                });
            })
            .catch(error => console.error('Error loading card template:', error));
    }
    loadCardsFromTemplate();
});