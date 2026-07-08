document.addEventListener('DOMContentLoaded', () => {
    // 1. Extract the project ID from the URL (e.g., project.html?id=task-manager)
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        window.location.href = 'index.html'; // Redirect home if no ID found
        return;
    }

    // 2. Fetch data and map it to the active ID
    fetch('data/projects.json')
        .then(response => response.json())
        .then(projects => {
            const project = projects.find(p => p.id === projectId);

            if (!project) {
                document.getElementById('project-title').innerText = "Project Not Found";
                return;
            }

            // 3. Inject the project details into the template elements
            document.title = `${project.title} | Portfolio`;
            document.getElementById('project-title').innerText = project.title;
            document.getElementById('project-tagline').innerText = project.tagline;
            document.getElementById('project-description').innerText = project.description;
            
            // Map tags
            const tagsContainer = document.getElementById('project-tags');
            tagsContainer.innerHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

            // Setup buttons
            document.getElementById('project-github').href = project.github;
            document.getElementById('project-live').href = project.live;
        })
        .catch(err => {
            console.error('Error loading project details:', err);
            document.getElementById('project-title').innerText = "Error Loading Content";
        });
});