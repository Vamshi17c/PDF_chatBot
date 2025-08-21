import React from 'react';
import Upload from './components/Upload';
import Chat from './components/Chat';
import './App.css';

function App() {
  return (
    <div>
      <div style={{
        padding: 12,
        marginLeft: 550,
        fontFamily: 'Segoe UI, Arial, sans-serif',
      }}>
        <h1 style={{
          fontSize: 36,
          fontWeight: 800,
          color: '#222',
          letterSpacing: 1,
          marginBottom: 40,
          textAlign: 'left',
        }}>PDF Q&A Chatbot</h1>
      </div>

      {/* Upload Section */}
      <Upload />

      {/* Chat Section */}
      <Chat />
    </div>
  );
}

export default App;
