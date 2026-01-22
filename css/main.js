// ===== Authentication System =====
const AUTH_KEY = 'profitix_authenticated';
const LOGIN_SECTION = document.getElementById('loginSection');
const MAIN_APP = document.getElementById('mainApp');

// Check authentication on page load
function checkAuthentication() {
  // Check for logout parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('logout') === 'true') {
    logout();
    // Remove the logout parameter from URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return;
  }
  
  const isAuthenticated = localStorage.getItem(AUTH_KEY) === 'true';
  console.log('Authentication check:', isAuthenticated ? 'logged in' : 'not logged in');
  
  if (isAuthenticated) {
    showMainApp();
  } else {
    showLogin();
  }
}

function showLogin() {
  if (LOGIN_SECTION) LOGIN_SECTION.classList.remove('hidden');
  if (MAIN_APP) MAIN_APP.style.display = 'none';
}

function showMainApp() {
  if (LOGIN_SECTION) LOGIN_SECTION.classList.add('hidden');
  if (MAIN_APP) {
    MAIN_APP.style.display = 'flex';
    // Ensure proper layout
    MAIN_APP.style.flexDirection = 'row';
  }
}

function login() {
  localStorage.setItem(AUTH_KEY, 'true');
  showMainApp();
  // Initialize app after login
  setTimeout(() => {
    restoreSavedSection();
  }, 100);
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(STORAGE_KEY_SECTION);
  localStorage.removeItem(STORAGE_KEY_SETTINGS_TAB);
  showLogin();
}

// Initialize authentication check
checkAuthentication();

// Add keyboard shortcut for testing (Ctrl+Shift+L to logout)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'L') {
    e.preventDefault();
    logout();
    alert('Logged out! Refresh the page to see login form.');
  }
});

// ===== Login Form Handler =====
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('Login attempt:', { email: email ? 'provided' : 'missing', password: password ? 'provided' : 'missing' });
    
    // Simple validation (in production, validate with backend)
    if (email && password) {
      console.log('Login successful, calling login()');
      // Simulate login (replace with actual API call)
      login();
    } else {
      console.log('Login failed: missing email or password');
      alert('Please enter both email and password');
    }
  });
} else {
  console.error('Login form not found!');
}

// ===== Password Toggle =====
const togglePassword = document.getElementById('togglePassword');
if (togglePassword) {
  togglePassword.addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    const icon = togglePassword.querySelector('i');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.classList.remove('uil-eye');
      icon.classList.add('uil-eye-slash');
    } else {
      passwordInput.type = 'password';
      icon.classList.remove('uil-eye-slash');
      icon.classList.add('uil-eye');
    }
  });
}

// ===== Social Login Buttons =====
document.addEventListener('click', (e) => {
  if (e.target.closest('.social-btn')) {
    // Simulate social login (replace with actual OAuth)
    login();
  }
  
  // Register link
  if (e.target.closest('#showRegister')) {
    e.preventDefault();
    alert('Registration feature - Connect to your backend API');
  }
});

// ===== Dark / Light Mode Toggle =====
const themebtn = document.querySelector('.navbar__btn');
const icon = themebtn?.querySelector('i');

if (themebtn && icon) {
  themebtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    if (document.body.classList.contains('dark')) {
      icon.classList.remove('uil-moon');
      icon.classList.add('uil-sun');
    } else {
      icon.classList.remove('uil-sun');
      icon.classList.add('uil-moon');
    }
  });
}

// ===== Sidebar Toggle =====
const sidebarOpenBtn = document.querySelector('.sidebar__toggle-open');
const sidebarCloseBtn = document.querySelector('.sidebar__toggle-close');
const sidebar = document.querySelector('.sidebar');

sidebarOpenBtn.addEventListener('click', () => {
  sidebar.style.left = "0";
  sidebarCloseBtn.style.display = "inline-block";
  sidebarOpenBtn.style.display = "none";
});

sidebarCloseBtn.addEventListener('click', () => {
  sidebar.style.left = "-100%";
  sidebarCloseBtn.style.display = "none";
  sidebarOpenBtn.style.display = "inline-block";
});

