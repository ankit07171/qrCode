"use client";

import { useState } from 'react';
import QRCode from '@/app/components/qrcode';

export default function Home() {
  const [input, setInput] = useState('');
  const [token, setToken] = useState('');

  const handleGenerate = async () => {
    if (!input.trim()) return alert("Please enter a URL");

    // Normalize URL
    let url = input.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setToken(data.token);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🎯 Temporary QR Generator</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter URL (e.g. youtube.com)"
        style={{ padding: 8, width: 300 }}
      />
      <button onClick={handleGenerate} style={{ marginLeft: 10, padding: "8px 16px" }}>
        Generate QR
      </button>

      <div style={{ marginTop: 30 }}>
        {token && (
          <div>
            <h3>📷 Scan this QR</h3>
            <QRCode
              data={`${window.location.origin}/s?token=${token}`}
              width={300}
            />
          </div>
        )}
      </div>
    </div>
  );
}
