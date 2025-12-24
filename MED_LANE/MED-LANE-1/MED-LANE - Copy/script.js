/* ============================================================================
   MED-LANE JAVASCRIPT - WITH MULTI-AGENT PROCESSING
   ============================================================================ */

// ============================================================================
// SECTION 1: DOM ELEMENT REFERENCES
// ============================================================================

const searchInput = document.getElementById('searchInput');
const drugCardsContainer = document.getElementById('drugCardsContainer');
const drugHistory = document.getElementById('drugHistory');
const dashboardView = document.getElementById('dashboardView');
const researchView = document.getElementById('researchView');
const loadingSpinner = document.getElementById('loadingSpinner');
const researchResults = document.getElementById('researchResults');
const agentProcessingView = document.getElementById('agentProcessingView');

// Research view elements
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const drugNameDisplay = document.getElementById('drugName');
const drugManufacturerDisplay = document.getElementById('drugManufacturer');
const drugEffectsDisplay = document.getElementById('drugEffects');
const drugSideEffectsDisplay = document.getElementById('drugSideEffects');
const drugSafetyDisplay = document.getElementById('drugSafety');
const userModification = document.getElementById('userModification');

// Agent processing elements
const literatureAgent = document.getElementById('literatureAgent');
const patentAgent = document.getElementById('patentAgent');
const safetyAgent = document.getElementById('safetyAgent');
const progressText = document.getElementById('progressText');
const backToDashboardBtn = document.getElementById('backToDashboard');

// Theme toggle
const themeToggle = document.getElementById('themeToggle');


// ============================================================================
// SECTION 2: DATA STORAGE
// ============================================================================

let drugDatabase = [
    {
        id: 1,
        name: 'Aspirin',
        description: 'This is used in pain relief and anti-inflammatory treatment',
        manufacturer: 'Bayer Pharmaceuticals',
        effects: 'Reduces pain, fever, and inflammation',
        sideEffects: 'Stomach irritation, bleeding risk, allergic reactions',
        safety: 'Generally safe with proper dosage. Avoid with bleeding disorders.'
    },
    {
        id: 2,
        name: 'Metformin',
        description: 'This is used in diabetes management and blood sugar control',
        manufacturer: 'Bristol-Myers Squibb',
        effects: 'Lowers blood glucose levels, improves insulin sensitivity',
        sideEffects: 'Nausea, diarrhea, vitamin B12 deficiency',
        safety: 'Well-tolerated. Regular monitoring required for kidney function.'
    },
    {
        id: 3,
        name: 'Lisinopril',
        description: 'This is used in hypertension treatment and heart failure management',
        manufacturer: 'AstraZeneca',
        effects: 'Lowers blood pressure, reduces strain on heart',
        sideEffects: 'Dizziness, dry cough, elevated potassium',
        safety: 'Monitor kidney function and potassium levels regularly.'
    }
];

let researchedDrugs = [];
let currentDrug = null;


// ============================================================================
// SECTION 3: INITIALIZATION
// ============================================================================

function initializeApp() {
    console.log('MED-LANE App Initialized!');
    
    displayDrugCards(drugDatabase);
    setupSearchListener();
    setupDecisionButtons();
    setupThemeToggle();
    setupBackButton();
    
    // Load saved theme preference
    loadThemePreference();
}

document.addEventListener('DOMContentLoaded', initializeApp);


// ============================================================================
// SECTION 4: THEME TOGGLE FUNCTIONALITY
// ============================================================================

function setupThemeToggle() {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        // Update icon
        const icon = themeToggle.querySelector('.theme-icon');
        if (document.body.classList.contains('light-mode')) {
            icon.textContent = '🌙'; // Moon for dark mode option
        } else {
            icon.textContent = '☀️'; // Sun for light mode option
        }
        
        // Save preference to localStorage
        saveThemePreference();
    });
}

function saveThemePreference() {
    const isLightMode = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.querySelector('.theme-icon').textContent = '🌙';
    }
}


// ============================================================================
// SECTION 5: DISPLAYING DRUG CARDS
// ============================================================================

