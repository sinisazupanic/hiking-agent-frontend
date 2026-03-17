import { useState } from 'react';

const API_URL = "https://hiking-agent-node.azurewebsites.net/api/analyze";

function App() {
  const [route, setRoute]       = useState('');
  const [days, setDays]         = useState(1);
  const [level, setLevel]       = useState('srednji');
  const [loading, setLoading]   = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = async () => {
    if (!route.trim()) { setError('Unesite naziv rute!'); return; }
    setLoading(true); setError(''); setResponse('');

    try {
      const res  = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ route, days, level })
      });
      const data = await res.json();
      if (data.success) setResponse(data.response);
      else setError('Greška: ' + data.error);
    } catch {
      setError('Ne mogu se spojiti na server.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24, fontFamily: 'Georgia, serif' }}>
      <h1 style={{ color: '#2d6a4f', textAlign: 'center' }}>⛰️ Hiking AI Agent</h1>
      <p style={{ textAlign: 'center', color: '#555' }}>Tvoj osobni planinski vodič</p>

      <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.1)', marginBottom: 20 }}>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#2d6a4f', marginBottom: 6 }}>🗺️ Naziv rute</label>
          <input
            type="text"
            placeholder="npr. Premužićeva staza, Sljeme, Risnjak..."
            value={route}
            onChange={e => setRoute(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: '2px solid #d1e8d8', borderRadius: 8, fontSize: '1rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#2d6a4f', marginBottom: 6 }}>📅 Broj dana: <strong>{days}</strong></label>
          <input type="range" min="1" max="10" value={days} onChange={e => setDays(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#2d6a4f' }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#2d6a4f', marginBottom: 6 }}>🏃 Razina iskustva</label>
          <select value={level} onChange={e => setLevel(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: '2px solid #d1e8d8', borderRadius: 8, fontSize: '1rem' }}>
            <option value="pocetnik">Početnik</option>
            <option value="srednji">Srednji</option>
            <option value="napredno">Napredno</option>
          </select>
        </div>

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', padding: 14, background: loading ? '#aaa' : '#2d6a4f', color: 'white', border: 'none', borderRadius: 8, fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600 }}>
          {loading ? '⏳ Analiziram rutu...' : '🔍 Analiziraj rutu'}
        </button>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: 14, borderRadius: 8, marginBottom: 16 }}>❌ {error}</div>}

      {response && (
        <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#2d6a4f', marginTop: 0 }}>📋 Plan za tvoj izlet</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'Georgia, serif', lineHeight: 1.7, color: '#333', fontSize: '0.95rem' }}>{response}</pre>
        </div>
      )}
    </div>
  );
}

export default App;