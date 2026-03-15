import React, { useState } from "react";
import { TourNode } from "../script/TourDataStruct";

interface Props {
    tour: TourNode;
    onReturn: () => void;
}

export default function MapPinPlacer({ tour, onReturn }: Props) {
    const [pin, setPin] = useState<{ x: number, y: number } | null>(tour.mainPage.mapPin || null);

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        // Calculate relative coordinates in percentages so it scales on mobile
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setPin({ x, y });
        tour.mainPage.mapPin = { x, y };
    };

    return (
        <div style={{ backgroundColor: "#0b0b1a", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px", background: "#12122a", display: "flex", alignItems: "center" }}>
                <button onClick={onReturn} style={{ background: "transparent", color: "#a8b2d1", border: "1px solid #a8b2d1", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}>
                    ← Back to Editor
                </button>
                <h2 style={{ color: "white", marginLeft: "20px", flex: 1, textAlign: "center" }}>Place Pin on Global Map</h2>
                <div style={{ width: "130px" }} /> {/* Spacer */}
            </div>
            
            <div style={{ padding: '20px', color: 'white', textAlign: 'center', flex: 1 }}>
                <p>Click on the map below to place a pin for this tour. Ensure you save the project after returning.</p>
                
                <div style={{ position: 'relative', display: 'inline-block', border: '2px solid #2a2a40', cursor: 'crosshair', maxWidth: '800px', backgroundColor: '#1e1e2f', borderRadius: "8px", overflow: "hidden" }}>
                    <img 
                        src={`/get-image?name=global-map.png&t=${Date.now()}`} 
                        alt="Global Map" 
                        style={{ width: '100%', display: 'block' }} 
                        onClick={handleImageClick}
                        onError={(e) => { e.currentTarget.style.display = 'none'; alert("No global map uploaded yet! Ask a Superadmin to upload one from the dashboard."); }}
                    />
                    
                    {pin && (
                        <div style={{
                            position: 'absolute',
                            left: `${pin.x}%`,
                            top: `${pin.y}%`,
                            width: '20px',
                            height: '20px',
                            backgroundColor: '#e74c3c',
                            border: '3px solid white',
                            borderRadius: '50%',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
                        }} />
                    )}
                </div>
            </div>
        </div>
    );
}