function displayDrugCards(drugs) {
    drugCardsContainer.innerHTML = '';
    
    if (drugs.length === 0) {
        drugCardsContainer.innerHTML = '<p style="color: #777; padding: 20px;">No drugs found</p>';
        return;
    }
    
    drugs.forEach(drug => {
        const card = document.createElement('div');
        card.className = 'drug-card';
        
        card.innerHTML = `
            <h3>${drug.name}</h3>
            <p>${drug.description}</p>
            <button class="repurpose-btn" data-drug-id="${drug.id}">
                REPURPOSE
            </button>
        `;
        
        drugCardsContainer.appendChild(card);
        
        const button = card.querySelector('.repurpose-btn');
        button.addEventListener('click', () => handleRepurposeClick(drug));
    });
}


// ============================================================================
// SECTION 6: SEARCH FUNCTIONALITY
// ============================================================================

function setupSearchListener() {
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        
        const filteredDrugs = drugDatabase.filter(drug => {
            return drug.name.toLowerCase().includes(searchTerm);
        });
        
        displayDrugCards(filteredDrugs);
    });
}


// ============================================================================
// SECTION 7: REPURPOSE CHECK CLICK HANDLER
// ============================================================================

function handleRepurposeClick(drug) {
    console.log('Analyzing drug:', drug.name);
    
    currentDrug = drug;
    
    dashboardView.style.display = 'none';
    researchView.style.display = 'block';
    loadingSpinner.style.display = 'flex';
    researchResults.style.display = 'none';
    
    setTimeout(() => {
        displayResearchResults(drug);
    }, 3000);
    
    if (!researchedDrugs.includes(drug.name)) {
        researchedDrugs.push(drug.name);
        updateResearchHistory();
    }
}


// ============================================================================
// SECTION 8: DISPLAY RESEARCH RESULTS
// ============================================================================

function displayResearchResults(drug) {
    loadingSpinner.style.display = 'none';
    researchResults.style.display = 'block';
    
    drugNameDisplay.textContent = drug.name;
    drugManufacturerDisplay.textContent = drug.manufacturer;
    drugEffectsDisplay.textContent = drug.effects;
    drugSideEffectsDisplay.textContent = drug.sideEffects;
    drugSafetyDisplay.textContent = drug.safety;
    
    userModification.value = '';
}


// ============================================================================
// SECTION 9: RESEARCH HISTORY
// ============================================================================

function updateResearchHistory() {
    drugHistory.innerHTML = '';
    
    researchedDrugs.forEach(drugName => {
        const li = document.createElement('li');
        li.textContent = drugName;
        
        li.addEventListener('click', () => {
            searchInput.value = drugName;
            const event = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(event);
        });
        
        drugHistory.appendChild(li);
    });
}


// ============================================================================
// SECTION 10: YES/NO DECISION BUTTONS
// ============================================================================

function setupDecisionButtons() {
    
    // YES BUTTON - Proceed to Multi-Agent Processing
    yesButton.addEventListener('click', () => {
        const modifications = userModification.value;
        
        if (modifications.trim() === '') {
            alert('Please describe the modifications you want to explore.');
            return;
        }
        
        console.log('Proceeding with drug:', currentDrug.name);
        console.log('User modifications:', modifications);
        
        // Hide research view and show agent processing view
        researchView.style.display = 'none';
        agentProcessingView.style.display = 'block';
        
        // Start the multi-agent processing
        startAgentProcessing(currentDrug, modifications);
    });
    
    // NO BUTTON - Return to dashboard
    noButton.addEventListener('click', () => {
        console.log('User declined to proceed with:', currentDrug.name);
        returnToDashboard();
    });
}


// ============================================================================
// SECTION 11: MULTI-AGENT PROCESSING (NEW!)
// ============================================================================

/* 
   HOW THIS WORKS:
   
   This simulates the three agents (Literature, Patent, Safety) working
   sequentially. Each agent processes its tasks one by one.
   
   CURRENT IMPLEMENTATION (Gimmick):
   - Uses setTimeout to simulate processing time
   - Each agent takes ~10 seconds
   - Tasks complete sequentially with visual feedback
   
   FUTURE IMPLEMENTATION (Phase 2 - Real Backend):
   You would replace the setTimeout calls with actual API calls:
   
   async function processLiteratureAgent(drug, modifications) {
       const response = await fetch('/api/literature-agent', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ drug, modifications })
       });
       return await response.json();
   }
   
   The backend would:
   1. Receive the drug data + user modifications
   2. Trigger the Master Agent/Orchestrator (from your workflow diagram)
   3. Master Agent spawns the three agents in parallel
   4. Each agent does its real work (RAG, vector DB queries, LLM calls)
   5. Backend streams progress updates back (using WebSockets or SSE)
   6. Frontend updates the UI in real-time as tasks complete
   
   For real-time updates, consider:
   - WebSockets: Bidirectional real-time communication
   - Server-Sent Events (SSE): Server pushes updates to client
   - Polling: Frontend periodically checks progress
*/

