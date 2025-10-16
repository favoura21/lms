// Application State
let currentUser = null;
let currentPage = 'home';
let currentCourse = null;
let currentLesson = 0;

// Sample Data
const courses = [
    {
        id: 1,
        title: "Complete Web Development Bootcamp",
        instructor: "Sarah Johnson",
        description: "Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course.",
        category: "programming",
        price: "$99",
        rating: 4.8,
        duration: "40 hours",
        image: "💻",
        lessons: [
            { id: 1, title: "Introduction to Web Development", type: "video", duration: "15 min", completed: false },
            { id: 2, title: "HTML Fundamentals", type: "video", duration: "30 min", completed: false },
            { id: 3, title: "CSS Styling", type: "video", duration: "45 min", completed: false },
            { id: 4, title: "JavaScript Basics", type: "video", duration: "60 min", completed: false },
            { id: 5, title: "HTML Quiz", type: "quiz", duration: "10 min", completed: false }
        ],
        enrolled: false,
        progress: 0
    },
    {
        id: 2,
        title: "UI/UX Design Masterclass",
        instructor: "Mike Chen",
        description: "Master the principles of user interface and user experience design.",
        category: "design",
        price: "$79",
        rating: 4.9,
        duration: "25 hours",
        image: "🎨",
        lessons: [
            { id: 1, title: "Design Principles", type: "video", duration: "20 min", completed: false },
            { id: 2, title: "Color Theory", type: "video", duration: "25 min", completed: false },
            { id: 3, title: "Typography", type: "video", duration: "30 min", completed: false },
            { id: 4, title: "Wireframing", type: "video", duration: "40 min", completed: false }
        ],
        enrolled: false,
        progress: 0
    },
    {
        id: 3,
        title: "Digital Marketing Strategy",
        instructor: "Emma Davis",
        description: "Learn how to create effective digital marketing campaigns.",
        category: "marketing",
        price: "$89",
        rating: 4.7,
        duration: "30 hours",
        image: "📈",
        lessons: [
            { id: 1, title: "Marketing Fundamentals", type: "video", duration: "25 min", completed: false },
            { id: 2, title: "Social Media Marketing", type: "video", duration: "35 min", completed: false },
            { id: 3, title: "Email Marketing", type: "video", duration: "30 min", completed: false }
        ],
        enrolled: false,
        progress: 0
    },
    {
        id: 4,
        title: "Business Analytics with Excel",
        instructor: "David Wilson",
        description: "Master data analysis and visualization using Microsoft Excel.",
        category: "business",
        price: "$69",
        rating: 4.6,
        duration: "20 hours",
        image: "📊",
        lessons: [
            { id: 1, title: "Excel Basics", type: "video", duration: "20 min", completed: false },
            { id: 2, title: "Data Analysis", type: "video", duration: "40 min", completed: false },
            { id: 3, title: "Charts and Graphs", type: "video", duration: "30 min", completed: false }
        ],
        enrolled: false,
        progress: 0
    }
];

const quizData = {
    5: {
        title: "HTML Fundamentals Quiz",
        questions: [
            {
                question: "What does HTML stand for?",
                options: [
                    "Hyper Text Markup Language",
                    "High Tech Modern Language",
                    "Home Tool Markup Language",
                    "Hyperlink and Text Markup Language"
                ],
                correct: 0
            },
            {
                question: "Which HTML element is used for the largest heading?",
                options: ["<h6>", "<h1>", "<heading>", "<header>"],
                correct: 1
            },
            {
                question: "What is the correct HTML element for inserting a line break?",
                options: ["<break>", "<lb>", "<br>", "<newline>"],
                correct: 2
            }
        ]
    }
};

// DOM Elements
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const quizModal = document.getElementById('quiz-modal');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const navAuth = document.getElementById('nav-auth');
const userMenu = document.getElementById('user-menu');
const userName = document.getElementById('user-name');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    renderCoursesPage();
});

