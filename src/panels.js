let activePanels = [true, true, true, true];  // Initially, all panels are active

function togglePanel(panelIndex) {
    if (!activePanels[panelIndex] || activePanels.filter(Boolean).length > 1) {
        activePanels[panelIndex] = !activePanels[panelIndex];
        updateGrid();
    }
}

function updateGrid() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';  // Clear existing panels
    
    activePanels.forEach((isActive, index) => {
        if (isActive) {
            const panel = document.createElement('div');
            panel.classList.add('panel');
            panel.innerHTML = `<div class="panel-title">${settings.panelTitles[index]}</div><canvas></canvas>`;
            // Setup Fabric.js canvas within panel...
            gridContainer.appendChild(panel);
        }
    });

    // Update grid columns based on active panel count
    const activePanelCount = activePanels.filter(Boolean).length;
    gridContainer.style.gridTemplateColumns = `repeat(${activePanelCount}, 1fr)`;
}

updateGrid();  // Initial grid setup
