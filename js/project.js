document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        window.location.href = 'index.html';
        return;
    }

    fetch('data/projects.json')
        .then(response => response.json())
        .then(projects => {
            const project = projects.find(p => p.id === projectId);

            if (!project) {
                document.getElementById('project-title').innerText = "Project Not Found";
                return;
            }

            // 1. DYNAMIC COLOR EMISSION: Injects custom colors straight into root CSS context
            if (project.theme) {
                const root = document.documentElement;
                root.style.setProperty('--bg-color', project.theme.bg);
                root.style.setProperty('--card-bg', project.theme.cardBg);
                root.style.setProperty('--accent', project.theme.accent);
                root.style.setProperty('--accent-hover', project.theme.accentHover);
            }

            // 2. TEXT & FIELD DATA EXTRACTION
            document.title = `${project.title} | Details`;
            document.getElementById('project-title').innerText = project.title;
            document.getElementById('project-tagline').innerText = project.tagline;
            document.getElementById('project-description').innerText = project.description;
            
            // Map Tags
            const tagsContainer = document.getElementById('project-tags');
            tagsContainer.innerHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

            // 3. DYNAMIC IMAGE GENERATOR: Loop and render every photo in the JSON array
            const galleryContainer = document.getElementById('project-gallery');
            galleryContainer.innerHTML = ''; // Wipe load buffer text
            
            if (project.images && project.images.length > 0) {
                project.images.forEach((imgUrl, index) => {
                    const imgElement = document.createElement('img');
                    imgElement.src = imgUrl;
                    imgElement.alt = `${project.title} Demonstration Screenshot ${index + 1}`;
                    imgElement.className = 'gallery-img';
                    imgElement.loading = 'lazy'; // Optimizes layout performance loading speed
                    galleryContainer.appendChild(imgElement);
                });
            }

            // Links setup
            document.getElementById('project-github').href = project.github;
            document.getElementById('project-live').href = project.live;
        })
        .catch(err => {
            console.error('Data read exception:', err);
            document.getElementById('project-title').innerText = "Error Loading Content";
        });
});