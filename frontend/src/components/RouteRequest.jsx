import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, ArrowUpDown, Plus, X, ArrowRight, Loader } from 'lucide-react';
import { getCurrentLocation, searchAddress } from '../locationService';

const RouteRequest = ({ onSearch, profile, savedRoutes = [] }) => {
  const [start, setStart] = useState('Current Location');
  const [startCoords, setStartCoords] = useState(null);
  
  const [dest, setDest] = useState('');
  const [destCoords, setDestCoords] = useState(null);

  const [stops, setStops] = useState([]); // Array of { value, coords } objects
  
  const [isSearching, setIsSearching] = useState(false);
  
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [activeSuggestionField, setActiveSuggestionField] = useState(null); // 'start', 'dest', or 'stop-Index'

  // Debounce helper
  useEffect(() => {
    const timer = setTimeout(() => {
        if (activeSuggestionField === 'dest' && dest && dest.length > 2) {
            searchAddress(dest).then(setDestSuggestions);
        } else if (activeSuggestionField === 'start' && start && start !== 'Current Location' && start.length > 2) {
            searchAddress(start).then(setStartSuggestions);
        }
    }, 500);
    return () => clearTimeout(timer);
  }, [dest, start, activeSuggestionField]);

  // Initial Location
  useEffect(() => {
    if (start === 'Current Location') {
        getCurrentLocation()
            .then(pos => setStartCoords({ lat: pos.lat, lng: pos.lng }))
            .catch(err => console.warn('Location access denied', err));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!dest) return;
    
    setIsSearching(true);
    // Pass coordinates if we have them, otherwise just strings and let Map component (or backend) resolve them?
    // Better to ensure we have coords. If not, trigger a search for the best match.
    // For now, let's assume user picked from dropdown or we just pass available data.
    
    onSearch({ 
        start, 
        startCoords, 
        dest, 
        destCoords, 
        stops: stops.map(s => s.value) 
    });
    setIsSearching(false);
  };

  const handleFlip = () => {
    const tempStart = start;
    const tempStartCoords = startCoords;
    setStart(dest);
    setStartCoords(destCoords);
    setDest(tempStart);
    setDestCoords(tempStartCoords);
  };

  const handleSelectSuggestion = (field, item) => {
      if (field === 'dest') {
          setDest(item.display_name);
          setDestCoords({ lat: item.lat, lng: item.lng });
          setDestSuggestions([]);
      } else if (field === 'start') {
          setStart(item.display_name);
          setStartCoords({ lat: item.lat, lng: item.lng });
          setStartSuggestions([]);
      }
      setActiveSuggestionField(null);
  };

  const handleUseCurrentLocation = () => {
      setStart('Current Location');
      setStartSuggestions([]);
      getCurrentLocation()
          .then(pos => setStartCoords({ lat: pos.lat, lng: pos.lng }))
          .catch(err => {
              alert('Could not get location.');
              setStart('');
          });
  };

  return (
    <div className="card fade-in" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'hsl(var(--primary))', margin: 0 }}>Where to?</h2>
        <div style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px' }}>
          Profile: {profile?.wheelchair ? 'Wheelchair' : profile?.walker ? 'Walker' : 'Standard'}
        </div>
      </div>

      <form onSubmit={handleSearch}>
        {/* Start Location */}
        <div className="input-group" style={{ marginBottom: '12px', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <MapPin size={20} style={{ position: 'absolute', left: '16px', color: 'hsl(var(--primary))' }} />
            <input
              type="text"
              className="input-field"
              value={start}
              onChange={(e) => {
                  setStart(e.target.value);
                  setActiveSuggestionField('start');
              }}
              onFocus={() => setActiveSuggestionField('start')}
              style={{ paddingLeft: '48px', flex: 1 }}
              placeholder="Start Location"
            />
          </div>
          {/* Start Suggestions */}
          {activeSuggestionField === 'start' && (startSuggestions.length > 0 || start === '') && (
              <div className="suggestions-dropdown" style={{ 
                  position: 'absolute', top: '100%', left: 0, right: 0, 
                  background: 'hsl(var(--bg-card))', border: '1px solid rgba(255,255,255,0.1)', 
                  zIndex: 20, borderRadius: '8px', overflow: 'hidden',
                  marginTop: '4px'
              }}>
                 {start !== 'Current Location' && (
                     <div 
                        onClick={handleUseCurrentLocation}
                        style={{ padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--primary))' }}
                     >
                         <Navigation size={14} /> Use Current Location
                     </div>
                 )}
                 {startSuggestions.map((item, i) => (
                     <div key={i} onClick={() => handleSelectSuggestion('start', item)} style={{ padding: '10px', cursor: 'pointer', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                         {item.display_name}
                         <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{item.type}</div>
                     </div>
                 ))}
              </div>
          )}
        </div>

        {/* Flip Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px', marginRight: '8px' }}>
          <button 
            type="button" 
            onClick={handleFlip}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: 'none', borderRadius: '50%', width: '32px', height: '32px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'hsl(var(--text-muted))'
            }}
          >
            <ArrowUpDown size={16} />
          </button>
        </div>

        {/* Destination */}
        <div className="input-group" style={{ marginBottom: '24px', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <Navigation size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--secondary))' }} />
            <input
              type="text"
              className="input-field"
              value={dest}
              onChange={(e) => {
                  setDest(e.target.value);
                  setActiveSuggestionField('dest');
              }}
              onFocus={() => setActiveSuggestionField('dest')}
              style={{ paddingLeft: '48px' }}
              placeholder="Enter Destination"
            />
          </div>
          {/* Dest Suggestions */}
          {activeSuggestionField === 'dest' && destSuggestions.length > 0 && (
              <div className="suggestions-dropdown" style={{ 
                  position: 'absolute', top: '100%', left: 0, right: 0, 
                  background: 'hsl(var(--bg-card))', border: '1px solid rgba(255,255,255,0.1)', 
                  zIndex: 20, borderRadius: '8px', overflow: 'hidden', marginTop: '4px'
              }}>
                 {destSuggestions.map((item, i) => (
                     <div key={i} onClick={() => handleSelectSuggestion('dest', item)} style={{ padding: '10px', cursor: 'pointer', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                         {item.display_name}
                         <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{item.type}</div>
                     </div>
                 ))}
              </div>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isSearching}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
        >
          {isSearching ? <><Loader className="spin" size={20} /> Finding Route...</> : <><Search size={20} /> Find Safe Route</>}
        </button>
      </form>

      {/* Close suggestions on background click */}
      {activeSuggestionField && (
          <div onClick={() => setActiveSuggestionField(null)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
      )}
    </div>
  );
};

export default RouteRequest;