async function startAgentProcessing(drug, modifications) {
    console.log('Starting multi-agent processing...');
    
    // Reset all agents to initial state
    resetAgentStates();
    
    // Show initial message
    progressText.textContent = 'Initializing agents...';
    backToDashboardBtn.style.display = 'none';
    
    try {
        // Process agents sequentially (one after another)
        await processLiteratureAgent();
        await processPatentAgent();
        await processSafetyAgent();
        
        // All agents completed
        progressText.textContent = '✅ All agents completed successfully! Analysis ready.';
        backToDashboardBtn.style.display = 'inline-block';
        
        console.log('Multi-agent processing complete!');
        
    } catch (error) {
        console.error('Agent processing error:', error);
        progressText.textContent = '❌ An error occurred during processing.';
        backToDashboardBtn.style.display = 'inline-block';
    }
}

function resetAgentStates() {
    // Reset all agent cards
    [literatureAgent, patentAgent, safetyAgent].forEach(agent => {
        agent.classList.remove('processing', 'completed');
        const status = agent.querySelector('.agent-status');
        status.textContent = '⏳ Pending';
        status.classList.remove('processing', 'completed');
        
        // Reset all tasks
        const tasks = agent.querySelectorAll('.agent-tasks li');
        tasks.forEach(task => {
            task.classList.remove('completed', 'failed');
            const statusIcon = task.querySelector('.task-status');
            statusIcon.textContent = '⏳';
        });
    });
}

// ============================================================================
// LITERATURE AGENT PROCESSING
// ============================================================================

async function processLiteratureAgent() {
    console.log('Processing Literature Agent...');
    
    // Mark agent as processing
    literatureAgent.classList.add('processing');
    const litStatus = document.getElementById('litStatus');
    litStatus.textContent = '⚙️ Processing';
    litStatus.classList.add('processing');
    
    progressText.textContent = '📚 Literature Agent analyzing scientific data...';
    
    const tasks = literatureAgent.querySelectorAll('.agent-tasks li');
    const totalTasks = tasks.length;
    const timePerTask = 10000 / totalTasks; // ~10 seconds total
    
    // Process each task sequentially
    for (let i = 0; i < tasks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, timePerTask));
        
        tasks[i].classList.add('completed');
        const statusIcon = tasks[i].querySelector('.task-status');
        statusIcon.textContent = '✅';
        
        console.log(`Literature Agent: Task ${i + 1}/${totalTasks} completed`);
    }
    
    // Mark agent as completed
    literatureAgent.classList.remove('processing');
    literatureAgent.classList.add('completed');
    litStatus.textContent = '✅ Completed';
    litStatus.classList.remove('processing');
    litStatus.classList.add('completed');
    
    console.log('Literature Agent completed!');
}

// ============================================================================
// PATENT AGENT PROCESSING
// ============================================================================

async function processPatentAgent() {
    console.log('Processing Patent Agent...');
    
    patentAgent.classList.add('processing');
    const patStatus = document.getElementById('patStatus');
    patStatus.textContent = '⚙️ Processing';
    patStatus.classList.add('processing');
    
    progressText.textContent = '📋 Patent Agent analyzing intellectual property...';
    
    const tasks = patentAgent.querySelectorAll('.agent-tasks li');
    const totalTasks = tasks.length;
    const timePerTask = 10000 / totalTasks;
    
    for (let i = 0; i < tasks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, timePerTask));
        
        // Simulate one failed task (the freedom-to-operate one with X in your image)
        if (i === 3) { // 4th task
            tasks[i].classList.add('failed');
            const statusIcon = tasks[i].querySelector('.task-status');
            statusIcon.textContent = '❌';
        } else {
            tasks[i].classList.add('completed');
            const statusIcon = tasks[i].querySelector('.task-status');
            statusIcon.textContent = '✅';
        }
        
        console.log(`Patent Agent: Task ${i + 1}/${totalTasks} completed`);
    }
    
    patentAgent.classList.remove('processing');
    patentAgent.classList.add('completed');
    patStatus.textContent = '✅ Completed';
    patStatus.classList.remove('processing');
    patStatus.classList.add('completed');
    
    console.log('Patent Agent completed!');
}

