import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle, Navigation, Clock, User, ArrowRight, Bookmark, ChevronDown } from 'lucide-react';
import MapComponent from './MapComponent';

const RouteView = ({ request, profile, onBack, onSave, savedRoutes = [], onSelect, mode = 'route' }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showSavedDropdown, setShowSavedDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [nearbyHazards, setNearbyHazards] = useState([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSavedDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    onSave({
      start: request.start,
      dest: request.dest,
      stops: request.stops || [],
      date: new Date().toLocaleDateString()
    });
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      if (mode === 'route') {
        // Normal Route Simulation
        setRoutes([
          {
            id: 1,
            type: 'Safest',
            time: '18 min',
            distance: '0.8 km',
            score: 95,
            hazards: [],
            details: 'Wide sidewalks, no stairs, ramp access confirmed.'
          },
          {
            id: 2,
            type: 'Fastest',
            time: '12 min',
            distance: '0.6 km',
            score: 65,
            hazards: ['Steep Slope (8%)', 'Construction near corner'],
            details: 'Direct path but has significant incline and road work.'
          }
        ]);
      } else {
        // Hazard Scan Mode
        const hazards = [];
        const types = ['Crowd', 'Construction', 'Obstacle'];
        for (let i = 0; i < 8; i++) {
          const type = types[Math.floor(Math.random() * types.length)];
          hazards.push({
            type,
            latOffset: (Math.random() - 0.5) * 0.015,
            lngOffset: (Math.random() - 0.5) * 0.015,
            details: type === 'Crowd' ? 'High density' : 'Blocked path',
          });
        }
        setNearbyHazards(hazards);
      }
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [request, mode]);

  // Simulate incoming live event
  useEffect(() => {
    if (loading) return;
    
    const eventTimer = setTimeout(() => {
      setAlert({
        type: 'Obstacle Detected',
        msg: 'Live Cam: Construction barrier detected on Route 2.',
        routeId: 2
      });
      
      // Downgrade score of Route 2
      setRoutes(prev => prev.map(r => r.id === 2 ? { ...r, score: 40, hazards: [...r.hazards, 'Blocked Sidewalk'] } : r));
    }, 4000);

    return () => clearTimeout(eventTimer);
  }, [loading]);

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ marginBottom: '20px', color: 'hsl(var(--primary))' }}>
           <Navigation className="spin" size={40} />
        </div>
        <h3>Analyzing City Data...</h3>
        <p style={{ color: 'hsl(var(--text-muted))' }}>Checking ramps, construction, and crowds.</p>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '4fr 1fr', gap: '20px', height: 'calc(100vh - 170px)' }}>
      
      {/* Left Column: Map (3fr) */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Back Button (Left) */}
          <button onClick={onBack} style={{ background: 'none', color: 'hsl(var(--text-muted))', display: 'flex', alignItems: 'center' }}>
            &larr; Back
          </button>

          {/* Title & Actions Group (Right) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h3 style={{ margin: 0 }}>
              {mode === 'hazards' ? 'Nearby Hazards (1km Radius)' : `Routes to ${request.dest}`}
            </h3>
            
            {mode === 'route' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={handleSave} 
                  className="btn-outline"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <CheckCircle size={14} /> Save Route
                </button>
              
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button 
                  onClick={() => setShowSavedDropdown(!showSavedDropdown)}
                  className="btn-outline"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Bookmark size={14} /> Saved Routes <ChevronDown size={12} />
                </button>
                
                {showSavedDropdown && (
                  <div className="fade-in" style={{
                    position: 'absolute',
                    top: '110%',
                    left: 'auto',
                    right: 0, 
                    width: '260px',
                    background: 'hsl(var(--bg-card))',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 50,
                    padding: '8px',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {savedRoutes.length === 0 ? (
                       <div style={{ padding: '8px', fontSize: '0.8rem', color: 'hsl(var(--text-muted))', textAlign: 'center' }}>No saved routes yet.</div>
                    ) : (
                      savedRoutes.map(route => (
                        <div 
                          key={route.id}
                          onClick={() => {
                            onSelect(route);
                            setShowSavedDropdown(false);
                            setLoading(true); 
                          }}
                          style={{
                            padding: '10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            marginBottom: '4px',
                            background: 'rgba(255,255,255,0.02)',
                            transition: 'background 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        >
                           <div style={{ overflow: 'hidden' }}>
                             <div style={{ fontSize: '0.85rem', fontWeight: '500', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{route.dest}</div>
                             <div style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>From {route.start}</div>
                           </div>
                           <ArrowRight size={14} color="hsl(var(--primary))" />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          <MapComponent 
            startCoords={request.start} 
            endCoords={mode === 'route' ? request.dest : null} 
            obstacles={alert ? [{ message: alert.msg }] : []}
            nearbyHazards={nearbyHazards}
            // Passing a style prop or ensuring MapComponent fills flexible height is key. 
            // We'll update MapComponent next to ensure it takes 100% height of parent if container has height.
          />
        </div>
      </div>

      {/* Right Column: Alerts & Routes (1fr) */}
      <div style={{ overflowY: 'auto', padding: '20px', background: 'rgba(0,0,0,0.2)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        
        {/* Live Alerts Section */}
        {alert && (
          <div className="card fade-in" style={{ background: 'hsl(var(--danger))', color: 'white', padding: '12px', border: 'none', marginBottom: '16px' }}>
             <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
               <AlertTriangle size={20} />
               <div>
                 <strong style={{ fontSize: '0.9rem' }}>{alert.type}</strong>
                 <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{alert.msg}</div>
                 <div style={{ marginTop: '4px', fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                   Rerouting suggested
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* Route Cards */}
        {routes.map(route => (
          <div key={route.id} className="card" style={{ padding: '16px', marginBottom: '12px', background: route.score > 80 ? 'hsl(var(--bg-card))' : 'rgba(255, 50, 50, 0.05)', borderColor: route.score > 80 ? 'hsl(var(--success))' : 'transparent' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <span style={{ 
                  background: route.score > 80 ? 'hsl(var(--success))' : 'hsl(var(--warning))', 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '100px', 
                  fontSize: '0.7rem', 
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {route.type}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'hsl(var(--text-muted))', fontSize: '0.8rem' }}>
                  <Clock size={14} /> {route.time}
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 'bold', color: route.score > 80 ? 'hsl(var(--success))' : 'hsl(var(--warning))' }}>
                  {route.score}%
                </span>
              </div>
            </div>
            
            <p style={{ marginBottom: '12px', fontSize: '0.85rem', lineHeight: '1.4' }}>{route.details}</p>

            {route.hazards.length > 0 && (
               <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
                 <div style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', marginBottom: '4px', fontWeight: '600' }}>HAZARDS</div>
                 {route.hazards.map((h, i) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'hsl(var(--danger))', fontSize: '0.8rem', marginBottom: '2px' }}>
                     <AlertTriangle size={12} /> {h}
                   </div>
                 ))}
               </div>
            )}

            <button className="btn-primary" style={{ width: '100%', padding: '8px', fontSize: '0.9rem', background: route.score > 80 ? '' : 'hsl(var(--bg-input))' }}>
               Start <ArrowRight size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
            </button>
          </div>
        ))}
        
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '20px' }}>
          Real-time Data Active
        </div>
      </div>
    </div>
  );
};

export default RouteView;
