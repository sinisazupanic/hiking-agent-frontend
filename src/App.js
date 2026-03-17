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
    <div style={{
      minHeight: '100vh',
      background: `
        linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,20,10,0.7) 100%),
        url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80')
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      fontFamily: "'Georgia', serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>

      {/* HEADER */}
      <div style={{ textAlign: 'center', padding: '60px 20px 30px', color: 'white' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>⛰️</div>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: '700',
          margin: '0 0 10px',
          color: 'white',
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          letterSpacing: '-1px',
        }}>
          Hiking AI Agent
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.75)',
          fontSize: '1.1rem',
          margin: 0,
          letterSpacing: '1px',
        }}>
          Tvoj osobni planinski vodič
        </p>
      </div>

      {/* FORMA */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '620px',
        margin: '0 20px 24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        boxSizing: 'border-box',
      }}>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1a3a2a', marginBottom: '8px', fontSize: '0.95rem' }}>
            🗺️ Naziv rute
          </label>
          <input
            type="text"
            placeholder="npr. Premužićeva staza, Sljeme, Risnjak..."
            value={route}
            onChange={e => setRoute(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              width: '100%', padding: '12px 16px',
              border: '2px solid #c8e0cc', borderRadius: '10px',
              fontSize: '1rem', boxSizing: 'border-box',
              outline: 'none', transition: 'border 0.2s',
              fontFamily: 'Georgia, serif',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1a3a2a', marginBottom: '8px', fontSize: '0.95rem' }}>
            📅 Broj dana: <span style={{ color: '#2d6a4f', fontWeight: '900' }}>{days}</span>
          </label>
          <input
            type="range" min="1" max="14" value={days}
            onChange={e => setDays(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#2d6a4f', height: '6px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.75rem', marginTop: '4px' }}>
            <span>1 dan</span><span>14 dana</span>
          </div>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontWeight: '700', color: '#1a3a2a', marginBottom: '8px', fontSize: '0.95rem' }}>
            🏃 Razina iskustva
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { val: 'pocetnik',  label: '🌱 Početnik' },
              { val: 'srednji',   label: '🥾 Srednji' },
              { val: 'napredno', label: '🏆 Napredno' },
            ].map(opt => (
              <button key={opt.val} onClick={() => setLevel(opt.val)} style={{
                flex: 1, padding: '10px',
                background: level === opt.val ? '#2d6a4f' : 'white',
                color:      level === opt.val ? 'white'   : '#2d6a4f',
                border:     `2px solid ${level === opt.val ? '#2d6a4f' : '#c8e0cc'}`,
                borderRadius: '10px', cursor: 'pointer',
                fontWeight: '600', fontSize: '0.85rem',
                fontFamily: 'Georgia, serif',
                transition: 'all 0.2s',
              }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '16px',
          background: loading ? '#aaa' : 'linear-gradient(135deg, #2d6a4f, #1b4332)',
          color: 'white', border: 'none', borderRadius: '12px',
          fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: '700', fontFamily: 'Georgia, serif',
          boxShadow: loading ? 'none' : '0 4px 20px rgba(45,106,79,0.4)',
          transition: 'all 0.2s',
        }}>
          {loading ? '⏳ Analiziram rutu...' : '🔍 Analiziraj rutu'}
        </button>
      </div>

      {/* GREŠKA */}
      {error && (
        <div style={{
          background: 'rgba(254,226,226,0.95)', color: '#b91c1c',
          padding: '14px 20px', borderRadius: '10px',
          maxWidth: '620px', width: '100%', margin: '0 20px 20px',
          boxSizing: 'border-box', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
          ❌ {error}
        </div>
      )}

      {/* ODGOVOR */}
      {response && (
        <div style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: '16px', padding: '32px',
          maxWidth: '620px', width: '100%',
          margin: '0 20px 24px', boxSizing: 'border-box',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <h2 style={{ color: '#1b4332', marginTop: 0, fontSize: '1.3rem' }}>
            📋 Plan za tvoj izlet
          </h2>
          <pre style={{
            whiteSpace: 'pre-wrap', fontFamily: 'Georgia, serif',
            lineHeight: '1.8', color: '#1a2a1a', fontSize: '0.95rem',
            margin: 0,
          }}>
            {response}
          </pre>
        </div>
      )}

      {/* FOOTER */}
      <div style={{
        color: 'rgba(255,255,255,0.5)',
        fontSize: '0.8rem',
        padding: '20px',
        textAlign: 'center',
        letterSpacing: '0.5px',
      }}>
        © 2026 Siniša Županić &nbsp;·&nbsp; Powered by Azure AI &nbsp;·&nbsp; 🏔️
      </div>

    </div>
  );
}

export default App;