function initializeApp() {
    // Check for saved user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
        loadUserProgress();
    }
    
    // Load saved courses progress
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
        const parsedCourses = JSON.parse(savedCourses);
        courses.forEach((course, index) => {
            if (parsedCourses[index]) {
                course.enrolled = parsedCourses[index].enrolled;
                course.progress = parsedCourses[index].progress;
                course.lessons = parsedCourses[index].lessons;
            }
        });
    }
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            navigateToPage(page);
        });
    });

    // Auth buttons
    loginBtn.addEventListener('click', () => showModal(loginModal));
    signupBtn.addEventListener('click', () => showModal(signupModal));
    logoutBtn.addEventListener('click', logout);

    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            hideModal(modal);
        });
    });

    // Modal background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
            }
        });
    });

    // Auth forms
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);

    // Auth form switches
    document.getElementById('switch-to-signup').addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(loginModal);
        showModal(signupModal);
    });

    document.getElementById('switch-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(signupModal);
        showModal(loginModal);
    });

    // Hero buttons
    document.getElementById('get-started-btn').addEventListener('click', () => {
        if (currentUser) {
            navigateToPage('dashboard');
        } else {
            showModal(signupModal);
        }
    });

    document.getElementById('explore-courses-btn').addEventListener('click', () => {
        navigateToPage('courses');
    });

    // Course search and filter
    document.getElementById('course-search').addEventListener('input', filterCourses);
    document.getElementById('category-filter').addEventListener('change', filterCourses);

    // Profile tabs
    document.querySelectorAll('.profile-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = e.target.getAttribute('data-tab');
            switchProfileTab(tab);
        });
    });

    // Course viewer navigation
    document.getElementById('back-to-courses').addEventListener('click', () => {
        navigateToPage('courses');
    });

    document.getElementById('prev-lesson').addEventListener('click', () => {
        if (currentLesson > 0) {
            currentLesson--;
            renderLesson();
        }
    });

    document.getElementById('next-lesson').addEventListener('click', () => {
        const course = courses.find(c => c.id === currentCourse);
        if (currentLesson < course.lessons.length - 1) {
            // Mark current lesson as completed
            course.lessons[currentLesson].completed = true;
            currentLesson++;
            renderLesson();
            updateCourseProgress();
        }
    });
}

