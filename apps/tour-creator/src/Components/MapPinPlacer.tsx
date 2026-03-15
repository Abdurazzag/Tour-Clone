import React, { useState } from "react";
import { TourNode } from "../script/TourDataStruct";
import styles from "../styles/EditProjectPage.module.css"; 

interface Props {
    tour: TourNode;
    onReturn: () => void;
}

export default function MapPinPlacer({ tour, onReturn }: Props) {
    const [pin, setPin] = useState<{ x: number, y: number } | null>(tour.mainPage.mapPin || null);

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        // Calculate relative coordinates in percentages so it scales perfectly on mobile
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setPin({ x, y });
        tour.mainPage.mapPin = { x, y };
    };

    return (
        <div className={styles.pageContainer}>
            <main className={styles.content} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                
                {/* Header matching the editor style */}
                <div className={styles.header} style={{ width: "100%", maxWidth: "1000px", borderRadius: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <button onClick={onReturn} className={styles.backBtn}>
                        ← Back to Editor
                    </button>
                    <h1 className={styles.pageTitle} style={{ margin: 0 }}>Global Map Overview</h1>
                </div>

                {/* Main card matching the editor style */}
                <div className={styles.card} style={{ width: "100%", maxWidth: "1000px", marginTop: "1rem", textAlign: "center" }}>
                    <p className={styles.pageSubtitle} style={{ marginBottom: "1.5rem" }}>
                        Click on the map below to place a pin for <strong>{tour.mainPage.title}</strong>. 
                        The coordinate data will automatically attach to this tour. 
                        Ensure you click "Save Project" when returning to the editor.
                    </p>
                    
                    <div style={{ 
                        position: 'relative', 
                        display: 'inline-block', 
                        cursor: 'crosshair', 
                        width: '100%', 
                        borderRadius: "0.5rem", 
                        overflow: "hidden",
                        border: "1px solid #e0e0e0",
                        backgroundColor: "#f9fafb"
                    }}>
                        <img 
                            src={`/get-image?name=global-map.png&t=${Date.now()}`} 
                            alt="Global Map" 
                            style={{ width: '100%', height: 'auto', display: 'block' }} 
                            onClick={handleImageClick}
                            onError={(e) => { 
                                e.currentTarget.style.display = 'none'; 
                                alert("No global map uploaded yet! Ask a Superadmin to upload one from the dashboard."); 
                            }}
                        />
                        
                        {pin && (
                            <div style={{
                                position: 'absolute',
                                left: `${pin.x}%`,
                                top: `${pin.y}%`,
                                width: '24px',
                                height: '24px',
                                backgroundColor: '#7a1010', /* UoA Red matching your theme */
                                border: '3px solid white',
                                borderRadius: '50%',
                                transform: 'translate(-50%, -50%)',
                                pointerEvents: 'none',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                            }} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}