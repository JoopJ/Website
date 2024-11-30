const terminalContainer = document.getElementById('js-terminal');
const terminalInput = document.getElementById('js-terminal-input');
const terminalOutput = document.getElementById('js-terminal-output');
const contentDiv = document.getElementById('js-content');
const commandInput = document.getElementById('js-command');
let maxLines = maxLinesFunc();

commandInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const command = this.value;
        handleCommand(command);
        this.value = ''; // clear input
    }
});

// On orientation change work out maxLines again (since height will have changed)
window.addEventListener("orientationchange", () => {
    // Needs timeout to work properly
    setTimeout(() => {
        maxLines = maxLinesFunc()
    })
});

// Function to work out maximum lines based on screen height and width
function maxLinesFunc() {
    const terminalHeight = terminalContainer.offsetHeight;
    const terminalInputHeight = terminalInput.offsetHeight;
    const paddingHeight = getComputedStyle(terminalContainer).getPropertyValue("padding").replace("px", "");
    const useableHeight = terminalHeight - terminalInputHeight - paddingHeight;
    let wrapModifier;

    // Wrap modifier is a temp fix for dealing with maxLines and wrapping on mobile. Ruins lines getting deleted nicely and required hardcoded cutoffs.
    if(window.screen.width < 500) {
        wrapModifier = 2;
    } else if(window.screen.width < 329) {
        wrapModifier = 3
    }

    let totalLines = Math.floor((useableHeight/19.5)/wrapModifier)

    return totalLines;
}

function handleCommand(command) {

    // Add the command and its result to the terminal output
    addOutput(`$ ${command}`);
    switch (command.toLowerCase()) {
        case 'help':
            addOutput("Commands:\n - profile\n - portfolio\n - projects\n - photos\n - games");
            break;
        case 'profile':
            addOutput("Loading profile...");
            loadProfile();
            break;
        case 'portfolio':
            addOutput("Loading portfolio...");
            contentDiv.innerHTML = "<h2>My Portfolio</h2><p>Details about my portfolio here...</p>";
            break;
        case 'projects':
            addOutput("Loading projects...");
            contentDiv.innerHTML = "<h2>Personal Projects</h2><p>Details about my projects here...</p>";
            break;
        case 'photos':
            addOutput("Loading photos...");
            contentDiv.innerHTML = "<h2>Photos</h2><p>My gallery here...</p>";
            break;
        case 'games':
            addOutput("Loading games...");
            contentDiv.innerHTML = "<h2>Games</h2><p>My game projects here...</p>";
            break;
        default:
            addOutput("Unknown command. Type 'help' for available commands.");
    }
}

function addOutput(text) {
    const newOutput = document.createElement('div');
    newOutput.className = 'terminal-output';
    newOutput.textContent = text;
    terminalOutput.appendChild(newOutput);

    // Remove lines until within maxLines limit
    removeLines(countLines());
}

// Function to count the number of lines
function countLines() {
    let numLines = 0;
    for(let i=0; i < terminalOutput.children.length; i++) {
        numLines += terminalOutput.children[i].innerHTML.split(/\n/).length;
    }
    return numLines;
}

// Remove Lines
function removeLines(numLines) {
    if(numLines > maxLines) {
        let firstChildText = terminalOutput.firstChild.innerHTML;

        // Get total number of lines in the first Child
        let firstChildLen = firstChildText.split(/\n/).length;

        // If the number of lines to be deleted is less than the number of lines in the first element
        if(firstChildLen >= (numLines-maxLines)) {

            // Then split the first element around new lines
            firstChildText = firstChildText.split(/\n/);

            // Take the lines required
            firstChildText = firstChildText.slice(numLines-maxLines, firstChildLen);

            // Add the paragraph spaces back in
            for(let i=0; i<firstChildText.length-1; i++) {
                firstChildText[i] = firstChildText[i] + "\n";
            }
            // Join into a string and set it as the html
            terminalOutput.firstChild.innerHTML = firstChildText.join("");
            
        }
        // Otherwise just remove the child and call the function again to check enough lines have been removed
        else {
            terminalOutput.removeChild(terminalOutput.firstChild);
            removeLines(countLines());
        }
    }
}

// Pages
function loadProfile() {
    contentDiv.innerHTML = `
        <h2>My Profile</h2>
        <p>Name: </p>
        <p>Contact: </p> 
        <p>Description: </p>

        <h3>Skills</h3>
        <h4>Programming Languages</h4>£@£
        <ul>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
        </ul>
        <h4>Frameworks</h4>
        <ul>
            <li>...</li>
        </ul>
        <h4>Tools</h4>
        <ul>
            <li>...</li>
            <li>...</li>
            <li>...</li>
            <li>...</li>
    `;    
}


// Click anywhere and have it focus on the textbox
let terminal = document.getElementById("js-terminal")

terminal.addEventListener('click', () => {
    commandInput.focus();
})