// ===== Transactions Data =====
const transactions = [
  { business: "Supermarket", type: "sale", amount: 100000 },
  { business: "Wigs", type: "sale", amount: 50000 },
  { business: "Boutique", type: "expense", amount: 35000 },
  { business: "Supermarket", type: "expense", amount: 60000 },
  { business: "Wigs", type: "expense", amount: 40000 },
];

// ===== Calculate Profit =====
function calculateProfit(transactions, selectedBusiness) {
  let sales = 0;
  let expenses = 0;

  transactions.forEach(t => {
    if (selectedBusiness === "All" || t.business === selectedBusiness) {
      if (t.type === "sale") sales += t.amount;
      if (t.type === "expense") expenses += t.amount;
    }
  });

  const profit = sales - expenses;
  return { sales, expenses, profit, shares: Math.floor(profit / 1000) }; // example shares calculation
}

// ===== Update Cards =====
function updateCards(result) {
  document.querySelector("#salesCard h2").innerText = `$${result.sales}`;
  document.querySelector("#expensesCard h2").innerText = `$${result.expenses}`;
  document.querySelector("#profitCard h2").innerText = `$${result.profit}`;
  document.querySelector("#sharesCard h2").innerText = `${result.shares}%`;
}

// ===== Business-specific monthly sales data =====
const businessMonthlyData = {
  "All": [1200, 1900, 3000, 5000, 2300, 3400, 2900, 4100, 3800, 4500, 5200, 6000],
  "Supermarket": [1500, 2200, 3500, 5800, 2800, 4000, 3500, 4800, 4200, 5200, 6000, 7200],
  "Wigs": [800, 1200, 1800, 2800, 1500, 2200, 2000, 2800, 2500, 3000, 3500, 4200],
  "Boutique": [600, 900, 1400, 2200, 1100, 1600, 1400, 2000, 1800, 2200, 2600, 3100]
};

// ===== Chart.js Bar Chart =====
let barChart;
const chart = document.getElementById('chart');
const monthlySales = businessMonthlyData["All"];

