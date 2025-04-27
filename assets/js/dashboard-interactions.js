/**
 * AccountPro - Account Management Platform
 * Dashboard Interactions JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all dashboard components
    initializeSidebar();
    initializeNavigation();
    initializeTaskManagement();
    initializeDropdowns();
    initializeCalendar();
    initializeCharts();
    initializeNotifications();
    initializeSearch();
    initializeWidgets();
});

/**
 * Initialize Interactive Widgets
 * Adds interactivity to dashboard widgets
 */
function initializeWidgets() {
    // Toggle widget expand/collapse
    const widgetHeaders = document.querySelectorAll('.widget-header');
    
    widgetHeaders.forEach(header => {
        // Add expand/collapse functionality
        const widget = header.closest('.dashboard-widget');
        if (!widget) return;
        
        const content = widget.querySelector('.widget-content');
        if (!content) return;
        
        // Create toggle button if it doesn't exist
        if (!header.querySelector('.widget-toggle')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'widget-toggle';
            toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            toggleBtn.setAttribute('aria-label', 'Toggle widget');
            
            const actions = header.querySelector('.widget-actions');
            if (actions) {
                actions.prepend(toggleBtn);
            } else {
                header.appendChild(toggleBtn);
            }
            
            // Toggle widget content
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                widget.classList.toggle('collapsed');
                
                const icon = toggleBtn.querySelector('i');
                if (widget.classList.contains('collapsed')) {
                    icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
                } else {
                    icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
                }
            });
        }
        
        // Add refresh functionality
        if (!header.querySelector('.widget-refresh')) {
            const refreshBtn = document.createElement('button');
            refreshBtn.className = 'widget-refresh';
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
            refreshBtn.setAttribute('aria-label', 'Refresh widget');
            
            const actions = header.querySelector('.widget-actions');
            if (actions) {
                actions.prepend(refreshBtn);
            } else {
                header.appendChild(refreshBtn);
            }
            
            // Handle refresh action
            refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                refreshBtn.classList.add('loading');
                
                // Simulate refresh delay
                setTimeout(() => {
                    refreshBtn.classList.remove('loading');
                    
                    // Show success indicator
                    refreshBtn.querySelector('i').classList.replace('fa-sync-alt', 'fa-check');
                    
                    // Return to original icon after a moment
                    setTimeout(() => {
                        refreshBtn.querySelector('i').classList.replace('fa-check', 'fa-sync-alt');
                    }, 1000);
                    
                    // In a real app, this would fetch fresh data
                    console.log(`Widget refreshed: ${header.querySelector('h3').textContent}`);
                }, 800);
            });
        }
    });
    
    // Initialize task drag-and-drop
    initializeTaskDragDrop();
}

/**
 * Initialize Task Drag and Drop
 * Enables dragging and dropping of tasks to reorder them
 */
