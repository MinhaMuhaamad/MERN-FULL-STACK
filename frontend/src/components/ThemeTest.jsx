import React, { useState } from 'react';

function ThemeTest() {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    console.log('Theme toggled to:', theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <div style={{ 
      backgroundColor: theme === 'dark' ? '#222' : '#f8f9fa',
      color: theme === 'dark' ? '#f8f9fa' : '#333',
      padding: '20px',
      minHeight: '200px'
    }}>
      <h2>Theme Test Component</h2>
      <button onClick={toggleTheme}>
        {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
      </button>
      <p>Current theme: {theme}</p>
    </div>
  );
}

export default ThemeTest;