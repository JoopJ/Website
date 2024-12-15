const terminalOutput = document.getElementById('js-terminal-output');
const contentDiv = document.getElementById('js-content');
const commandInput = document.getElementById('js-command');
const maxLines = getComputedStyle(document.body).getPropertyValue('--max-lines');

commandInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const command = this.value;
        handleCommand(command);
        this.value = ''; // clear input
    }
});

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
        case 'personal projects':
            addOutput("Loading personal projects...");
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
                console.log("i " + firstChildText[i])
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
        <p>Name: Joshua Oppenheimer</p>
        <p>Contact: <a href="mailto:jppnhmr@gmail.com">jppnhmr@gmail.com</a></p> 
        <p>Description: Software Engineer</p>

        <h3>Skills</h3>
        <h4>Programming Languages</h4>£@£
        <ul>
            <li>Python</li>
            <li>C++</li>
            <li>C#</li>
            <li>HTML</li>
        </ul>
        <h4>Frameworks</h4>
        <ul>
            <li>Flask</li>
        </ul>
        <h4>Tools</h4>
        <ul>
            <li>Git</li>
            <li>VS Code</li>
            <li>Unity</li>
            <li>Godot</li>
    `;    
}
