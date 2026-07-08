document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');

    // Fetch the project configuration
    fetch('data/projects.json')
        .then(response => response.json())
        .then(projects => {
            projects.forEach(project => {
                // Dynamically build the cards pointing to project.html?id=...
                const card = document.createElement('div');
                card.className = 'card';
                
                const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

                card.innerHTML = `
                    <div>
                        <h2>${project.title}</h2>
                        <p>${project.tagline}</p>
                        <div class="tags-container">${tagsHTML}</div>
                    </div>
                    <a href="project.html?id=${project.id}" class="btn">View Project Details →</a>
                `;
                grid.appendChild(card);
            });
        })
        .catch(err => console.error('Error loading projects:', err));
});