// Theme Switcher
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeOptions = document.getElementById('theme-options');

  // Check if there's a saved theme preference
  const savedTheme = localStorage.getItem('theme');

  // Set initial theme based on saved preference or default to system
  if (savedTheme) {
    // First, remove both theme classes to start clean
    document.body.classList.remove('light-mode', 'dark-mode');

    // Apply the saved theme class if it's not system
    if (savedTheme !== 'system') {
      document.body.classList.add(`${savedTheme}-mode`);

      // Force the HTML tag to have the data-force-theme attribute
      // This will override any system preference
      document.documentElement.setAttribute('data-force-theme', savedTheme);
    } else {
      // If system theme, remove any forced theme attribute
      document.documentElement.removeAttribute('data-force-theme');
    }

    updateToggleText(savedTheme);
  } else {
    // Default to system theme
    document.documentElement.removeAttribute('data-force-theme');
    updateToggleText('system');
  }

  // Toggle theme options visibility
  themeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    themeOptions.classList.toggle('show');
  });

  // Handle theme option selection
  document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedTheme = e.currentTarget.dataset.theme;

      // First remove all theme classes
      document.body.classList.remove('light-mode', 'dark-mode');

      // Handle theme application based on selection
      if (selectedTheme !== 'system') {
        // Apply the selected theme class
        document.body.classList.add(`${selectedTheme}-mode`);

        // Force the theme by setting an attribute on html element
        // This ensures system preferences don't interfere
        document.documentElement.setAttribute('data-force-theme', selectedTheme);
      } else {
        // For system theme, remove the forced theme attribute
        document.documentElement.removeAttribute('data-force-theme');
      }

      // Save preference
      localStorage.setItem('theme', selectedTheme);

      // Update toggle text
      updateToggleText(selectedTheme);

      // Hide options
      themeOptions.classList.remove('show');
    });
  });

  // Close theme options when clicking outside
  document.addEventListener('click', (e) => {
    if (!themeToggle.contains(e.target) && !themeOptions.contains(e.target)) {
      themeOptions.classList.remove('show');
    }
  });

  // Update toggle button text based on current theme
  function updateToggleText(theme) {
    switch(theme) {
      case 'light':
        themeToggle.innerHTML = '☀';
        themeToggle.title = 'Light theme active (click to change)';
        break;
      case 'dark':
        // Using a more visible moon symbol for dark mode
        themeToggle.innerHTML = '☽';
        themeToggle.title = 'Dark theme active (click to change)';
        break;
      default: // system
        themeToggle.innerHTML = '◑';
        themeToggle.title = 'System theme active (click to change)';
        break;
    }
  }
});
