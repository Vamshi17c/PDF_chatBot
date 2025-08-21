import React from 'react';
import Upload from './components/Upload';
import Chat from './components/Chat';
import './App.css';

function App() {
  return (
    <div style={{
      fontFamily: 'Segoe UI, Arial, sans-serif',
      padding: 20,
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: 40,
      }}>
        <h1 style={{
          fontSize: 36,
          fontWeight: 800,
          color: '#222',
          letterSpacing: 1,
        }}>
          PDF Q&A Chatbot
        </h1>
        <p style={{ color: '#555', marginTop: 8 }}>
          Upload a PDF and then ask questions about it
        </p>
      </div>

      {/* Upload Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 40,
      }}>
        <Upload />
      </div>

      {/* Chat Section */}
      <div>
        <Chat />
      </div>
    </div>
  );
}

export default App;