function initializeTaskDragDrop() {
    const taskList = document.querySelector('.task-list');
    if (!taskList) return;
    
    const taskItems = taskList.querySelectorAll('.task-item');
    
    // Make tasks draggable
    taskItems.forEach(task => {
        task.setAttribute('draggable', 'true');
        
        task.addEventListener('dragstart', (e) => {
            task.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', task.dataset.id || '');
        });
        
        task.addEventListener('dragend', () => {
            task.classList.remove('dragging');
        });
    });
    
    // Handle drop targets
    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingTask = taskList.querySelector('.dragging');
        if (!draggingTask) return;
        
        // Get task we're hovering over
        const taskUnderCursor = getTaskUnderCursor(e.clientY);
        
        if (taskUnderCursor) {
            taskList.insertBefore(draggingTask, taskUnderCursor);
        } else {
            taskList.appendChild(draggingTask);
        }
    });
    
    // Helper function to get the task element under the cursor
    function getTaskUnderCursor(y) {
        const tasks = [...taskList.querySelectorAll('.task-item:not(.dragging)')];
        
        return tasks.reduce((closest, task) => {
            const box = task.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: task };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}

// Utility Functions

/**
 * Debounce Function
 * Limits how often a function can be called
 */
function debounce(func, wait = 20, immediate = false) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

/**
 * Format Number
 * Formats large numbers with k, M suffixes
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
}

/**
 * Handle Errors
 * Centralized error handling
 */
function handleError(error, context = '') {
    console.error(`Error${context ? ` in ${context}` : ''}: `, error);
    
    // Show error notification
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-notification';
    errorMessage.innerHTML = `
        <div class="error-icon">
            <i class="fas fa-exclamation-circle"></i>
        </div>
        <div class="error-content">
            <div class="error-title">Error Occurred</div>
            <div class="error-message">
                ${error.message || 'Something went wrong. Please try again.'}
            </div>
        </div>
        <button class="error-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(errorMessage);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(errorMessage)) {
            errorMessage.classList.add('removing');
            setTimeout(() => errorMessage.remove(), 300);
        }
    }, 5000);
    
    // Close button
    errorMessage.querySelector('.error-close').addEventListener('click', () => {
        errorMessage.classList.add('removing');
        setTimeout(() => errorMessage.remove(), 300);
    });
}

// Add global error handler
window.addEventListener('error', (e) => {
    handleError(e.error || new Error(e.message));
});

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize all components
        initializeSidebar();
        initializeNavigation();
        initializeTaskManagement();
        initializeDropdowns();
        initializeCalendar();
        initializeCharts();
        initializeNotifications();
        initializeSearch();
        initializeWidgets();
        
        console.log('Dashboard initialized successfully');
    } catch (error) {
        handleError(error, 'initialization');
    }
});
    
    // Toggle sidebar on button click
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        dashboardLayout.classList.toggle('sidebar-collapsed');
        
        // Store sidebar state in localStorage
        const isSidebarCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
    });
    
    // Check localStorage for saved sidebar state
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState === 'true') {
        sidebar.classList.add('collapsed');
        dashboardLayout.classList.add('sidebar-collapsed');
    }
    
    // Auto-collapse sidebar on mobile devices
    const handleResize = () => {
        if (window.innerWidth < 768) {
            sidebar.classList.add('collapsed');
            dashboardLayout.classList.add('sidebar-collapsed');
        } else if (savedSidebarState !== 'true') {
            sidebar.classList.remove('collapsed');
            dashboardLayout.classList.remove('sidebar-collapsed');
        }
    };
    
    // Listen for window resize events
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
}

/**
 * Initialize Navigation
 * Handles navigation between dashboard sections
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    
    if (!navLinks.length || !dashboardSections.length) return;
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the section id from the link's data attribute
            const sectionId = link.getAttribute('data-section');
            if (!sectionId) return;
            
            // Remove active class from all links and add to clicked link
            navLinks.forEach(navLink => navLink.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            // Hide all sections and show the selected one
            dashboardSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${sectionId}-section`) {
                    section.classList.add('active');
                    
                    // Add animation to the section
                    section.classList.add('animate-fade-in');
                    setTimeout(() => {
                        section.classList.remove('animate-fade-in');
                    }, 500);
                }
            });
            
            // Close sidebar on mobile after navigation
            if (window.innerWidth < 768) {
                const sidebar = document.querySelector('.dashboard-sidebar');
                const dashboardLayout = document.querySelector('.dashboard-layout');
                if (sidebar && dashboardLayout) {
                    sidebar.classList.add('collapsed');
                    dashboardLayout.classList.add('sidebar-collapsed');
                }
            }
            
            // Update URL hash without scrolling
            history.pushState(null, null, `#${sectionId}`);
        });
    });
    
    // Check URL hash on page load
    const checkUrlHash = () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const activeLink = document.querySelector(`.nav-link[data-section="${hash}"]`);
            if (activeLink) {
                activeLink.click();
            }
        }
    };
    
    // Initial check
    checkUrlHash();
    
    // Listen for hash changes
    window.addEventListener('hashchange', checkUrlHash);
}

/**
 * Initialize Task Management
 * Handles task interactions like checkboxes and status updates
 */
