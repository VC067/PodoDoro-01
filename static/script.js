let timer;
let timeLeft = 1500; // 25 minutes in seconds
let isRunning = false;

const timerElement = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const timerTabs = document.querySelectorAll('.timerTab');

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.textContent = 'PAUSE';
        timer = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft === 0) {
                clearInterval(timer);
                isRunning = false;
                startBtn.textContent = 'START';
            }
        }, 1000);
    } else {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = 'START';
    }
}

startBtn.addEventListener('click', startTimer);

timerTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        timerTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        timeLeft = parseInt(tab.dataset.time);
        updateTimer();
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = 'START';
        
        // Change background color based on selected tab
        if (tab.textContent === 'Pomodoro') {
            document.body.style.backgroundColor = '#d95550';
        } else if (tab.textContent === 'Short Break') {
            document.body.style.backgroundColor = '#4c9195';
        } else if (tab.textContent === 'Long Break') {
            document.body.style.backgroundColor = '#457ca3';
        }
    });
});

updateTimer();

// Task management
const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');

function addTask() {
    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.placeholder = 'What are you working on?';
    taskInput.style.width = '100%';
    taskInput.style.padding = '10px';
    taskInput.style.marginBottom = '10px';
    taskInput.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    taskInput.style.border = 'none';
    taskInput.style.borderRadius = '5px';
    taskInput.style.color = 'white';

    taskList.appendChild(taskInput);
    taskInput.focus();

    taskInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            const taskText = this.value.trim();
            if (taskText) {
                const taskElement = document.createElement('div');
                taskElement.textContent = taskText;
                taskElement.style.padding = '10px';
                taskElement.style.marginBottom = '10px';
                taskElement.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                taskElement.style.borderRadius = '5px';
                taskList.replaceChild(taskElement, this);
            } else {
                taskList.removeChild(this);
            }
        }
    });
}

const settingBtn = document.getElementById('settingBtn');
const settingsOverlay = document.getElementById('settingsOverlay');
const closeSettings = document.getElementById('closeSettings');
const saveSettings = document.getElementById('saveSettings');

settingBtn.addEventListener('click', () => {
    settingsOverlay.style.display = 'block';
});

closeSettings.addEventListener('click', () => {
    settingsOverlay.style.display = 'none';
});

saveSettings.addEventListener('click', () => {
    // Here you would typically save the settings to localStorage or send them to a server
    console.log('Settings saved!');
    settingsOverlay.style.display = 'none';
});

// Close the settings panel if the user clicks outside of it
settingsOverlay.addEventListener('click', (e) => {
    if (e.target === settingsOverlay) {
        settingsOverlay.style.display = 'none';
    }
});

// Add event listeners for all the settings inputs to update the app's behavior
document.getElementById('pomodoroTime').addEventListener('change', (e) => {
    // Update the Pomodoro time
    const newTime = parseInt(e.target.value) * 60;
    timerTabs[0].dataset.time = newTime;
    if (timerTabs[0].classList.contains('active')) {
        timeLeft = newTime;
        updateTimer();
    }
});

// Similar event listeners for shortBreakTime and longBreakTime

document.getElementById('autoStartBreaks').addEventListener('change', (e) => {
    // Implement auto-start breaks functionality
});

document.getElementById('autoStartPomodoros').addEventListener('change', (e) => {
    // Implement auto-start pomodoros functionality
});

// Add more event listeners for other settings as needed

// Implement color theme changing
const colorThemes = document.querySelectorAll('.color-theme');
colorThemes.forEach(theme => {
    theme.addEventListener('click', () => {
        document.body.style.backgroundColor = theme.style.backgroundColor;
    });
});

addTaskBtn.addEventListener('click', addTask);