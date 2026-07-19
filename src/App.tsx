import { useState } from 'react';
import { ExternalLink, Cpu, Layers, LogOut, Loader, Settings, Save, X, Lock, User, Eye, EyeOff, Grid3X3, CircleCheck, Clock3, BarChart3, PieChart, BriefcaseBusiness } from 'lucide-react';
import { projects, MASTER_CREDENTIALS } from './config';

const DEFAULT_CREDS: Record<string, { u: string, p: string }> = {
  'labour-management': { u: 'owner', p: '123' },
  'stock-management': { u: 'admin', p: '123' },
  'md-panel': { u: '', p: '' },
  'rattles-stock': { u: 'admin', p: 'admin123' },
  'bafna-toys': { u: 'bafnatoyss@gmail.com', p: 'Admin123' },
  'bafna-daily': { u: 'admin@reteiler.in', p: 'Admin@123' }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem('md_hub_logged_in') === 'true'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showMasterPassword, setShowMasterPassword] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [tempCreds, setTempCreds] = useState<Record<string, { u: string, p: string }>>(() => {
    const creds: Record<string, { u: string, p: string }> = {};
    projects.forEach(p => {
      const saved = localStorage.getItem(`sso_creds_${p.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          creds[p.id] = { u: parsed.username || '', p: parsed.password || '' };
        } catch (e) {
          creds[p.id] = { ...DEFAULT_CREDS[p.id] };
        }
      } else {
        creds[p.id] = { ...DEFAULT_CREDS[p.id] };
      }
    });
    return creds;
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    setTimeout(() => {
      if (
        username === MASTER_CREDENTIALS.username &&
        password === MASTER_CREDENTIALS.password
      ) {
        sessionStorage.setItem('md_hub_logged_in', 'true');
        sessionStorage.setItem('md_hub_user', username);
        sessionStorage.setItem('md_hub_pass', password);
        setIsLoggedIn(true);
      } else {
        setLoginError('Invalid Username or Password.');
      }
      setLoginLoading(false);
    }, 600);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('md_hub_logged_in');
    sessionStorage.removeItem('md_hub_user');
    sessionStorage.removeItem('md_hub_pass');
    setIsLoggedIn(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    Object.keys(tempCreds).forEach(id => {
      localStorage.setItem(`sso_creds_${id}`, JSON.stringify({
        username: tempCreds[id].u,
        password: tempCreds[id].p
      }));
    });
    setIsSettingsOpen(false);
  };

  // Generate the SSO token from saved portal credentials
  const getSSOUrl = (baseUrl: string, projectId: string) => {
    const saved = localStorage.getItem(`sso_creds_${projectId}`);
    let u = '';
    let p = '';
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        u = parsed.username || '';
        p = parsed.password || '';
      } catch (e) {}
    }
    if (!u || !p) {
      u = DEFAULT_CREDS[projectId]?.u || '';
      p = DEFAULT_CREDS[projectId]?.p || '';
    }
    const token = btoa(`${u}:${p}`);
    return `${baseUrl}?sso=${token}`;
  };

  // If not logged in, show the beautiful Login Screen
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div className="glass-panel animate-fade-in" style={{
          width: '100%',
          maxWidth: '420px',
          padding: '40px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(124, 92, 237, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
              padding: '12px',
              borderRadius: '16px',
              border: '1px solid rgba(124, 92, 237, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cpu size={24} style={{ color: '#7c3aed' }} />
            </div>
            <div>
              <h2 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 850, letterSpacing: '-0.02em', margin: 0 }}>
                MD Command Center
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                Sign in to launch your enterprise applications.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.4)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showMasterPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.4)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowMasterPassword(!showMasterPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    zIndex: 10
                  }}
                >
                  {showMasterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {loginError && (
              <p style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center', margin: 0 }}>
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: 750,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)'
              }}
            >
              {loginLoading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="command-center-page">
      <div className="command-center-shell">
      {/* Header Panel */}
      <div className="glass-panel animate-fade-in command-header" style={{
        padding: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.5)'
      }}>
        <div className="command-brand" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="command-logo" style={{
            background: 'linear-gradient(135deg, rgba(124, 92, 237, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
            padding: '16px',
            borderRadius: '20px',
            border: '1px solid rgba(124, 92, 237, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span>MD</span>
          </div>
          <div>
            <h1 className="command-title" style={{ fontSize: '2.5rem', fontWeight: 850, letterSpacing: '-0.02em', margin: 0 }}>
              MD Command Center
            </h1>
            <p className="command-subtitle" style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '6px' }}>
              One command center. Every business.
            </p>
          </div>
        </div>

        <div className="command-actions" style={{ display: 'flex', gap: '12px' }}>
          <div className="system-health">
            <span className="system-health-dot" />
            <div>
              <small>System Status</small>
              <strong>All Systems Operational</strong>
            </div>
          </div>
          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="command-button command-button-settings"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(124, 92, 237, 0.06)',
              border: '1px solid rgba(124, 92, 237, 0.2)',
              color: '#7c3aed',
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 650,
              cursor: 'pointer',
              transition: 'background-color 0.2s, border-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(124, 92, 237, 0.1)';
              e.currentTarget.style.borderColor = '#7c3aed';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(124, 92, 237, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(124, 92, 237, 0.2)';
            }}
          >
            Settings <Settings size={16} />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="command-button command-button-logout"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 650,
              cursor: 'pointer',
              transition: 'background-color 0.2s, border-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
            }}
          >
            Sign Out <LogOut size={16} />
          </button>
        </div>
      </div>

      <section className="command-overview animate-fade-in" aria-label="Application overview">
        <div className="overview-item overview-purple">
          <span className="overview-icon"><Grid3X3 size={23} /></span>
          <div><strong>{projects.length} Applications</strong><small>All enterprise applications</small></div>
        </div>
        <div className="overview-item overview-green">
          <span className="overview-icon"><CircleCheck size={23} /></span>
          <div><strong>All Systems Operational</strong><small>Everything is running smoothly</small></div>
        </div>
        <div className="overview-item overview-blue">
          <span className="overview-icon"><Clock3 size={23} /></span>
          <div><strong>Last synced just now</strong><small>Real-time system synchronization</small></div>
        </div>
      </section>

      {/* Grid of Cards */}
      <div className="animate-fade-in command-app-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '32px'
      }}>
        {projects.map((project) => {
          const mainUrl = project.sso === false
            ? project.prodUrl
            : getSSOUrl(project.prodUrl, project.id);

          return (
            <div 
              key={project.id}
              className="glass-panel command-app-card"
              style={{
                '--card-accent': project.themeColor,
                '--card-glow': project.accentGlow,
              } as React.CSSProperties}
            >
              {/* Background Glow Effect */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '150px',
                height: '150px',
                background: `radial-gradient(circle, ${project.themeColor}12 0%, transparent 70%)`,
                borderRadius: '50%',
                pointerEvents: 'none'
              }} />

              {/* Status Header */}
              <div className="card-status-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="operational-badge" style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: 'rgba(16, 185, 129, 0.06)', 
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '12px'
                }}>
                  <span className="pulse-active" /> OPERATIONAL
                </span>
                <span className="admin-badge" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Layers size={14} /> ADMIN
                </span>
              </div>

              {/* 3D Isometric Image */}
              <div className="card-visual" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '8px 0' }}>
                {project.id === 'md-panel' ? (
                  <div className="md-executive-visual" aria-label="MD executive dashboard illustration">
                    <span className="executive-screen executive-screen-left"><BarChart3 size={30} /></span>
                    <span className="executive-screen executive-screen-right"><PieChart size={28} /></span>
                    <span className="executive-desk"><BriefcaseBusiness size={26} /></span>
                  </div>
                ) : (
                  <img 
                    src={project.imgUrl} 
                    alt={project.name}
                    style={{
                      width: '100%',
                      maxWidth: '160px',
                      height: 'auto',
                      aspectRatio: '1 / 1',
                      borderRadius: '24px',
                      objectFit: 'cover',
                      boxShadow: `0 8px 20px ${project.accentGlow.replace('0.4', '0.2')}`
                    }}
                  />
                )}
              </div>

              {/* Info text */}
              <div className="card-info">
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {project.name}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginTop: '8px', minHeight: '54px' }}>
                  {project.description}
                </p>
              </div>

              {/* Primary Action Button */}
              <a 
                href={mainUrl}
                target="_blank"
                rel="noreferrer"
                className="card-launch-button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${project.themeColor} 0%, ${project.themeColor}cc 100%)`,
                  color: '#ffffff',
                  fontWeight: 750,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: `0 4px 12px ${project.accentGlow.replace('0.4', '0.25')}`,
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.92'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Launch Application <ExternalLink size={16} />
              </a>

              {/* Quick Links Section */}
              <div className="card-quick-links" style={{ 
                borderTop: '1px solid rgba(15, 23, 42, 0.06)', 
                paddingTop: '20px',
                marginTop: '8px',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}>
                <span className="quick-links-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Related Interfaces
                </span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {project.quickLinks.map((link, idx) => {
                    const isStaffPath = link.prodPath.includes('/staff') || link.prodPath.includes('/employee');
                    const linkUrl = link.sso === false || isStaffPath
                      ? link.prodPath
                      : getSSOUrl(link.prodPath, project.id);
                    return (
                      <a
                        key={idx}
                        href={linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="quick-link-pill"
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-primary)',
                          background: 'rgba(15, 23, 42, 0.02)',
                          border: '1px solid rgba(15, 23, 42, 0.05)',
                          padding: '6px 12px',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          fontWeight: 600,
                          transition: 'background-color 0.2s, border-color 0.2s, color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
                          e.currentTarget.style.borderColor = project.themeColor;
                          e.currentTarget.style.color = project.themeColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.02)';
                          e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.05)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={22} style={{ color: '#7c3aed' }} />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  SSO Portals Credentials
                </h2>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              Aapke alag-alag admin panels ke actual database usernames aur passwords yahan enter karein. Ye values browser local storage me hi save rahengi aur direct login redirects me use hongi.
            </p>

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {projects.filter(p => p.sso !== false).map(p => (
                  <div key={p.id} style={{
                    background: 'rgba(255,255,255,0.3)',
                    border: '1px solid rgba(15, 23, 42, 0.05)',
                    padding: '16px',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.themeColor }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: 750, color: 'var(--text-primary)' }}>
                        {p.name}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 650, color: 'var(--text-muted)' }}>Admin Username / Email</label>
                        <div style={{ position: 'relative' }}>
                          <User size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                          <input
                            type="text"
                            value={tempCreds[p.id]?.u || ''}
                            onChange={e => setTempCreds(prev => ({
                              ...prev,
                              [p.id]: { ...prev[p.id], u: e.target.value }
                            }))}
                            placeholder="e.g. admin"
                            required
                            style={{
                              width: '100%',
                              padding: '8px 8px 8px 30px',
                              borderRadius: '8px',
                              border: '1px solid var(--glass-border)',
                              background: 'rgba(255,255,255,0.6)',
                              fontSize: '0.82rem',
                              outline: 'none'
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 650, color: 'var(--text-muted)' }}>Admin Password</label>
                        <div style={{ position: 'relative' }}>
                          <Lock size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                          <input
                            type={showPasswords[p.id] ? "text" : "password"}
                            value={tempCreds[p.id]?.p || ''}
                            onChange={e => setTempCreds(prev => ({
                              ...prev,
                              [p.id]: { ...prev[p.id], p: e.target.value }
                            }))}
                            placeholder="e.g. password123"
                            required
                            style={{
                              width: '100%',
                              padding: '8px 32px 8px 30px',
                              borderRadius: '8px',
                              border: '1px solid var(--glass-border)',
                              background: 'rgba(255,255,255,0.6)',
                              fontSize: '0.82rem',
                              outline: 'none'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                            style={{
                              position: 'absolute',
                              right: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--text-muted)',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              zIndex: 10
                            }}
                          >
                            {showPasswords[p.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.5)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    fontWeight: 650,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)'
                  }}
                >
                  Save Settings <Save size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="glass-panel animate-fade-in command-footer" style={{
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
      }}>
        Bafna MD Command Dashboard. Developed in 2026. All operations running securely.
      </div>
      </div>
    </div>
  );
}
