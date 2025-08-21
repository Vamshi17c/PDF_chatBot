import React, { useState } from 'react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file.');
      return;
    }
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      setSuccess('✅ PDF uploaded successfully!');
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div style={{
      maxWidth: 600,
      margin: '40px auto',
      padding: 32,
      borderRadius: 18,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      background: 'linear-gradient(135deg, #f0fff4 0%, #e6ffe6 100%)',
      fontFamily: 'Segoe UI, Arial, sans-serif',
    }}>
      <h2 style={{ fontWeight: 800, marginBottom: 24, color: '#2e7d32' }}>
        Upload Your PDF
      </h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ marginBottom: 16 }}
      />

      <button
        onClick={handleUpload}
        style={{
          padding: '12px 24px',
          borderRadius: 8,
          border: 'none',
          background: 'linear-gradient(90deg, #2e7d32 0%, #66bb6a 100%)',
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Upload
      </button>

      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 12 }}>{success}</div>}
    </div>
  );
};

export default Upload;
