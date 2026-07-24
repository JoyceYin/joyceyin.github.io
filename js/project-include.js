document.addEventListener('DOMContentLoaded', function() {
    function loadTemplateAndRender() {
        
        // Fetch the template
        fetch('components/project-card.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Template not found');
                }
                return response.text();
            })
            .then(template => {
                // Clear loading
                const container = document.getElementById('projectCardContainer');
                container.innerHTML = '';
                
                // Generate cards using the template
                projectData.forEach(project => {
                    let cardHTML = template;
                    
                    // Replace placeholders with actual data
                    cardHTML = cardHTML.replace(/\{\{image\}\}/g, project.image);
                    cardHTML = cardHTML.replace(/\{\{imageAlt\}\}/g, project.imageAlt);
                    cardHTML = cardHTML.replace(/\{\{title\}\}/g, project.title);
                    cardHTML = cardHTML.replace(/\{\{description\}\}/g, project.description);
                    if (project.ctaText && project.link) {
                        cardHTML = cardHTML.replace(
                            /\{\{cta\}\}/g,
                            `<a href="${project.link}" class="card-link mb-2">
                                ${project.ctaText} <span class="arrow">→</span>
                            </a>`
                        );
                    } else {
                        cardHTML = cardHTML.replace(/\{\{cta\}\}/g, '');
                    }

                    container.innerHTML += cardHTML;
                });
            })
            .catch(error => {
                console.error('Error loading template:', error);
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <p class="text-danger">Error loading cards. Please try again.</p>
                    </div>
                `;
            });
    }
    loadTemplateAndRender();
});