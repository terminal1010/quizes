// EdTechX SciQuiz - Interactive Physics & Chemistry Learning Platform
// JavaScript Implementation

let currentUser = null;
let currentView = 'dashboard';
let quizData = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let quizScore = 0;
let quizTimer = null;
let timeRemaining = 600; // 10 minutes in seconds
let userStats = {
    totalScore: 1250,
    quizzesTaken: 15,
    accuracy: 78,
    streak: 7
};

// Dark Mode Variables
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Sample quiz data
const physicsQuestions = [
    {
        id: 1,
        subject: 'Physics',
        question: 'If F = ma, what is the force on a 2 kg mass with 3 m/s² acceleration?',
        options: ['5 N', '6 N', '7 N', '8 N'],
        correctAnswer: 1,
        explanation: 'Using Newton\'s second law: F = ma = 2 kg × 3 m/s² = 6 N',
        difficulty: 'Easy'
    },
    {
        id: 2,
        subject: 'Physics',
        question: 'What is the SI unit of electric current?',
        options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
        correctAnswer: 1,
        explanation: 'The SI unit of electric current is the Ampere (A), named after French physicist André-Marie Ampère.',
        difficulty: 'Easy'
    },
    {
        id: 3,
        subject: 'Physics',
        question: 'Which law states that every action has an equal and opposite reaction?',
        options: ['Newton\'s First Law', 'Newton\'s Second Law', 'Newton\'s Third Law', 'Law of Gravitation'],
        correctAnswer: 2,
        explanation: 'Newton\'s Third Law of Motion states that for every action, there is an equal and opposite reaction.',
        difficulty: 'Medium'
    },
    {
        id: 4,
        subject: 'Physics',
        question: 'What is the speed of light in a vacuum?',
        options: ['299,792,458 m/s', '300,000,000 m/s', '299,000,000 m/s', '301,000,000 m/s'],
        correctAnswer: 0,
        explanation: 'The speed of light in a vacuum is exactly 299,792,458 meters per second, a fundamental constant in physics.',
        difficulty: 'Easy'
    },
    {
        id: 5,
        subject: 'Physics',
        question: 'Which particle is responsible for carrying the electromagnetic force?',
        options: ['Gluon', 'Photon', 'W Boson', 'Z Boson'],
        correctAnswer: 1,
        explanation: 'The photon is the gauge boson for electromagnetism and is responsible for carrying the electromagnetic force.',
        difficulty: 'Hard'
    }
];

const chemistryQuestions = [
    {
        id: 6,
        subject: 'Chemistry',
        question: 'What is the atomic number of Carbon?',
        options: ['6', '12', '14', '8'],
        correctAnswer: 0,
        explanation: 'Carbon has an atomic number of 6, meaning it has 6 protons in its nucleus.',
        difficulty: 'Easy'
    },
    {
        id: 7,
        subject: 'Chemistry',
        question: 'Which element has the chemical symbol "Au"?',
        options: ['Silver', 'Gold', 'Argon', 'Aluminum'],
        correctAnswer: 1,
        explanation: 'The chemical symbol "Au" comes from the Latin word for gold, "aurum".',
        difficulty: 'Easy'
    },
    {
        id: 8,
        subject: 'Chemistry',
        question: 'What is the pH of a neutral solution at 25°C?',
        options: ['0', '7', '14', '10'],
        correctAnswer: 1,
        explanation: 'A pH of 7 indicates a neutral solution, where the concentration of H+ ions equals that of OH- ions.',
        difficulty: 'Medium'
    },
    {
        id: 9,
        subject: 'Chemistry',
        question: 'Which gas is responsible for the greenhouse effect?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Helium'],
        correctAnswer: 2,
        explanation: 'Carbon dioxide is a major greenhouse gas that traps heat in the Earth\'s atmosphere.',
        difficulty: 'Medium'
    },
    {
        id: 10,
        subject: 'Chemistry',
        question: 'What type of bond involves the sharing of electron pairs between atoms?',
        options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
        correctAnswer: 1,
        explanation: 'A covalent bond involves the sharing of electron pairs between atoms, typically between nonmetals.',
        difficulty: 'Medium'
    }
];

