import React from 'react';
import ProFormaCalculator from './components/ProFormaCalculator';
import PasswordProtection from './components/PasswordProtection';
import './App.css';

function App() {
  return (
    <PasswordProtection>
      <ProFormaCalculator />
    </PasswordProtection>
  );
}

export default App;
