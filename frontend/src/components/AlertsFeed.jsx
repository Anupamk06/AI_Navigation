import React, { useState, useEffect } from 'react';
import { AlertTriangle, CloudRain, Users, AlertOctagon } from 'lucide-react';

const AlertsFeed = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'construction', title: 'Road Work on Main St', time: '2 mins ago', icon: AlertTriangle, color: 'hsl(var(--warning))' },
    { id: 2, type: 'crowd', title: 'High Foot Traffic near Market', time: '15 mins ago', icon: Users, color: 'hsl(var(--info))' },
    { id: 3, type: 'weather', title: 'Slippery Surfaces Reported', time: '1 hour ago', icon: CloudRain, color: 'hsl(var(--info))' },
  ]);

  useEffect(() => {
    // Simulate incoming new alert
    const timer = setTimeout(() => {
      setAlerts(prev => [
        { id: Date.now(), type: 'blocked', title: 'Elevator Out at Metro Station', time: 'Just now', icon: AlertOctagon, color: 'hsl(var(--danger))' },
        ...prev
      ]);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fade-in">
        <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: 'hsl(var(--primary))' }}>Real-time Hurdles</h2>
            <p style={{ color: 'hsl(var(--text-muted))' }}>Live updates on city accessibility obstacles.</p>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
            {alerts.map(alert => (
                <div key={alert.id} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '12px', 
                        background: alert.color.replace(')', ', 0.1)'), 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: alert.color
                    }}>
                        <alert.icon size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <strong>{alert.title}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>{alert.time}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>
                            Reported by community members • Verified
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default AlertsFeed;