// Sample topics data
const topics = {
    physics: [
        { name: 'Mechanics', progress: 75, questions: 50 },
        { name: 'Thermodynamics', progress: 45, questions: 30 },
        { name: 'Electromagnetism', progress: 60, questions: 40 },
        { name: 'Optics', progress: 30, questions: 25 },
        { name: 'Modern Physics', progress: 20, questions: 20 }
    ],
    chemistry: [
        { name: 'Atomic Structure', progress: 80, questions: 35 },
        { name: 'Chemical Bonding', progress: 65, questions: 30 },
        { name: 'Stoichiometry', progress: 70, questions: 40 },
        { name: 'Organic Chemistry', progress: 40, questions: 50 },
        { name: 'Thermochemistry', progress: 55, questions: 25 }
    ]
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateDashboard();
});

// Initialize the application
function initializeApp() {
    // Initialize dark mode first
    initTheme();
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('edtechxUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserProfile();
    }
    
    // Initialize charts
    initializeCharts();
    
    // Populate topics
    populateTopics();
    
    // Set initial view
    showView('dashboard');
}

// Set up event listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('nav-dashboard').addEventListener('click', () => showView('dashboard'));
    document.getElementById('nav-quiz').addEventListener('click', () => showQuizConfig());
    document.getElementById('nav-progress').addEventListener('click', () => showView('progress'));
    document.getElementById('nav-topics').addEventListener('click', () => showView('topics'));
    document.getElementById('nav-achievements').addEventListener('click', () => showView('achievements'));
    
    // Auth buttons
    document.getElementById('login-btn').addEventListener('click', () => showModal('login-modal'));
    document.getElementById('signup-btn').addEventListener('click', () => showModal('signup-modal'));
    document.getElementById('upgrade-btn').addEventListener('click', () => showModal('premium-modal'));
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Quick Actions
    document.getElementById('quick-physics-quiz').addEventListener('click', () => startQuickQuiz('physics'));
    document.getElementById('quick-chemistry-quiz').addEventListener('click', () => startQuickQuiz('chemistry'));
    document.getElementById('quick-review').addEventListener('click', showWeakAreasReview);
    
    // Quiz controls
    document.getElementById('submit-btn').addEventListener('click', submitAnswer);
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('hint-btn').addEventListener('click', showHint);
    document.getElementById('quit-btn').addEventListener('click', quitQuiz);
    
    // Quiz Configuration
    document.getElementById('start-quiz-btn').addEventListener('click', startConfiguredQuiz);
    
    // Modal controls
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', closeModals);
    });
    
    document.getElementById('switch-to-signup').addEventListener('click', (e) => {
        e.preventDefault();
        closeModals();
        showModal('signup-modal');
    });
    
    document.getElementById('switch-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        closeModals();
        showModal('login-modal');
    });
    
    document.getElementById('forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        closeModals();
        showModal('forgot-password-modal');
    });
    
    document.getElementById('switch-to-login-from-forgot').addEventListener('click', (e) => {
        e.preventDefault();
        closeModals();
        showModal('login-modal');
    });
    
    // Form submissions
    document.querySelector('.login-form').addEventListener('submit', handleLogin);
    document.querySelector('.signup-form').addEventListener('submit', handleSignup);
    document.querySelector('.forgot-password-form').addEventListener('submit', handleForgotPassword);
    
    // Results modal buttons
    document.getElementById('review-quiz').addEventListener('click', reviewQuiz);
    document.getElementById('new-quiz').addEventListener('click', startNewQuiz);
    document.getElementById('share-results').addEventListener('click', shareResults);
    
    // Topics filtering
    document.querySelectorAll('.topics-filter .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.topics-filter .btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterTopics(e.target.dataset.filter);
        });
    });
    
    // Pricing options
    document.querySelectorAll('.pricing-option').forEach(option => {
        option.addEventListener('click', (e) => {
            document.querySelectorAll('.pricing-option').forEach(opt => opt.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });
}

// Dark Mode Functions
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 
        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Show toast notification
    showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`, 'success');
}

function updateThemeIcon(theme) {
    const icons = themeToggle.querySelectorAll('i');
    if (theme === 'dark') {
        icons[0].style.display = 'none';
        icons[1].style.display = 'block';
    } else {
        icons[0].style.display = 'block';
        icons[1].style.display = 'none';
    }
}

// Add theme toggle event listener
themeToggle.addEventListener('click', toggleTheme);

// Rest of your existing functions remain the same...
// [All your existing functions like showView, updateDashboard, initializeQuiz, etc.]

// Show a specific view
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.style.display = 'none';
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('nav a').forEach(navItem => {
        navItem.classList.remove('active');
    });
    
    // Show the selected view and set active nav item
    document.getElementById(`${viewName}-view`).style.display = 'block';
    document.getElementById(`nav-${viewName}`).classList.add('active');
    
    // Update current view
    currentView = viewName;
    
    // Perform view-specific updates
    switch(viewName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'quiz':
            // Quiz is initialized separately
            break;
        case 'progress':
            updateProgressView();
            break;
        case 'topics':
            updateTopicsView();
            break;
        case 'achievements':
            updateAchievementsView();
            break;
    }
}

// Update dashboard view
function updateDashboard() {
    // Update welcome name
    const welcomeName = document.getElementById('welcome-name');
    if (currentUser) {
        welcomeName.textContent = currentUser.name.split(' ')[0]; // First name only
    } else {
        welcomeName.textContent = 'Student';
    }
    
    // Update stats
    document.getElementById('total-score').textContent = userStats.totalScore.toLocaleString();
    document.getElementById('quizzes-taken').textContent = userStats.quizzesTaken;
    document.getElementById('accuracy').textContent = `${userStats.accuracy}%`;
    document.getElementById('streak').textContent = userStats.streak;
    
    // Update recommended topics
    const recommendedTopicsContainer = document.getElementById('recommended-topics');
    recommendedTopicsContainer.innerHTML = '';
    
    // Get topics with progress less than 50% as recommended
    const allTopics = [...topics.physics, ...topics.chemistry];
    const recommendedTopics = allTopics
        .filter(topic => topic.progress < 50)
        .sort((a, b) => a.progress - b.progress)
        .slice(0, 3);
    
    if (recommendedTopics.length === 0) {
        recommendedTopicsContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Great job! You\'ve mastered all recommended topics.</p>';
    } else {
        recommendedTopics.forEach(topic => {
            const topicElement = document.createElement('div');
            topicElement.className = 'topic-suggestion';
            topicElement.innerHTML = `
                <i class="fas fa-book"></i>
                <span>${topic.name}</span>
                <div class="topic-progress">
                    <div class="topic-progress-bar" style="width: ${topic.progress}%"></div>
                </div>
                <span>${topic.progress}%</span>
            `;
            topicElement.addEventListener('click', () => startTopicQuiz(topic.name));
            recommendedTopicsContainer.appendChild(topicElement);
        });
    }
    
    // Update weak areas in sidebar
    updateWeakAreas();
}

// Show quiz configuration modal
function showQuizConfig() {
    showModal('quiz-config-modal');
}

// Start a quick quiz
function startQuickQuiz(subject) {
    closeModals();
    initializeQuiz(subject, 'mixed', 5, 600); // 5 questions, 10 minutes
    showView('quiz');
}

// Start a configured quiz
function startConfiguredQuiz() {
    const subject = document.getElementById('quiz-subject').value;
    const difficulty = document.getElementById('quiz-difficulty').value;
    const length = parseInt(document.getElementById('quiz-length').value);
    const timer = parseInt(document.getElementById('quiz-timer').value);
    
    closeModals();
    initializeQuiz(subject, difficulty, length, timer);
    showView('quiz');
}

// Start a topic-specific quiz
function startTopicQuiz(topicName) {
    // For demo purposes, we'll just start a regular quiz
    // In a real app, this would filter questions by topic
    showToast(`Starting quiz for ${topicName}`, 'success');
    initializeQuiz('mixed', 'mixed', 5, 600);
    showView('quiz');
}

// Show weak areas review
function showWeakAreasReview() {
    const weakTopics = [...topics.physics, ...topics.chemistry]
        .filter(topic => topic.progress < 60)
        .slice(0, 3);
    
    if (weakTopics.length === 0) {
        showToast('No weak areas to review!', 'success');
        return;
    }
    
    const topicNames = weakTopics.map(t => t.name).join(', ');
    showToast(`Starting review for: ${topicNames}`, 'success');
    initializeQuiz('mixed', 'mixed', 5, 600);
    showView('quiz');
}

// Initialize quiz
function initializeQuiz(subject = 'mixed', difficulty = 'mixed', length = 5, timerDuration = 600) {
    // Reset quiz state
    currentQuestionIndex = 0;
    userAnswers = [];
    quizScore = 0;
    timeRemaining = timerDuration;
    
    // Clear existing timer
    if (quizTimer) {
        clearInterval(quizTimer);
    }
    
    // Filter questions based on subject and difficulty
    let allQuestions = [...physicsQuestions, ...chemistryQuestions];
    
    if (subject !== 'mixed') {
        allQuestions = allQuestions.filter(q => q.subject.toLowerCase() === subject);
    }
    
    if (difficulty !== 'mixed') {
        allQuestions = allQuestions.filter(q => q.difficulty.toLowerCase() === difficulty);
    }
    
    // Select random questions
    quizData = allQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, length);
    
    // Start timer if enabled
    if (timerDuration > 0) {
        startTimer();
    } else {
        document.getElementById('quiz-timer').textContent = 'No Timer';
    }
    
    // Display first question
    displayQuestion();
    
    // Reset buttons
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('submit-btn').style.display = 'block';
    document.getElementById('next-btn').style.display = 'none';
    
    // Hide explanation
    document.getElementById('explanation').style.display = 'none';
    
    // Show loading briefly
    showLoading();
    setTimeout(hideLoading, 800);
}

// Start quiz timer
function startTimer() {
    updateTimerDisplay();
    
    quizTimer = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(quizTimer);
            showToast('Time\'s up! Submitting your quiz...', 'warning');
            setTimeout(showResults, 1000);
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('quiz-timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Change color when time is running low
    if (timeRemaining < 60) {
        document.getElementById('quiz-timer').style.color = 'var(--danger-color)';
    }
}

// Display current question
function displayQuestion() {
    if (currentQuestionIndex >= quizData.length) {
        // Quiz completed
        showResults();
        return;
    }
    
    const question = quizData[currentQuestionIndex];
    
    // Update question elements
    document.getElementById('question-subject').textContent = question.subject;
    document.getElementById('question-number').textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('difficulty-level').textContent = question.difficulty;
    
    // Update progress bar
    const progressPercent = (currentQuestionIndex / quizData.length) * 100;
    document.getElementById('quiz-progress').style.width = `${progressPercent}%`;
    
    // Populate options
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = `
            <div class="option-letter">${String.fromCharCode(65 + index)}</div>
            <span>${option}</span>
        `;
        
        optionElement.addEventListener('click', () => selectOption(optionElement, index));
        optionsContainer.appendChild(optionElement);
    });
    
    // Reset selection state
    document.getElementById('submit-btn').disabled = true;
    
    // Hide explanation
    document.getElementById('explanation').style.display = 'none';
}

// Select an option
function selectOption(optionElement, optionIndex) {
    // Remove selected class from all options
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    optionElement.classList.add('selected');
    
    // Enable submit button
    document.getElementById('submit-btn').disabled = false;
    
    // Store the selected answer
    userAnswers[currentQuestionIndex] = optionIndex;
}

// Submit answer
function submitAnswer() {
    const question = quizData[currentQuestionIndex];
    const selectedOption = userAnswers[currentQuestionIndex];
    const isCorrect = selectedOption === question.correctAnswer;
    
    // Update score
    if (isCorrect) {
        quizScore++;
    }
    
    // Show correct/incorrect styling
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        if (index === question.correctAnswer) {
            option.classList.add('correct');
        } else if (index === selectedOption && !isCorrect) {
            option.classList.add('incorrect');
        }
        option.style.pointerEvents = 'none'; // Disable further clicks
    });
    
    // Show explanation
    const explanation = document.getElementById('explanation');
    const stepByStep = document.getElementById('step-by-step');
    
    stepByStep.innerHTML = `
        <div class="step">${question.explanation}</div>
    `;
    
    explanation.style.display = 'block';
    
    // Update buttons
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'block';
    
    // Show toast for correct/incorrect
    if (isCorrect) {
        showToast('Correct! Well done!', 'success');
    } else {
        showToast('Incorrect. Review the explanation.', 'error');
    }
}

// Next question
function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

// Show hint
function showHint() {
    const question = quizData[currentQuestionIndex];
    let hint = '';
    
    if (question.subject === 'Physics') {
        hint = "Think about the fundamental formulas and principles in physics that relate to this question.";
    } else {
        hint = "Consider the chemical properties, reactions, or principles that might apply here.";
    }
    
    showToast(hint, 'warning');
}

// Quit quiz
function quitQuiz() {
    if (confirm('Are you sure you want to quit this quiz? Your progress will be lost.')) {
        if (quizTimer) {
            clearInterval(quizTimer);
        }
        showView('dashboard');
        showToast('Quiz cancelled', 'warning');
    }
}

// Show quiz results
function showResults() {
    // Clear timer
    if (quizTimer) {
        clearInterval(quizTimer);
    }
    
    // Calculate score percentage
    const scorePercentage = Math.round((quizScore / quizData.length) * 100);
    const pointsEarned = quizScore * 10;
    
    // Update results modal
    document.getElementById('final-score').textContent = `${quizScore}/${quizData.length}`;
    document.getElementById('correct-answers').textContent = quizScore;
    document.getElementById('points-earned').textContent = pointsEarned;
    
    // Calculate time taken
    const timeTaken = document.getElementById('quiz-timer').textContent;
    document.getElementById('time-taken').textContent = timeTaken;
    
    // Set results message based on performance
    let message = '';
    if (scorePercentage >= 90) {
        message = 'Outstanding! You have excellent knowledge of this subject.';
    } else if (scorePercentage >= 70) {
        message = 'Great job! You have a good understanding of the material.';
    } else if (scorePercentage >= 50) {
        message = 'Good effort! Review the topics you missed to improve.';
    } else {
        message = 'Keep practicing! Focus on the fundamental concepts.';
    }
    
    document.getElementById('results-message').textContent = message;
    
    // Update weak topics
    const weakTopicsList = document.getElementById('weak-topics-list');
    weakTopicsList.innerHTML = '';
    
    // Find topics with incorrect answers
    const incorrectTopics = [];
    userAnswers.forEach((answer, index) => {
        if (answer !== quizData[index].correctAnswer) {
            incorrectTopics.push(quizData[index].subject);
        }
    });
    
    // Count occurrences and get unique topics
    const topicCounts = {};
    incorrectTopics.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
    
    // Display weak topics
    Object.keys(topicCounts).forEach(topic => {
        const topicElement = document.createElement('div');
        topicElement.className = 'topic-suggestion';
        topicElement.innerHTML = `
            <i class="fas fa-book"></i>
            <span>${topic}</span>
            <span style="margin-left: auto;">${topicCounts[topic]} incorrect</span>
        `;
        weakTopicsList.appendChild(topicElement);
    });
    
    // Show results modal
    showModal('results-modal');
    
    // Update user stats
    userStats.quizzesTaken++;
    userStats.totalScore += pointsEarned;
    userStats.accuracy = Math.round((userStats.accuracy * (userStats.quizzesTaken - 1) + scorePercentage) / userStats.quizzesTaken);
    
    // Update dashboard if it's the current view
    if (currentView === 'dashboard') {
        updateDashboard();
    }
    
    // Show achievement if applicable
    if (scorePercentage === 100) {
        showToast('🎉 Perfect score! Achievement unlocked!', 'success');
    }
}

// Review quiz
function reviewQuiz() {
    closeModals();
    currentQuestionIndex = 0;
    displayQuestion();
    showView('quiz');
}

// Start new quiz
function startNewQuiz() {
    closeModals();
    showQuizConfig();
}

// Share results
function shareResults() {
    const score = document.getElementById('final-score').textContent;
    const message = `I just scored ${score} on EdTechX SciQuiz! Test your science knowledge too.`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Quiz Results',
            text: message,
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(message).then(() => {
            showToast('Results copied to clipboard!', 'success');
        });
    }
}

// Update progress view
function updateProgressView() {
    // Update quiz history
    const quizHistoryContainer = document.getElementById('quiz-history');
    quizHistoryContainer.innerHTML = '';
    
    // Sample quiz history
    const quizHistory = [
        { date: '2023-06-15', subject: 'Physics', score: '8/10', time: '12:45' },
        { date: '2023-06-14', subject: 'Chemistry', score: '7/10', time: '15:20' },
        { date: '2023-06-12', subject: 'Physics', score: '9/10', time: '09:30' },
        { date: '2023-06-10', subject: 'Chemistry', score: '6/10', time: '14:15' },
        { date: '2023-06-08', subject: 'Physics', score: '8/10', time: '11:05' }
    ];
    
    quizHistory.forEach(quiz => {
        const quizElement = document.createElement('div');
        quizElement.className = 'topic-item';
        quizElement.innerHTML = `
            <div class="topic-name">
                <i class="fas fa-clipboard-list"></i>
                <span>${quiz.subject} Quiz</span>
            </div>
            <div>
                <span>${quiz.score}</span>
                <span style="margin-left: 10px; color: var(--text-secondary); font-size: 0.9rem;">${quiz.date}</span>
            </div>
        `;
        quizHistoryContainer.appendChild(quizElement);
    });
}

// Update topics view
function updateTopicsView() {
    populateTopics();
}

// Filter topics
function filterTopics(filter) {
    const physicsTopics = document.getElementById('physics-topics');
    const chemistryTopics = document.getElementById('chemistry-topics');
    
    if (filter === 'all') {
        physicsTopics.style.display = 'block';
        chemistryTopics.style.display = 'block';
    } else if (filter === 'physics') {
        physicsTopics.style.display = 'block';
        chemistryTopics.style.display = 'none';
    } else if (filter === 'chemistry') {
        physicsTopics.style.display = 'none';
        chemistryTopics.style.display = 'block';
    }
}

// Populate topics in the topics view
function populateTopics() {
    // Physics topics
    const physicsTopicsContainer = document.getElementById('physics-topics');
    physicsTopicsContainer.innerHTML = '';
    
    topics.physics.forEach(topic => {
        const topicElement = document.createElement('div');
        topicElement.className = 'topic-item';
        topicElement.innerHTML = `
            <div class="topic-name">
                <i class="fas fa-atom"></i>
                <span>${topic.name}</span>
            </div>
            <div class="topic-progress">
                <div class="topic-progress-bar" style="width: ${topic.progress}%"></div>
            </div>
            <span>${topic.progress}%</span>
        `;
        topicElement.addEventListener('click', () => startTopicQuiz(topic.name));
        physicsTopicsContainer.appendChild(topicElement);
    });
    
    // Chemistry topics
    const chemistryTopicsContainer = document.getElementById('chemistry-topics');
    chemistryTopicsContainer.innerHTML = '';
    
    topics.chemistry.forEach(topic => {
        const topicElement = document.createElement('div');
        topicElement.className = 'topic-item';
        topicElement.innerHTML = `
            <div class="topic-name">
                <i class="fas fa-flask"></i>
                <span>${topic.name}</span>
            </div>
            <div class="topic-progress">
                <div class="topic-progress-bar" style="width: ${topic.progress}%"></div>
            </div>
            <span>${topic.progress}%</span>
        `;
        topicElement.addEventListener('click', () => startTopicQuiz(topic.name));
        chemistryTopicsContainer.appendChild(topicElement);
    });
}

// Update achievements view
function updateAchievementsView() {
    // This would typically fetch achievements from a database
    // For demo, we'll use static data
    console.log('Achievements view updated');
}

// Update weak areas in sidebar
function updateWeakAreas() {
    const weakAreasList = document.getElementById('weak-areas-list');
    weakAreasList.innerHTML = '';
    
    // Get topics with progress less than 60%
    const allTopics = [...topics.physics, ...topics.chemistry];
    const weakTopics = allTopics
        .filter(topic => topic.progress < 60)
        .sort((a, b) => a.progress - b.progress)
        .slice(0, 3);
    
    if (weakTopics.length === 0) {
        weakAreasList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 10px;">No weak areas identified!</p>';
    } else {
        weakTopics.forEach(topic => {
            const topicElement = document.createElement('li');
            topicElement.className = 'topic-item';
            topicElement.innerHTML = `
                <div class="topic-name">
                    <i class="fas fa-book"></i>
                    <span>${topic.name}</span>
                </div>
                <div class="topic-progress">
                    <div class="topic-progress-bar" style="width: ${topic.progress}%"></div>
                </div>
            `;
            topicElement.addEventListener('click', () => startTopicQuiz(topic.name));
            weakAreasList.appendChild(topicElement);
        });
    }
}

// Initialize charts
function initializeCharts() {
    // Progress chart
    const progressCtx = document.getElementById('progress-chart').getContext('2d');
    new Chart(progressCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Physics Score',
                data: [65, 70, 75, 80, 78, 85],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.3,
                fill: true
            }, {
                label: 'Chemistry Score',
                data: [60, 65, 70, 75, 72, 80],
                borderColor: '#f72585',
                backgroundColor: 'rgba(247, 37, 133, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Monthly Progress'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
    
    // Mastery chart
    const masteryCtx = document.getElementById('mastery-chart').getContext('2d');
    new Chart(masteryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Atomic Structure', 'Chemical Bonding'],
            datasets: [{
                data: [75, 45, 60, 80, 65],
                backgroundColor: [
                    '#4361ee',
                    '#3a0ca3',
                    '#4cc9f0',
                    '#f72585',
                    '#f8961e'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Topic Mastery'
                }
            }
        }
    });
}

// Show modal
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

// Close all modals
function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Show loading overlay
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simple validation
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        currentUser = {
            name: 'John Doe',
            email: email,
            tier: 'Free'
        };
        
        // Save to localStorage
        localStorage.setItem('edtechxUser', JSON.stringify(currentUser));
        
        // Update UI
        updateUserProfile();
        closeModals();
        hideLoading();
        
        // Show success message
        showToast('Login successful! Welcome back!', 'success');
    }, 1500);
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    const termsAgreed = document.getElementById('terms-agree').checked;
    
    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (!termsAgreed) {
        showToast('Please agree to the terms and conditions', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        currentUser = {
            name: name,
            email: email,
            tier: 'Free'
        };
        
        // Save to localStorage
        localStorage.setItem('edtechxUser', JSON.stringify(currentUser));
        
        // Update UI
        updateUserProfile();
        closeModals();
        hideLoading();
        
        // Show success message
        showToast('Account created successfully! Welcome to EdTechX!', 'success');
    }, 1500);
}

// Handle forgot password
function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('reset-email').value;
    
    if (!email) {
        showToast('Please enter your email address', 'error');
        return;
    }
    
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        closeModals();
        hideLoading();
        showToast('Password reset link sent to your email', 'success');
    }, 1500);
}

// Update user profile in sidebar
function updateUserProfile() {
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-email').textContent = currentUser.email;
        document.getElementById('user-tier').textContent = `${currentUser.tier} Tier`;
        
        // Update auth buttons
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('signup-btn').style.display = 'none';
        document.getElementById('user-menu').style.display = 'block';
        
        // Update progress if elements exist
        updateProgressDisplay();
        
    } else {
        document.getElementById('user-name').textContent = 'Guest User';
        document.getElementById('user-email').textContent = 'guest@example.com';
        document.getElementById('user-tier').textContent = 'Free Tier';
        
        // Show auth buttons
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('signup-btn').style.display = 'block';
        document.getElementById('user-menu').style.display = 'none';
        
        // Reset progress display
        resetProgressDisplay();
    }
}

// Update progress display in profile
function updateProgressDisplay() {
    if (currentUser && currentUser.progress) {
        const progressElement = document.getElementById('user-progress');
        const coursesCompleted = currentUser.progress.coursesCompleted || 0;
        const totalCourses = currentUser.progress.totalCourses || 10; // Default total courses
        
        if (progressElement) {
            progressElement.textContent = `Progress: ${coursesCompleted}/${totalCourses} courses completed`;
        }
        
        // Update progress bar if exists
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const progressPercentage = (coursesCompleted / totalCourses) * 100;
            progressBar.style.width = `${progressPercentage}%`;
            progressBar.setAttribute('aria-valuenow', progressPercentage);
        }
    }
}

// Reset progress display for guest users
function resetProgressDisplay() {
    const progressElement = document.getElementById('user-progress');
    if (progressElement) {
        progressElement.textContent = 'Progress: Sign in to track progress';
    }
    
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
        progressBar.setAttribute('aria-valuenow', 0);
    }
}

// Logout function
function logout() {
    // Confirm logout
    if (confirm('Are you sure you want to log out?')) {
        currentUser = null;
        localStorage.removeItem('edtechxUser');
        updateUserProfile();
        
        // Reset any user-specific UI elements
        resetUserSpecificContent();
        
        // Show success message
        showToast('You have been logged out successfully', 'success');
        
        // Redirect to home page or refresh current page
        if (window.location.pathname.includes('dashboard')) {
            window.location.href = 'index.html';
        }
    }
}

// Reset user-specific content after logout
function resetUserSpecificContent() {
    // Clear any user-specific data from UI
    const userContentElements = document.querySelectorAll('[data-user-content]');
    userContentElements.forEach(element => {
        element.innerHTML = '<p>Please sign in to view this content</p>';
    });
    
    // Reset any forms or inputs
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (form.id !== 'login-form' && form.id !== 'signup-form') {
            form.reset();
        }
    });
}
