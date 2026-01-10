import React from 'react';
import { MapPin, Navigation, Search, ArrowUpDown, Plus, X, ArrowRight } from 'lucide-react';

const RouteRequest = ({ onSearch, profile, savedRoutes = [] }) => {
  const [start, setStart] = React.useState('Current Location');
  const [dest, setDest] = React.useState('');
  const [stops, setStops] = React.useState([]); // Array of stop locations
  const [isSearching, setIsSearching] = React.useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!dest) return;
    
    setIsSearching(true);
    // Simulate API delay
    setTimeout(() => {
      onSearch({ start, dest, stops });
    }, 1500);
  };

  const handleFlip = () => {
    const temp = start;
    setStart(dest);
    setDest(temp);
  };

  const handleAddStop = () => {
    setStops([...stops, '']);
  };

  const handleStopChange = (index, value) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };

  const handleRemoveStop = (index) => {
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops);
  };

  return (
    <div className="card fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'hsl(var(--primary))', margin: 0 }}>Where to?</h2>
        <div style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px' }}>
          Profile: {profile.wheelchair ? 'Wheelchair' : profile.walker ? 'Walker' : 'Standard'}
        </div>
      </div>

      <form onSubmit={handleSearch}>
        {/* Start Location */}
        <div className="input-group" style={{ marginBottom: '12px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <MapPin size={20} style={{ position: 'absolute', left: '16px', color: 'hsl(var(--primary))' }} />
            <input
              type="text"
              className="input-field"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              style={{ paddingLeft: '48px', flex: 1 }}
              placeholder="Start Location"
            />
          </div>
        </div>

        {/* Flip Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px', marginRight: '8px' }}>
          <button 
            type="button" 
            onClick={handleFlip}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: 'none', 
              borderRadius: '50%', 
              width: '32px', 
              height: '32px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'hsl(var(--text-muted))'
            }}
            title="Flip Start and Destination"
          >
            <ArrowUpDown size={16} />
          </button>
        </div>

        {/* Intermediate Stops */}
        {stops.map((stop, index) => (
          <div key={index} className="input-group" style={{ marginBottom: '12px' }}>
             <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
               <div style={{ position: 'absolute', left: '19px', width: '6px', height: '6px', borderRadius: '50%', background: 'hsl(var(--text-muted))' }}></div>
               <input
                 type="text"
                 className="input-field"
                 value={stop}
                 onChange={(e) => handleStopChange(index, e.target.value)}
                 style={{ paddingLeft: '48px', flex: 1 }}
                 placeholder={`Stop ${index + 1}`}
                 autoFocus
               />
               <button 
                 type="button"
                 onClick={() => handleRemoveStop(index)}
                 style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    background: 'none', 
                    border: 'none', 
                    color: 'hsl(var(--text-muted))', 
                    cursor: 'pointer' 
                 }}
               >
                 <X size={16} />
               </button>
             </div>
          </div>
        ))}

        {/* Add Stop Button */}
        <div style={{ marginBottom: '16px' }}>
          <button 
            type="button" 
            onClick={handleAddStop}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'hsl(var(--primary))', 
              fontSize: '0.85rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              cursor: 'pointer',
              padding: '0'
            }}
          >
            <Plus size={16} /> Add stop
          </button>
        </div>

        {/* Destination */}
        <div className="input-group" style={{ marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <Navigation size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--secondary))' }} />
            <input
              type="text"
              className="input-field"
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              style={{ paddingLeft: '48px' }}
              placeholder="Enter Destination"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isSearching}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
        >
          {isSearching ? (
            <>Finding Safe Route...</>
          ) : (
            <>
              <Search size={20} />
              Find Safe Route
            </>
          )}
        </button>
      </form>

      {/* Suggestion / Recent */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', marginBottom: '12px' }}>Recent Places</h4>
        {[
          { name: 'Central Park', type: 'Park' }, 
          { name: 'City Library', type: 'Public' }, 
          { name: 'Met General Hospital', type: 'Medical' }
        ].map((place, i) => (
          <div 
            key={i} 
            onClick={() => setDest(place.name)}
            style={{ 
              padding: '12px', 
              borderBottom: '1px solid rgba(255,255,255,0.05)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>{place.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{place.type}</span>
          </div>
        ))}
      </div>

      {/* Saved Routes */}
      {savedRoutes.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'hsl(var(--primary))', marginBottom: '12px' }}>Saved Routes</h4>
          {savedRoutes.map((route) => (
            <div 
              key={route.id} 
              onClick={() => {
                setStart(route.start);
                setDest(route.dest);
                setStops(route.stops || []);
              }}
              style={{ 
                padding: '12px', 
                background: 'rgba(var(--primary-rgb), 0.05)',
                borderRadius: '8px',
                marginBottom: '8px',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{route.dest}</div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>From: {route.start} • {route.date}</div>
              </div>
              <ArrowRight size={16} color="hsl(var(--primary))" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RouteRequest;
