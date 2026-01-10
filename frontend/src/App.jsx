import React, { useState, useEffect } from 'react';
import { Map, MessageSquare, Bell, User, Radar } from 'lucide-react';
import ProfileSetup from './components/ProfileSetup';
import RouteRequest from './components/RouteRequest';
import RouteView from './components/RouteView';
import ChatInterface from './components/ChatInterface';
import AlertsFeed from './components/AlertsFeed';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('navigation'); // navigation, chat, alerts, profile
  const [navStep, setNavStep] = useState(1);
  const [profile, setProfile] = useState(null);
  const [request, setRequest] = useState(null);
  const [savedRoutes, setSavedRoutes] = useState([]);

  useEffect(() => {
    // Check for logged in user session (simplified for demo)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Load saved routes
    const storedRoutes = localStorage.getItem('savedRoutes');
    if (storedRoutes) {
      setSavedRoutes(JSON.parse(storedRoutes));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setActiveTab('navigation');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setActiveTab('navigation');
  };

  // Navigation Logic
  const handleProfileComplete = (profileData) => {
    setProfile(profileData);
    setNavStep(2);
  };

  const handleRouteSearch = (requestData) => {
    setRequest(requestData);
    setNavStep(3);
  };

  const handleSaveRoute = (routeData) => {
    const newRoutes = [...savedRoutes, { ...routeData, id: Date.now() }];
    setSavedRoutes(newRoutes);
    localStorage.setItem('savedRoutes', JSON.stringify(newRoutes));
    alert('Route saved successfully!');
  };

  const handleSelectRoute = (savedRoute) => {
    setRequest({ start: savedRoute.start, dest: savedRoute.dest, stops: savedRoute.stops || [] });
    // Optional: Auto-navigate to map or just fill inputs
    // For now, let's just fill inputs by passing data to RouteRequest via props, 
    // OR directly trigger search if we want auto-play. 
    // Let's passed it to RouteRequest to autofill.
    // Actually, RouteRequest needs to know about this selection. 
    // Easier way: Update a 'selectedRoute' state or just pass the search directly if we want to skip step 2?
    // User asked "choose any of route that he saved previously". 
    // Usually means picking it loads it.
    // Let's pass the saved routes to RouteRequest so user can pick there. 
    // If specific logic needed in App, we can add it.
  };

  const handleBack = () => {
    setNavStep(2);
    setRequest(null);
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'hsl(var(--bg-app))', color: 'hsl(var(--text-primary))' }}>
      
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '16px 40px', 
        background: 'rgba(20, 20, 25, 0.8)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Logo Icon */}
          <div style={{ width: '32px', height: '32px', background: 'hsl(var(--primary))', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Map size={20} color="white" />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.02em', margin: 0 }}>Accessible Nav</h1>
        </div>

        <nav style={{ display: 'flex', gap: '32px' }}>
          <button 
            onClick={() => setActiveTab('navigation')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: activeTab === 'navigation' ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
              fontWeight: activeTab === 'navigation' ? '600' : '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.95rem'
            }}
          >
            <Map size={18} /> Navigation
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: activeTab === 'chat' ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
              fontWeight: activeTab === 'chat' ? '600' : '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.95rem'
            }}
          >
            <MessageSquare size={18} /> AI Assistant
          </button>
          <button 
            onClick={() => setActiveTab('alerts')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: activeTab === 'alerts' ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
              fontWeight: activeTab === 'alerts' ? '600' : '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.95rem'
            }}
          >
            <Bell size={18} /> Obstacle Alerts
          </button>
          <button 
            onClick={() => {
              setActiveTab('navigation');
              setNavStep(4);
              if (!request) {
                setRequest({ start: 'Current Location', dest: '' });
              }
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: (activeTab === 'navigation' && navStep === 4) ? 'hsl(var(--danger))' : 'hsl(var(--text-muted))',
              fontWeight: (activeTab === 'navigation' && navStep === 4) ? '600' : '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.95rem'
            }}
          >
            <Radar size={18} /> Nearby Hazards
          </button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <button 
             onClick={() => setActiveTab('profile')}
             style={{ 
               background: activeTab === 'profile' ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.1)', 
               border: 'none', 
               color: 'white', 
               cursor: 'pointer',
               width: '36px',
               height: '36px',
               borderRadius: '50%',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center'
             }}
             title="My Profile"
           >
             <User size={18} />
           </button>
           <button 
             onClick={handleLogout}
             style={{ fontSize: '0.8rem', background: 'none', border: 'none', color: 'hsl(var(--text-muted))', cursor: 'pointer' }}
           >
             Logout
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        padding: (activeTab === 'navigation' && navStep === 3) ? '20px' : '40px',
        maxWidth: (activeTab === 'navigation' && navStep === 3) ? '100%' : '1200px',
        margin: '0 auto'
      }}>
        
        {activeTab === 'navigation' && (
          <div className="fade-in">
            {navStep === 1 && <ProfileSetup onComplete={handleProfileComplete} savedProfile={user?.profile} />}
            {navStep === 2 && (
              <RouteRequest 
                profile={profile} 
                onSearch={handleRouteSearch} 
                savedRoutes={savedRoutes}
              />
            )}
            {navStep === 3 && <RouteView request={request} profile={profile} onBack={handleBack} onSave={handleSaveRoute} savedRoutes={savedRoutes} onSelect={handleSelectRoute} />}
            {navStep === 4 && (
              <RouteView 
                request={request} 
                profile={profile} 
                mode="hazards"
                onBack={handleBack} 
                onSave={() => {}} 
                savedRoutes={savedRoutes}
                onSelect={handleSelectRoute}
              />
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <ChatInterface />
        )}

        {activeTab === 'alerts' && (
          <AlertsFeed />
        )}

        {activeTab === 'profile' && (
          <ProfilePage user={user} />
        )}

      </main>

      {/* Footer */}
      <footer style={{ 
        padding: '24px 40px', 
        textAlign: 'center', 
        color: 'hsl(var(--text-muted))', 
        fontSize: '0.85rem',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        © 2026 Accessible Navigation AI. Empowering mobility for everyone.
      </footer>

    </div>
  );
}

export default App;
