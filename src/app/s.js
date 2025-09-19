"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Scan() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('⏳ Validating QR...');
  const [url, setUrl] = useState('');
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    if (!token) {
      setStatus('❌ No token provided');
      return;
    }

    fetch(`/api/scan?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          setUrl(data.url);
          setStatus('✅ Valid QR! Redirecting...');
          setTimeout(() => {
            window.location.href = data.url;
          }, 1000);
        } else if (data.error?.includes("Please wait")) {
          // Extract seconds left from error
          setStatus('⏳ Too early...');
          setWaitTime(30); // max wait
        } else {
          setStatus(data.error || '❌ Invalid QR code');
        }
      })
      .catch(() => setStatus('❌ Something went wrong'));
  }, [token]);

  // Countdown timer if too early
  useEffect(() => {
    if (waitTime > 0) {
      const timer = setInterval(() => {
        setWaitTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Re-check API after countdown
            fetch(`/api/scan?token=${token}`)
              .then((res) => res.json())
              .then((data) => {
                if (data.url) {
                  setUrl(data.url);
                  setStatus('✅ Valid QR! Redirecting...');
                  setTimeout(() => {
                    window.location.href = data.url;
                  }, 1000);
                } else {
                  setStatus(data.error || '❌ Invalid QR code');
                }
              });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [waitTime, token]);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>{status}</h2>
      {waitTime > 0 && <p>⏳ Please wait {waitTime}s before accessing the link.</p>}
      {url && (
        <p>
          If not redirected automatically, <a href={url} target="_blank" rel="noopener noreferrer">click here</a>.
        </p>
      )}
    </div>
  );
}