// Navigation Functions
function navigateToPage(page) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.style.display = 'none';
    });

    // Show selected page
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        targetPage.style.display = 'block';
        currentPage = page;

        // Page-specific logic
        switch(page) {
            case 'courses':
                renderCoursesPage();
                break;
            case 'dashboard':
                if (!currentUser) {
                    showModal(loginModal);
                    return;
                }
                renderDashboard();
                break;
            case 'profile':
                if (!currentUser) {
                    showModal(loginModal);
                    return;
                }
                renderProfile();
                break;
        }
    }
}

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Simple validation (in real app, this would be server-side)
    if (email && password) {
        currentUser = {
            id: 1,
            name: "John Doe",
            email: email,
            type: "student",
            joinDate: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        hideModal(loginModal);
        navigateToPage('dashboard');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const userType = document.getElementById('user-type').value;

    if (name && email && password && userType) {
        currentUser = {
            id: 1,
            name: name,
            email: email,
            type: userType,
            joinDate: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        hideModal(signupModal);
        navigateToPage('dashboard');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    navigateToPage('home');
}

function updateAuthUI() {
    if (currentUser) {
        navAuth.style.display = 'none';
        userMenu.style.display = 'flex';
        userName.textContent = currentUser.name;
    } else {
        navAuth.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// Modal Functions
function showModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Course Functions
function renderCoursesPage() {
    const coursesGrid = document.getElementById('courses-grid');
    coursesGrid.innerHTML = '';

    courses.forEach(course => {
        const courseCard = createCourseCard(course);
        coursesGrid.appendChild(courseCard);
    });
}

function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
        <div class="course-image">
            ${course.image}
        </div>
        <div class="course-content">
            <h3 class="course-title">${course.title}</h3>
            <p class="course-instructor">by ${course.instructor}</p>
            <p class="course-description">${course.description}</p>
            <div class="course-meta">
                <div class="course-rating">
                    <i class="fas fa-star"></i>
                    <span>${course.rating}</span>
                </div>
                <span class="course-price">${course.price}</span>
            </div>
            <div class="course-footer">
                <span class="course-duration">
                    <i class="fas fa-clock"></i> ${course.duration}
                </span>
                <button class="btn ${course.enrolled ? 'btn-outline' : 'btn-primary'}" 
                        onclick="${course.enrolled ? `viewCourse(${course.id})` : `enrollCourse(${course.id})`}">
                    ${course.enrolled ? 'Continue' : 'Enroll Now'}
                </button>
            </div>
        </div>
    `;
    return card;
}

function enrollCourse(courseId) {
    if (!currentUser) {
        showModal(loginModal);
        return;
    }

    const course = courses.find(c => c.id === courseId);
    if (course) {
        course.enrolled = true;
        saveCourses();
        renderCoursesPage();
        
        // Show success message
        alert(`Successfully enrolled in ${course.title}!`);
    }
}

function viewCourse(courseId) {
    currentCourse = courseId;
    currentLesson = 0;
    navigateToPage('course-viewer');
    renderCourseViewer();
}

function renderCourseViewer() {
    const course = courses.find(c => c.id === currentCourse);
    if (!course) return;

    // Update course info
    document.getElementById('course-title').textContent = course.title;
    updateCourseProgressDisplay();

    // Render curriculum
    renderCurriculum();
    
    // Render current lesson
    renderLesson();
}

function renderCurriculum() {
    const course = courses.find(c => c.id === currentCourse);
    const curriculum = document.getElementById('course-curriculum');
    
    curriculum.innerHTML = `
        <div class="curriculum-section">
            <h4>Course Content</h4>
            ${course.lessons.map((lesson, index) => `
                <div class="lesson-item ${index === currentLesson ? 'active' : ''} ${lesson.completed ? 'completed' : ''}"
                     onclick="selectLesson(${index})">
                    <div class="lesson-icon">
                        ${lesson.completed ? '<i class="fas fa-check"></i>' : 
                          lesson.type === 'video' ? '<i class="fas fa-play"></i>' : '<i class="fas fa-question"></i>'}
                    </div>
                    <div class="lesson-title">${lesson.title}</div>
                    <div class="lesson-duration">${lesson.duration}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function selectLesson(lessonIndex) {
    currentLesson = lessonIndex;
    renderLesson();
    renderCurriculum();
}

function renderLesson() {
    const course = courses.find(c => c.id === currentCourse);
    const lesson = course.lessons[currentLesson];
    
    document.getElementById('lesson-title').textContent = lesson.title;
    
    const lessonContent = document.getElementById('lesson-content');
    
    if (lesson.type === 'video') {
        lessonContent.innerHTML = `
            <div class="video-player">
                <div class="video-placeholder">
                    <i class="fas fa-play-circle"></i>
                </div>
            </div>
            <div class="lesson-text">
                <h3>${lesson.title}</h3>
                <p>This is a video lesson covering ${lesson.title.toLowerCase()}. In this lesson, you will learn:</p>
                <ul>
                    <li>Key concepts and fundamentals</li>
                    <li>Practical examples and demonstrations</li>
                    <li>Best practices and common pitfalls</li>
                    <li>Hands-on exercises to reinforce learning</li>
                </ul>
                <p>Take your time to understand each concept before moving to the next lesson.</p>
            </div>
        `;
    } else if (lesson.type === 'quiz') {
        lessonContent.innerHTML = `
            <div class="lesson-text">
                <h3>${lesson.title}</h3>
                <p>Test your knowledge with this interactive quiz. Make sure you understand the previous lessons before proceeding.</p>
                <button class="btn btn-primary btn-large" onclick="startQuiz(${lesson.id})">
                    <i class="fas fa-play"></i> Start Quiz
                </button>
            </div>
        `;
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-lesson');
    const nextBtn = document.getElementById('next-lesson');
    
    prevBtn.disabled = currentLesson === 0;
    nextBtn.disabled = currentLesson === course.lessons.length - 1;
    
    if (currentLesson === course.lessons.length - 1) {
        nextBtn.innerHTML = '<i class="fas fa-trophy"></i> Complete Course';
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
    }
}

function startQuiz(lessonId) {
    const quiz = quizData[lessonId];
    if (!quiz) return;
    
    currentQuiz = {
        ...quiz,
        currentQuestion: 0,
        answers: [],
        score: 0
    };
    
    showModal(quizModal);
    renderQuiz();
}

function renderQuiz() {
    const quiz = currentQuiz;
    const question = quiz.questions[quiz.currentQuestion];
    
    document.getElementById('quiz-title').textContent = quiz.title;
    
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <div class="quiz-question">
            <h3>Question ${quiz.currentQuestion + 1} of ${quiz.questions.length}</h3>
            <p class="question-text">${question.question}</p>
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <div class="quiz-option" onclick="selectQuizOption(${index})">
                        ${option}
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="quiz-navigation">
            <button class="btn btn-outline" onclick="prevQuizQuestion()" 
                    ${quiz.currentQuestion === 0 ? 'disabled' : ''}>
                Previous
            </button>
            <button class="btn btn-primary" onclick="nextQuizQuestion()" id="quiz-next-btn" disabled>
                ${quiz.currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
        </div>
    `;
}

function selectQuizOption(optionIndex) {
    // Remove previous selection
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    document.querySelectorAll('.quiz-option')[optionIndex].classList.add('selected');
    
    // Store answer
    currentQuiz.answers[currentQuiz.currentQuestion] = optionIndex;
    
    // Enable next button
    document.getElementById('quiz-next-btn').disabled = false;
}

function nextQuizQuestion() {
    if (currentQuiz.currentQuestion < currentQuiz.questions.length - 1) {
        currentQuiz.currentQuestion++;
        renderQuiz();
    } else {
        finishQuiz();
    }
}

function prevQuizQuestion() {
    if (currentQuiz.currentQuestion > 0) {
        currentQuiz.currentQuestion--;
        renderQuiz();
    }
}

function finishQuiz() {
    // Calculate score
    let score = 0;
    currentQuiz.questions.forEach((question, index) => {
        if (currentQuiz.answers[index] === question.correct) {
            score++;
        }
    });
    
    const percentage = Math.round((score / currentQuiz.questions.length) * 100);
    
    // Show results
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <div class="quiz-results">
            <i class="fas fa-trophy" style="font-size: 4rem; color: #4f46e5; margin-bottom: 20px;"></i>
            <h2>Quiz Complete!</h2>
            <div class="quiz-score">${percentage}%</div>
            <p>You scored ${score} out of ${currentQuiz.questions.length} questions correctly.</p>
            <button class="btn btn-primary" onclick="closeQuiz()">Continue Learning</button>
        </div>
    `;
    
    // Mark lesson as completed if passed
    if (percentage >= 70) {
        const course = courses.find(c => c.id === currentCourse);
        const lesson = course.lessons.find(l => l.id === currentQuiz.questions[0].lessonId || currentLesson);
        if (lesson) {
            lesson.completed = true;
            updateCourseProgress();
        }
    }
}

function closeQuiz() {
    hideModal(quizModal);
    renderLesson();
    renderCurriculum();
}

// Dashboard Functions
function renderDashboard() {
    updateDashboardStats();
    renderProgressCourses();
    renderActivityFeed();
}

function updateDashboardStats() {
    const enrolledCount = courses.filter(c => c.enrolled).length;
    const completedCount = courses.filter(c => c.enrolled && c.progress === 100).length;
    const totalHours = courses.filter(c => c.enrolled).reduce((total, course) => {
        return total + (course.progress / 100) * parseInt(course.duration);
    }, 0);
    
    document.getElementById('enrolled-courses').textContent = enrolledCount;
    document.getElementById('completed-courses').textContent = completedCount;
    document.getElementById('study-hours').textContent = Math.round(totalHours);
}

function renderProgressCourses() {
    const progressCoursesContainer = document.getElementById('progress-courses');
    const enrolledCourses = courses.filter(c => c.enrolled && c.progress < 100);
    
    if (enrolledCourses.length === 0) {
        progressCoursesContainer.innerHTML = `
            <p style="text-align: center; color: #666; padding: 40px;">
                No courses in progress. <a href="#" onclick="navigateToPage('courses')" style="color: #4f46e5;">Browse courses</a> to get started!
            </p>
        `;
        return;
    }
    
    progressCoursesContainer.innerHTML = enrolledCourses.map(course => `
        <div class="progress-course" onclick="viewCourse(${course.id})">
            <div class="progress-course-image">${course.image}</div>
            <div class="progress-course-info">
                <div class="progress-course-title">${course.title}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${course.progress}%"></div>
                </div>
                <div class="progress-text">${course.progress}% complete</div>
            </div>
        </div>
    `).join('');
}

function renderActivityFeed() {
    const activityFeed = document.getElementById('activity-feed');
    const activities = [
        {
            icon: 'fas fa-play',
            text: 'Completed "Introduction to Web Development"',
            time: '2 hours ago'
        },
        {
            icon: 'fas fa-trophy',
            text: 'Earned certificate for "HTML Fundamentals"',
            time: '1 day ago'
        },
        {
            icon: 'fas fa-book',
            text: 'Enrolled in "UI/UX Design Masterclass"',
            time: '3 days ago'
        },
        {
            icon: 'fas fa-star',
            text: 'Rated "Complete Web Development Bootcamp" 5 stars',
            time: '1 week ago'
        }
    ];
    
    activityFeed.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// Profile Functions
function renderProfile() {
    // Update profile form with user data
    if (currentUser) {
        document.getElementById('profile-name').value = currentUser.name;
        document.getElementById('profile-email').value = currentUser.email;
    }
    
    renderCertificates();
}

function switchProfileTab(tabName) {
    // Update menu
    document.querySelectorAll('.profile-menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        }
    });
    
    // Update content
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function renderCertificates() {
    const certificatesGrid = document.getElementById('certificates-grid');
    const completedCourses = courses.filter(c => c.enrolled && c.progress === 100);
    
    if (completedCourses.length === 0) {
        certificatesGrid.innerHTML = `
            <p style="text-align: center; color: #666; padding: 40px; grid-column: 1 / -1;">
                Complete courses to earn certificates!
            </p>
        `;
        return;
    }
    
    certificatesGrid.innerHTML = completedCourses.map(course => `
        <div class="certificate-card">
            <i class="fas fa-certificate"></i>
            <div class="certificate-title">${course.title}</div>
            <div class="certificate-date">Completed ${new Date().toLocaleDateString()}</div>
        </div>
    `).join('');
}

// Utility Functions
function filterCourses() {
    const searchTerm = document.getElementById('course-search').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm) ||
                            course.description.toLowerCase().includes(searchTerm) ||
                            course.instructor.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || course.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    const coursesGrid = document.getElementById('courses-grid');
    coursesGrid.innerHTML = '';
    
    filteredCourses.forEach(course => {
        const courseCard = createCourseCard(course);
        coursesGrid.appendChild(courseCard);
    });
}

function updateCourseProgress() {
    const course = courses.find(c => c.id === currentCourse);
    if (!course) return;
    
    const completedLessons = course.lessons.filter(l => l.completed).length;
    course.progress = Math.round((completedLessons / course.lessons.length) * 100);
    
    updateCourseProgressDisplay();
    saveCourses();
}

function updateCourseProgressDisplay() {
    const course = courses.find(c => c.id === currentCourse);
    if (!course) return;
    
    const progressFill = document.getElementById('course-progress-fill');
    const progressText = document.getElementById('course-progress-text');
    
    if (progressFill && progressText) {
        progressFill.style.width = `${course.progress}%`;
        progressText.textContent = `${course.progress}% Complete`;
    }
}

function saveCourses() {
    localStorage.setItem('courses', JSON.stringify(courses));
}

function loadUserProgress() {
    // This would typically load user-specific progress from a server
    // For now, we'll use the saved courses data
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set initial page
    navigateToPage('home');
});