function initializeTaskManagement() {
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    const taskItems = document.querySelectorAll('.task-item');
    
    if (!taskCheckboxes.length) return;
    
    // Handle task completion
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const taskItem = checkbox.closest('.task-item');
            if (!taskItem) return;
            
            if (checkbox.checked) {
                taskItem.classList.add('completed');
                
                // Simulate task completion update
                setTimeout(() => {
                    // In a real app, this would send data to the server
                    console.log(`Task "${taskItem.querySelector('.task-title').textContent}" marked as completed`);
                    
                    // Update task completion statistics
                    updateTaskStats();
                }, 300);
            } else {
                taskItem.classList.remove('completed');
                
                // Simulate task uncomplete update
                setTimeout(() => {
                    console.log(`Task "${taskItem.querySelector('.task-title').textContent}" marked as incomplete`);
                    
                    // Update task completion statistics
                    updateTaskStats();
                }, 300);
            }
        });
    });
    
    // Handle task actions (ellipsis menu)
    const taskActions = document.querySelectorAll('.task-action');
    taskActions.forEach(actionButton => {
        actionButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Create and show task action menu
            if (!actionButton.querySelector('.task-action-menu')) {
                const menu = document.createElement('div');
                menu.className = 'task-action-menu';
                menu.innerHTML = `
                    <ul>
                        <li><a href="#" data-action="edit"><i class="fas fa-edit"></i> Edit Task</a></li>
                        <li><a href="#" data-action="priority"><i class="fas fa-flag"></i> Change Priority</a></li>
                        <li><a href="#" data-action="assign"><i class="fas fa-user"></i> Reassign</a></li>
                        <li class="divider"></li>
                        <li><a href="#" data-action="delete" class="text-danger"><i class="fas fa-trash"></i> Delete</a></li>
                    </ul>
                `;
                
                actionButton.appendChild(menu);
                
                // Close menu when clicking outside
                document.addEventListener('click', function closeMenu(e) {
                    if (!actionButton.contains(e.target)) {
                        menu.remove();
                        document.removeEventListener('click', closeMenu);
                    }
                });
                
                // Handle menu actions
                menu.querySelectorAll('[data-action]').forEach(actionLink => {
                    actionLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        const action = actionLink.getAttribute('data-action');
                        const taskItem = actionButton.closest('.task-item');
                        const taskTitle = taskItem.querySelector('.task-title').textContent;
                        
                        console.log(`Action "${action}" triggered for task "${taskTitle}"`);
                        
                        // Example of handling delete action
                        if (action === 'delete') {
                            taskItem.style.opacity = '0';
                            setTimeout(() => {
                                taskItem.style.height = '0';
                                taskItem.style.marginBottom = '0';
                                taskItem.style.padding = '0';
                                setTimeout(() => {
                                    taskItem.remove();
                                    updateTaskStats();
                                }, 300);
                            }, 300);
                        }
                        
                        menu.remove();
                    });
                });
            } else {
                actionButton.querySelector('.task-action-menu').remove();
            }
        });
    });
    
    // Function to update task statistics
    function updateTaskStats() {
        const totalTasks = document.querySelectorAll('.task-item').length;
        const completedTasks = document.querySelectorAll('.task-item.completed').length;
        
        if (totalTasks === 0) return;
        
        const completionPercentage = Math.round((completedTasks / totalTasks) * 100);
        
        // Update the task completion stat card
        const taskCompletionValue = document.querySelector('.stat-card:nth-child(2) .stat-value');
        if (taskCompletionValue) {
            taskCompletionValue.textContent = `${completionPercentage}%`;
        }
    }
}

/**
 * Initialize Dropdowns
 * Handles dropdown menu toggling and interactions
 */
function initializeDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    if (!dropdownToggles.length) return;
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdownMenu = toggle.nextElementSibling;
            if (!dropdownMenu) return;
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdownMenu.classList.toggle('active');
            
            // Close dropdown when clicking outside
            const closeDropdown = (e) => {
                if (!toggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('active');
                    document.removeEventListener('click', closeDropdown);
                }
            };
            
            document.addEventListener('click', closeDropdown);
        });
    });
}

/**
 * Initialize Calendar
 * Handles calendar navigation and event interactions
 */
