import React from "react";
import { Accessibility, Activity, Zap, Volume2, Eye, Vibrate } from "lucide-react";

const ProfileSetup = ({ onComplete, savedProfile }) => {
  const [preferences, setPreferences] = React.useState({
    wheelchair: false,
    walker: false,
    fatigue: false,
    avoidCrowds: false,
    avoidSlopes: false,
    guidance: "visual", // 'audio', 'haptic', 'visual'
  });

  React.useEffect(() => {
    if (savedProfile && savedProfile.mobilityType) {
      setPreferences(prev => ({
        ...prev,
        wheelchair: savedProfile.mobilityType.includes('Wheelchair User'),
        walker: savedProfile.mobilityType.includes('Walker / Crutches'),
        fatigue: savedProfile.mobilityType.includes('Fatigue / Chronic Pain'),
        // Map other fields if they exist in future
      }));
    }
  }, [savedProfile]);

  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = () => {
    onComplete(preferences);
  };

  return (
    <div className="card fade-in">
      <h2 style={{ marginBottom: "20px", color: "hsl(var(--primary))" }}>
        Step 1: Mobility Profile
      </h2>
      <p style={{ marginBottom: "24px", color: "hsl(var(--text-muted))" }}>
        Tell us about your needs so we can find the safest route for you.
      </p>

      <div className="input-group">
        <label
          className={`mobility-option ${
            preferences.wheelchair ? "selected" : ""
          }`}
          onClick={() => togglePreference("wheelchair")}
        >
          <div className="icon-wrapper">
            <Accessibility size={24} />
          </div>
          <div>
            <strong>Wheelchair User</strong>
            <div
              style={{ fontSize: "0.85rem", color: "hsl(var(--text-muted))" }}
            >
              Avoids stairs & narrow paths
            </div>
          </div>
        </label>

        <label
          className={`mobility-option ${preferences.walker ? "selected" : ""}`}
          onClick={() => togglePreference("walker")}
        >
          <div className="icon-wrapper">
            <Activity size={24} />
          </div>
          <div>
            <strong>Walker / Crutches</strong>
            <div
              style={{ fontSize: "0.85rem", color: "hsl(var(--text-muted))" }}
            >
              Needs smooth surfaces
            </div>
          </div>
        </label>

        <label
          className={`mobility-option ${preferences.fatigue ? "selected" : ""}`}
          onClick={() => togglePreference("fatigue")}
        >
          <div className="icon-wrapper">
            <Zap size={24} />
          </div>
          <div>
            <strong>Fatigue Sensitive</strong>
            <div
              style={{ fontSize: "0.85rem", color: "hsl(var(--text-muted))" }}
            >
              Shortest distance priority
            </div>
          </div>
        </label>
      </div>

      <h3 style={{ marginBottom: "16px", marginTop: "24px" }}>
        Preferred Guidance
      </h3>
      <div style={{ display: "flex", gap: "10px", marginBottom: "32px" }}>
        {["visual", "audio", "haptic"].map((mode) => (
          <button
            key={mode}
            onClick={() =>
              setPreferences((prev) => ({ ...prev, guidance: mode }))
            }
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "var(--radius-md)",
              background:
                preferences.guidance === mode
                  ? "hsl(var(--primary))"
                  : "hsl(var(--bg-input))",
              color: "white",
              border:
                "1px solid " +
                (preferences.guidance === mode
                  ? "hsl(var(--primary))"
                  : "rgba(255,255,255,0.1)"),
            }}
          >
            {mode === "visual" && <Eye size={20} />}
            {mode === "audio" && <Volume2 size={20} />}
            {mode === "haptic" && <Vibrate size={20} />}
            <div
              style={{
                fontSize: "0.8rem",
                marginTop: "4px",
                textTransform: "capitalize",
              }}
            >
              {mode}
            </div>
          </button>
        ))}
      </div>

      <button className="btn-primary" onClick={handleSubmit}>
        Save Profile & Continue
      </button>
    </div>
  );
};

export default ProfileSetup;