// ============================================================================
// SAFETY AGENT PROCESSING
// ============================================================================

async function processSafetyAgent() {
    console.log('Processing Safety Agent...');
    
    safetyAgent.classList.add('processing');
    const safeStatus = document.getElementById('safeStatus');
    safeStatus.textContent = '⚙️ Processing';
    safeStatus.classList.add('processing');
    
    progressText.textContent = '🛡️ Safety Agent evaluating risk profile...';
    
    const tasks = safetyAgent.querySelectorAll('.agent-tasks li');
    const totalTasks = tasks.length;
    const timePerTask = 10000 / totalTasks;
    
    for (let i = 0; i < tasks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, timePerTask));
        
        tasks[i].classList.add('completed');
        const statusIcon = tasks[i].querySelector('.task-status');
        statusIcon.textContent = '✅';
        
        console.log(`Safety Agent: Task ${i + 1}/${totalTasks} completed`);
    }
    
    safetyAgent.classList.remove('processing');
    safetyAgent.classList.add('completed');
    safeStatus.textContent = '✅ Completed';
    safeStatus.classList.remove('processing');
    safeStatus.classList.add('completed');
    
    console.log('Safety Agent completed!');
}


// ============================================================================
// SECTION 12: NAVIGATION HELPERS
// ============================================================================

function setupBackButton() {
    backToDashboardBtn.addEventListener('click', () => {
        returnToDashboard();
    });
}

function returnToDashboard() {
    researchView.style.display = 'none';
    agentProcessingView.style.display = 'none';
    dashboardView.style.display = 'flex';
    
    currentDrug = null;
    searchInput.value = '';
    displayDrugCards(drugDatabase);
}


// ============================================================================
// SECTION 13: FUTURE BACKEND INTEGRATION TEMPLATE
// ============================================================================

/*
   PHASE 2 IMPLEMENTATION GUIDE:
   
   When you're ready to connect to your backend, here's how to do it:
   
   1. SETUP WEBSOCKET CONNECTION (for real-time updates):
   
   const ws = new WebSocket('ws://your-backend-url.com/agent-processing');
   
   ws.onmessage = (event) => {
       const update = JSON.parse(event.data);
       
       if (update.agent === 'literature' && update.task_completed) {
           updateTaskStatus('literature', update.task_index, 'completed');
       }
       
       if (update.progress_text) {
           progressText.textContent = update.progress_text;
       }
   };
   
   
   2. SEND INITIAL REQUEST:
   
   async function startRealAgentProcessing(drug, modifications) {
       const response = await fetch('/api/start-analysis', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
               drug: drug,
               modifications: modifications
           })
       });
       
       const data = await response.json();
       const sessionId = data.session_id;
       
       // Now listen for updates via WebSocket using this sessionId
   }
   
   
   3. BACKEND STRUCTURE:
   
   Your backend (Python/Node.js) would:
   
   - Receive POST request with drug data
   - Initialize Master Agent/Orchestrator
   - Master Agent spawns three agents in parallel:
     * Literature Agent → Queries vector DB, runs RAG, calls LLM
     * Patent Agent → Searches patent databases, analyzes claims
     * Safety Agent → Checks safety databases, analyzes risks
   - Each agent streams progress updates via WebSocket
   - Frontend receives updates and shows them in real-time
   - When all complete, show final results
   
   
   4. ERROR HANDLING:
   
   Add try-catch blocks around API calls:
   
   try {
       const result = await processAgent();
   } catch (error) {
       showError('Agent processing failed');
       markTaskAsFailed(taskIndex);
   }
*/


// ============================================================================
// DEBUGGING
// ============================================================================

console.log('✅ MED-LANE JavaScript loaded successfully!');
console.log('📊 Available drugs:', drugDatabase.length);
console.log('🎨 Theme system initialized');