function initializeCalendar() {
    const calendarNavButtons = document.querySelectorAll('.calendar-navigation button');
    const monthDisplay = document.querySelector('.calendar-navigation h4');
    
    if (!calendarNavButtons.length || !monthDisplay) return;
    
    // Current month tracking
    let currentDate = new Date(2025, 3, 1); // April 2025 (months are 0-based)
    
    // Handle month navigation
    calendarNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.querySelector('.fa-chevron-left')) {
                // Previous month
                currentDate.setMonth(currentDate.getMonth() - 1);
            } else {
                // Next month
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
            
            // Update calendar display
            updateCalendarDisplay();
        });
    });
    
    // Function to update calendar display
    function updateCalendarDisplay() {
        // Update month/year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        monthDisplay.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        // In a real application, this would fetch events for the current month
        // and rebuild the calendar days and events
        console.log(`Calendar updated to ${monthDisplay.textContent}`);
        
        // Add animation to indicate calendar change
        const calendarGrid = document.querySelector('.calendar-grid');
        if (calendarGrid) {
            calendarGrid.classList.add('animate-fade-in');
            setTimeout(() => {
                calendarGrid.classList.remove('animate-fade-in');
            }, 500);
        }
    }
    
    // Make calendar days interactive
    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => {
        if (!day.classList.contains('inactive')) {
            day.addEventListener('click', () => {
                const dayNumber = day.querySelector('span').textContent;
                console.log(`Selected day: ${dayNumber} ${monthDisplay.textContent}`);
                
                // Show day selection
                calendarDays.forEach(d => d.classList.remove('selected'));
                day.classList.add('selected');
                
                // In a real app, this would show events for the selected day
                // or open a modal to add a new event
            });
        }
    });
    
    // Make calendar events interactive
    const calendarEvents = document.querySelectorAll('.calendar-day .event');
    calendarEvents.forEach(event => {
        event.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the day click
            
            console.log(`Event clicked: ${event.textContent}`);
            
            // In a real app, this would open an event details modal
            alert(`Event details: ${event.textContent}`);
        });
    });
}

/**
 * Initialize Charts
 * Creates and updates charts for analytics data
 */
function initializeCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js is not loaded. Analytics charts will not be displayed.');
        return;
    }
    
    // Set Chart.js defaults
    Chart.defaults.font.family = "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
    Chart.defaults.font.size = 14;
    Chart.defaults.color = '#718096';
    
    // Line chart for engagement over time
    const engagementCtx = document.getElementById('engagement-chart');
    if (engagementCtx) {
        const engagementChart = new Chart(engagementCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Engagements',
                    data: [65, 78, 90, 115, 112, 128],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 3,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Bar chart for account performance
    const performanceCtx = document.getElementById('performance-chart');
    if (performanceCtx) {
        const performanceChart = new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: ['Instagram', 'Facebook', 'Twitter', 'LinkedIn'],
                datasets: [{
                    label: 'Engagement Rate',
                    data: [4.8, 2.3, 5.2, 1.9],
                    backgroundColor: [
                        'rgba(233, 30, 99, 0.7)',
                        'rgba(66, 103, 178, 0.7)',
                        'rgba(29, 161, 242, 0.7)',
                        'rgba(10, 102, 194, 0.7)'
                    ],
                    borderColor: [
                        'rgb(233, 30, 99)',
                        'rgb(66, 103, 178)',
                        'rgb(29, 161, 242)',
                        'rgb(10, 102, 194)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Engagement Rate: ${context.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Doughnut chart for content types
    const contentTypeCtx = document.getElementById('content-type-chart');
    if (contentTypeCtx) {
        const contentTypeChart = new Chart(contentTypeCtx, {
            type: 'doughnut',
            data: {
                labels: ['Images', 'Videos', 'Stories', 'Text'],
                datasets: [{
                    data: [42, 28, 18, 12],
                    backgroundColor: [
                        '#4361ee',
                        '#3a0ca3',
                        '#7209b7',
                        '#f72585'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            boxWidth: 12
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Initialize Search Functionality
 * Handles search input and results display
 */
function initializeSearch() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    
    if (!searchForm || !searchInput) return;
    
    // Sample search data (in a real app, this would come from the server)
    const searchData = [
        { type: 'task', title: 'Create content for Instagram post', account: '@fashionbrand', due: 'Today' },
        { type: 'task', title: 'Respond to customer inquiries', account: '@techcompany', due: 'Tomorrow' },
        { type: 'task', title: 'Review content performance', account: '@foodblog', due: 'In 2 days' },
        { type: 'account', title: '@fashionbrand', platform: 'Instagram', status: 'Active' },
        { type: 'account', title: '@techcompany', platform: 'Twitter', status: 'Active' },
        { type: 'account', title: '@foodblog', platform: 'Instagram', status: 'Active' },
        { type: 'activity', title: 'New comment on post', account: '@fashionbrand', time: '2 hours ago' },
        { type: 'activity', title: 'Account performance report', account: 'All accounts', time: 'Yesterday' }
    ];
    
    // Create search results container if it doesn't exist
    let searchResults = document.querySelector('.search-results');
    if (!searchResults) {
        searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        searchForm.appendChild(searchResults);
    }
    
    // Handle search input
    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.innerHTML = '';
            searchResults.classList.remove('active');
            return;
        }
        
        // Filter search results
        const filteredResults = searchData.filter(item => 
            item.title.toLowerCase().includes(query) || 
            (item.account && item.account.toLowerCase().includes(query))
        );
        
        // Display search results
        if (filteredResults.length > 0) {
            searchResults.innerHTML = '';
            
            // Group results by type
            const groupedResults = {
                task: filteredResults.filter(item => item.type === 'task'),
                account: filteredResults.filter(item => item.type === 'account'),
                activity: filteredResults.filter(item => item.type === 'activity')
            };
            
            // Build results HTML
            Object.keys(groupedResults).forEach(type => {
                const results = groupedResults[type];
                if (results.length > 0) {
                    const groupTitle = document.createElement('div');
                    groupTitle.className = 'result-group-title';
                    groupTitle.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}s`;
                    searchResults.appendChild(groupTitle);
                    
                    results.forEach(result => {
                        const resultItem = document.createElement('div');
                        resultItem.className = 'result-item';
                        
                        let iconClass = '';
                        switch (type) {
                            case 'task': iconClass = 'fa-tasks'; break;
                            case 'account': iconClass = 'fa-user-circle'; break;
                            case 'activity': iconClass = 'fa-bell'; break;
                        }
                        
                        resultItem.innerHTML = `
                            <div class="result-icon">
                                <i class="fas ${iconClass}"></i>
                            </div>
                            <div class="result-content">
                                <div class="result-title">${result.title}</div>
                                <div class="result-meta">
                                    ${result.account ? `<span>${result.account}</span>` : ''}
                                    ${result.due ? `<span>Due: ${result.due}</span>` : ''}
                                    ${result.platform ? `<span>${result.platform}</span>` : ''}
                                    ${result.time ? `<span>${result.time}</span>` : ''}
                                </div>
                            </div>
                        `;
                        
                        // Make search results clickable
                        resultItem.addEventListener('click', () => {
                            console.log(`Selected result: ${result.title}`);
                            searchResults.classList.remove('active');
                            
                            // In a real app, this would navigate to the corresponding item
                            if (type === 'task') {
                                document.querySelector('.nav-link[data-section="tasks"]').click();
                            } else if (type === 'account') {
                                document.querySelector('.nav-link[data-section="accounts"]').click();
                            }
                        });
                        
                        searchResults.appendChild(resultItem);
                    });
                }
            });
            
            searchResults.classList.add('active');
        } else {
            searchResults.innerHTML = '<div class="no-results">No results found</div>';
            searchResults.classList.add('active');
        }
    }, 300));
    
    // Handle search form submission
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        
        if (query.length > 0) {
            console.log(`Search submitted: ${query}`);
            // In a real app, this would perform a more comprehensive search
            // and possibly navigate to a dedicated search results page
        }
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchForm.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

/**
 * Initialize Notifications
 * Handles notification actions and displays
 */
function initializeNotifications() {
    const notificationButton = document.querySelector('.action-button[aria-label="Notifications"]');
    
    if (!notificationButton) return;
    
    // Sample notification data (in a real app, this would come from the server)
    const notifications = [
        { id: 1, type: 'task', title: 'Task due soon', message: 'Create content for Instagram post', time: '1 hour ago', read: false },
        { id: 2, type: 'comment', title: 'New comment', message: 'Someone commented on your post', time: '3 hours ago', read: false },
        { id: 3, type: 'system', title: 'System update', message: 'Platform will be updated tonight', time: '1 day ago', read: true },
        { id: 4, type: 'mention', title: 'New mention', message: 'You were mentioned in a comment', time: '2 days ago', read: true }
    ];
    
    // Create notification panel if it doesn't exist
    let notificationPanel = document.querySelector('.notification-panel');
    if (!notificationPanel) {
        notificationPanel = document.createElement('div');
        notificationPanel.className = 'notification-panel';
        notificationPanel.innerHTML = `
            <div class="panel-header">
                <h3>Notifications</h3>
                <button class="mark-all-read">Mark all as read</button>
            </div>
            <div class="panel-content">
                <div class="notification-list"></div>
            </div>
            <div class="panel-footer">
                <a href="#notifications">View all notifications</a>
            </div>
        `;
        document.body.appendChild(notificationPanel);
    }
    
    // Populate notifications
    const notificationList = notificationPanel.querySelector('.notification-list');
    if (notificationList) {
        notificationList.innerHTML = '';
        
        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
            notificationItem.dataset.id = notification.id;
            
            let iconClass = '';
            switch (notification.type) {
                case 'task': iconClass = 'fa-tasks'; break;
                case 'comment': iconClass = 'fa-comment'; break;
                case 'system': iconClass = 'fa-info-circle'; break;
                case 'mention': iconClass = 'fa-at'; break;
            }
            
            notificationItem.innerHTML = `
                <div class="notification-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
                <div class="notification-actions">
                    <button class="mark-read" aria-label="Mark as read">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            `;
            
            notificationList.appendChild(notificationItem);
        });
    }
    
    // Toggle notification panel
    notificationButton.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationPanel.classList.toggle('active');
        
        // Close other panels
        document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });
        
        // Update notification badge
        if (notificationPanel.classList.contains('active')) {
            // In a real app, this would notify the server that the user viewed their notifications
            console.log('Notifications viewed');
        }
    });
    
    // Mark individual notification as read
    notificationPanel.addEventListener('click', (e) => {
        const markReadButton = e.target.closest('.mark-read');
        if (markReadButton) {
            const notificationItem = markReadButton.closest('.notification-item');
            notificationItem.classList.remove('unread');
            notificationItem.classList.add('read');
            
            // In a real app, this would update the server
            console.log(`Notification ${notificationItem.dataset.id} marked as read`);
            
            // Update unread count
            updateNotificationBadge();
        }
    });
    
    // Mark all notifications as read
    const markAllReadButton = notificationPanel.querySelector('.mark-all-read');
    if (markAllReadButton) {
        markAllReadButton.addEventListener('click', () => {
            notificationPanel.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
                item.classList.add('read');
            });
            
            // In a real app, this would update the server
            console.log('All notifications marked as read');
            
            // Update unread count
            updateNotificationBadge();
        });
    }
    
    // Close notification panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!notificationButton.contains(e.target) && !notificationPanel.contains(e.target)) {
            notificationPanel.classList.remove('active');
        }
    });
    
    // Function to update notification badge
    function updateNotificationBadge() {
        const unreadCount = notificationPanel.querySelectorAll('.notification-item.unread').length;
        const badge = notificationButton.querySelector('.notification-badge');
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }
    
    // Initial update
    updateNotificationBadge();
}

/**
 * Initialize Interactive Widgets
 * Adds interactivity to dashboard widgets
 */
function initializeWidgets() {
    // Toggle widget expand/collapse
    const widgetHeaders = document.querySelectorAll('.widget-header');
    
    widgetHeaders.forEach(header => {
        //

