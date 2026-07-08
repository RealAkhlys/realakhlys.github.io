document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');

    fetch('data/projects.json')
        .then(response => response.json())
        .then(projects => {
            projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'card';
                
                // Customize card slightly based on individual theme elements if desired
                if(project.theme) {
                    card.style.borderColor = project.theme.accent + '40'; // 25% opacity border
                }
                
                const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

                card.innerHTML = `
                    <div>
                        <h2>${project.title}</h2>
                        <p>${project.tagline}</p>
                        <div class="tags-container">${tagsHTML}</div>
                    </div>
                    <a href="project.html?id=${project.id}" class="btn" style="color: ${project.theme?.accent || '#fff'}">View Details →</a>
                `;
                grid.appendChild(card);
            });
        })
        .catch(err => console.error('Error rendering primary portfolio panel:', err));
});