if (chart) {
  barChart = new Chart(chart, {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [{
        label: 'Monthly Sales',
        data: monthlySales,
        backgroundColor: '#6366f1'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// ===== Pie Chart Data - Matching HTML labels =====
// This data matches the categories shown in the HTML: Cars, Trucks, Electronics, Others
const pieChartData = {
  labels: ['Cars', 'Trucks', 'Electronics', 'Others'],
  data: [60.4, 20.4, 15.4, 4.0], // Percentages matching HTML
  colors: ['#34d399', '#60a5fa', '#facc15', '#f87171'] // Green, Blue, Yellow, Red
};

// ===== Create Pie Chart =====
let pieChart;
let pieChartCanvas = null; // Will be set when needed

function initializePieChart() {
  // Get the canvas element (re-query in case DOM changed)
  const canvas = document.getElementById("categories");
  
  if (!canvas) {
    console.warn('Pie chart canvas not found');
    return;
  }
  
  // Destroy existing chart if it exists
  if (pieChart) {
    pieChart.destroy();
    pieChart = null;
  }
  
  // Get computed styles for border color
  const computedStyle = getComputedStyle(document.documentElement);
  const bgCard = computedStyle.getPropertyValue('--bg-card').trim() || '#ffffff';
  
  // Create new chart
  pieChart = new Chart(canvas, {
    type: 'pie',
    data: {
      labels: pieChartData.labels,
      datasets: [{
        data: pieChartData.data,
        backgroundColor: pieChartData.colors,
        borderWidth: 3,
        borderColor: bgCard
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.5,
      plugins: {
        legend: { 
          display: false // Hide legend since we have custom HTML list
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${value}%`;
            }
          },
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000
      }
    }
  });
  
  console.log('Pie chart initialized successfully');
}

// Pie chart will be initialized when dashboard section is shown


// ===== Handle Business Selector =====
const businessSelect = document.getElementById("businessSelect");
if (businessSelect) {
  businessSelect.addEventListener("change", (e) => {
    const selectedBusiness = e.target.value;
    const result = calculateProfit(transactions, selectedBusiness);
    updateCards(result);

    // Update chart with business-specific monthly data (if chart exists)
    if (barChart) {
      const newMonthlyData = businessMonthlyData[selectedBusiness] || businessMonthlyData["All"];
      barChart.data.datasets[0].data = newMonthlyData;
      barChart.data.datasets[0].label = selectedBusiness === "All" ? "Monthly Sales" : `${selectedBusiness} Monthly Sales`;
      barChart.update();
    }
  });
}

// ===== Initial Load =====
// Only update cards if we're on the dashboard (will be handled after section restore)
function initializeDashboard() {
  const initialResult = calculateProfit(transactions, "All");
  updateCards(initialResult);
}

// ===== Navigation System =====
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');

// Storage keys
const STORAGE_KEY_SECTION = 'profitix_current_section';
const STORAGE_KEY_SETTINGS_TAB = 'profitix_settings_tab';

function showSection(sectionId) {
  // Hide all sections
  contentSections.forEach(section => {
    section.style.display = 'none';
  });
  
  // Show selected section
  const targetSection = document.getElementById(`${sectionId}-section`);
  if (targetSection) {
    targetSection.style.display = 'block';
  }
  
  // Update active nav link
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    }
  });
  
  // Save current section to localStorage
  localStorage.setItem(STORAGE_KEY_SECTION, sectionId);
  
  // Initialize dashboard data if navigating to dashboard
  if (sectionId === 'dashboard') {
    initializeDashboard();
    // Always initialize pie chart when dashboard is shown
    setTimeout(() => {
      initializePieChart();
    }, 100);
  }
  
  // Initialize analytics charts if navigating to analytics section
  if (sectionId === 'analytics') {
    setTimeout(initAnalyticsCharts, 100);
  }
  
  // Make tables responsive after section change
  setTimeout(() => {
    makeTablesResponsive();
  }, 150);
}

// Restore saved section on page load
function restoreSavedSection() {
  const savedSection = localStorage.getItem(STORAGE_KEY_SECTION);
  
  if (savedSection) {
    // Check if the section exists
    const targetSection = document.getElementById(`${savedSection}-section`);
    if (targetSection) {
      showSection(savedSection);
      
      // If it's the settings section, also restore the saved tab
      if (savedSection === 'settings') {
        const savedTab = localStorage.getItem(STORAGE_KEY_SETTINGS_TAB);
        if (savedTab) {
          setTimeout(() => {
            const tabBtn = document.querySelector(`[data-tab="${savedTab}"]`);
            if (tabBtn) {
              tabBtn.click();
            }
          }, 100);
        }
      }
      
      // Initialize pie chart if on dashboard
      if (savedSection === 'dashboard') {
        setTimeout(() => {
          initializePieChart();
        }, 300);
      }
      return;
    }
  }
  
  // Default to dashboard if no saved section or section doesn't exist
  showSection('dashboard');
  // Initialize pie chart on initial dashboard load
  setTimeout(() => {
    initializePieChart();
  }, 300);
}

// Add click handlers to nav links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const sectionId = link.getAttribute('data-section');
    if (sectionId) {
      showSection(sectionId);
    }
  });
});

// Restore section on page load
document.addEventListener('DOMContentLoaded', () => {
  restoreSavedSection();
});

// ===== Logout Handler with Custom Modal =====
function showLogoutModal() {
  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'logout-modal-overlay';
  modalOverlay.id = 'logoutModal';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'logout-modal-content';
  
  modalContent.innerHTML = `
    <div class="logout-modal-header">
      <h3><i class="uil uil-signout"></i> Confirm Logout</h3>
      <button class="logout-modal-close" id="closeLogoutModal"><i class="uil uil-times"></i></button>
    </div>
    <div class="logout-modal-body">
      <i class="uil uil-signout logout-icon"></i>
      <p>Are you sure you want to logout?</p>
      <small style="display: block; margin-top: 0.5rem; color: var(--text-secondary);">You will need to login again to access your account.</small>
    </div>
    <div class="logout-modal-actions">
      <button class="logout-btn-cancel" id="cancelLogout"><i class="uil uil-times"></i> Cancel</button>
      <button class="logout-btn-confirm" id="confirmLogout"><i class="uil uil-signout"></i> Logout</button>
    </div>
  `;
  
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
  
  // Animate in
  setTimeout(() => {
    modalOverlay.classList.add('show');
  }, 10);
  
  // Cancel button
  document.getElementById('cancelLogout')?.addEventListener('click', () => {
    closeLogoutModal();
  });
  
  // Close button
  document.getElementById('closeLogoutModal')?.addEventListener('click', () => {
    closeLogoutModal();
  });
  
  // Confirm button
  document.getElementById('confirmLogout').addEventListener('click', () => {
    // Clear saved section on logout
    localStorage.removeItem(STORAGE_KEY_SECTION);
    localStorage.removeItem(STORAGE_KEY_SETTINGS_TAB);
    
    // Show logout success message
    modalContent.innerHTML = `
      <div class="logout-modal-header">
        <h3><i class="uil uil-check-circle"></i> Logged Out</h3>
      </div>
      <div class="logout-modal-body logout-success-message">
        <i class="uil uil-check-circle"></i>
        <h4>Successfully Logged Out</h4>
        <p>You have been logged out. Redirecting...</p>
      </div>
    `;
    
    // Logout and redirect to login
    setTimeout(() => {
      closeLogoutModal();
      logout();
    }, 1000);
  });
  
  // Close on overlay click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeLogoutModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      closeLogoutModal();
      document.removeEventListener('keydown', escapeHandler);
    }
  });
}

function closeLogoutModal() {
  const modal = document.getElementById('logoutModal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

// Logout button handler
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  showLogoutModal();
});

// ===== Settings Tabs =====
const settingsTabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

settingsTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.getAttribute('data-tab');
    
    // Remove active class from all tabs and contents
    settingsTabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    tab.classList.add('active');
    const targetContent = document.getElementById(`${targetTab}-tab`);
    if (targetContent) {
      targetContent.classList.add('active');
    }
    
    // Save current settings tab to localStorage
    localStorage.setItem(STORAGE_KEY_SETTINGS_TAB, targetTab);
  });
});

// ===== Global Search =====
document.getElementById('globalSearch')?.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  // Add search functionality based on current section
  console.log('Searching for:', searchTerm);
});

// ===== Design Theme Switcher =====
const designThemeSwitcher = document.getElementById('designThemeSwitcher');
if (designThemeSwitcher) {
  designThemeSwitcher.addEventListener('click', () => {
    document.body.classList.toggle('enhanced-design');
    const isEnhanced = document.body.classList.contains('enhanced-design');
    localStorage.setItem('profitix_design_theme', isEnhanced ? 'enhanced' : 'original');
  });
  
  // Restore design theme on load
  const savedTheme = localStorage.getItem('profitix_design_theme');
  if (savedTheme === 'enhanced') {
    document.body.classList.add('enhanced-design');
  }
}

// ===== Make All Buttons Functional =====
document.addEventListener('DOMContentLoaded', () => {
  // Add Product Button
  document.querySelectorAll('.btn-primary').forEach(btn => {
    if (btn.textContent.includes('Add New Product') || btn.textContent.includes('Add Product')) {
      btn.addEventListener('click', () => {
        alert('Add Product feature - Connect to your backend API');
      });
    }
    
    if (btn.textContent.includes('Add Customer')) {
      btn.addEventListener('click', () => {
        alert('Add Customer feature - Connect to your backend API');
      });
    }
    
    if (btn.textContent.includes('Create Campaign')) {
      btn.addEventListener('click', () => {
        alert('Create Campaign feature - Connect to your backend API');
      });
    }
    
    if (btn.textContent.includes('Add Shipment')) {
      btn.addEventListener('click', () => {
        alert('Add Shipment feature - Connect to your backend API');
      });
    }
    
    if (btn.textContent.includes('Export')) {
      btn.addEventListener('click', () => {
        alert('Export feature - Download data as CSV/PDF');
      });
    }
    
    if (btn.textContent.includes('Save Changes')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Settings saved successfully!');
      });
    }
    
    if (btn.textContent.includes('Update Password')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Password updated successfully!');
      });
    }
  });
  
  // Edit Buttons
  document.querySelectorAll('.btn-edit, .icon-btn').forEach(btn => {
    if (btn.querySelector('.uil-edit')) {
      btn.addEventListener('click', () => {
        alert('Edit feature - Open edit modal/form');
      });
    }
  });
  
  // Delete Buttons
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this item?')) {
        alert('Item deleted successfully!');
        // In production, remove from DOM or call API
      }
    });
  });
  
  // View Buttons
  document.querySelectorAll('.btn-view, .icon-btn').forEach(btn => {
    if (btn.querySelector('.uil-eye')) {
      btn.addEventListener('click', () => {
        alert('View details - Open detail modal');
      });
    }
  });
  
  // Download Buttons
  document.querySelectorAll('.icon-btn').forEach(btn => {
    if (btn.querySelector('.uil-download')) {
      btn.addEventListener('click', () => {
        alert('Downloading report...');
      });
    }
  });
  
  // View Details Buttons
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('View Details') || btn.textContent.includes('Veiw Details')) {
      btn.addEventListener('click', () => {
        alert('View Details - Show more information');
      });
    }
    
    if (btn.textContent.includes('View Events')) {
      btn.addEventListener('click', () => {
        alert('View Events - Show all events');
      });
    }
  });
  
  // Filter and Search functionality
  document.querySelectorAll('.search-input, .filter-select').forEach(input => {
    input.addEventListener('change', () => {
      console.log('Filter/Search applied:', input.value);
    });
  });
  
  // Make tables responsive for mobile
  makeTablesResponsive();
});

// ===== Make Tables Responsive for Mobile =====
function makeTablesResponsive() {
  const tables = document.querySelectorAll('.data-table');
  
  tables.forEach(table => {
    const headers = table.querySelectorAll('thead th');
    const rows = table.querySelectorAll('tbody tr');
    
    headers.forEach((header, index) => {
      const headerText = header.textContent.trim();
      rows.forEach(row => {
        const cell = row.querySelectorAll('td')[index];
        if (cell) {
          cell.setAttribute('data-label', headerText);
        }
      });
    });
  });
}

// Initialize tables on page load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    makeTablesResponsive();
  }, 500);
});

// ===== Initialize Analytics Charts (when analytics section is loaded) =====
let revenueChart, categoryChart, customerChart, topProductsChart;

function initAnalyticsCharts() {
  // Revenue Trend Chart
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx && !revenueChart) {
    revenueChart = new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Revenue',
          data: [12000, 19000, 15000, 25000, 22000, 30000],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // Category Sales Chart
  const categoryCtx = document.getElementById('categoryChart');
  if (categoryCtx && !categoryChart) {
    categoryChart = new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: ['Electronics', 'Clothing', 'Accessories', 'Home'],
        datasets: [{
          data: [35, 25, 20, 20],
          backgroundColor: ['#34d399', '#60a5fa', '#facc15', '#f87171']
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  // Customer Growth Chart
  const customerCtx = document.getElementById('customerChart');
  if (customerCtx && !customerChart) {
    customerChart = new Chart(customerCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'New Customers',
          data: [120, 150, 180, 200, 170, 220],
          backgroundColor: '#10b981'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // Top Products Chart
  const topProductsCtx = document.getElementById('topProductsChart');
  if (topProductsCtx && !topProductsChart) {
    topProductsChart = new Chart(topProductsCtx, {
      type: 'bar',
      data: {
        labels: ['Product A', 'Product B', 'Product C', 'Product D'],
        datasets: [{
          label: 'Sales',
          data: [4500, 3200, 2800, 2100],
          backgroundColor: '#8b5cf6'
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        scales: {
          x: { beginAtZero: true }
        }
      }
    });
  }
}

// Note: Analytics charts initialization is now handled in showSection function
