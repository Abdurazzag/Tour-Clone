import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/info.css";
import { Footer } from "../components/Footer";
import { Carousel } from "../components/Carousel";
import { getAllPublishedTours, type PublishedTourSummary } from "../script/storage";

//Images used for slideshow
const slideshowImages = [
  "/images/mainslideshow1.png",
  "/images/mainslideshow2.png",
  "/images/mainslideshow3.png",
  "/images/mainslideshow4.png",
  "/images/mainslideshow5.png"
];

export const Main: React.FC = () => {
  const [tours, setTours] = useState<PublishedTourSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPublishedTours().then((data) => {
      setTours(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="info-container">
      <div className="mainpage-slideshow">
        <Carousel images={slideshowImages} interval={5000} />
      </div>

      {/* Map + Welcome side-by-side */}
      <div className="two-column-section" style={{ alignItems: "center"}}>
        <div className="column">
          <h2>Welcome!</h2>
          <p style={{ maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
            This application was built by University students to provide interactive virtual tours of
            historic university buildings, making it easier to explore spaces that are not always
            accessible in person. Each tour combines panoramic imagery with interactive features so you
            can move through key locations and learn about the buildings as you go.
          </p>
          <p style={{ maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
            The University of Aberdeen has many fascinating and historic buildings, each with its own
            character and purpose, ranging from ceremonial and religious spaces to academic and civic
            architecture.
          </p>
          <p style={{ maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
          Please select a tour below to get started, or use the map to explore the campus.
          We hope you enjoy discovering the rich history and architecture of our university
          through this interactive experience!
          </p>
        </div>

        <div className="column2">
          <div
            className="mapexample"
            style={{
              overflow: "hidden", // Changed to hidden so the container cleanly wraps the map
              borderRadius: "30px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {/* The crucial relative wrapper that exactly matches the image size on all screen sizes */}
            <div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: "100%" }}>
                <img
                  src={"/get-image?name=global-map.png"} // Fetch the admin-uploaded map
                  alt="Interactive campus map"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block"
                  }}
                  onError={(e) => { e.currentTarget.src = "/images/MapExample.png" }} // Fallback if no map is uploaded yet
                />
                
                {/* Overlay the clickable pins for each tour */}
                {tours.map(tour => tour.mapPin && (
                  <Link 
                      key={tour.id} 
                      to={`/tour/${tour.id}`} 
                      style={{
                          display: 'block',
                          position: 'absolute',
                          left: `${tour.mapPin.x}%`,
                          top: `${tour.mapPin.y}%`,
                          transform: 'translate(-50%, -100%)', // Anchor the bottom tip of the pin to the coordinates
                          zIndex: 10,
                          textDecoration: 'none'
                      }}
                  >
                      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {/* Tooltip so users know which tour the pin leads to */}
                          <div style={{
                              backgroundColor: 'rgba(0,0,0,0.8)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              whiteSpace: 'nowrap',
                              marginBottom: '4px',
                              fontWeight: 'bold',
                              pointerEvents: 'none',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                          }}>
                              {tour.title}
                          </div>
                          <img 
                              src="/images/pointerlogo.png" 
                              alt="Pin" 
                              style={{ 
                                  width: '35px', 
                                  height: 'auto', 
                                  filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.6))',
                                  transition: 'transform 0.2s ease-in-out',
                                  cursor: 'pointer'
                              }} 
                              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          />
                      </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tour selection */}
      <div className="services-container" style={{ justifyContent: "center", flexWrap: "wrap", marginTop:"0px" }}>
        <h1 style={{ width: "100%", textAlign: "center", marginBottom: "0px" }}>Select a tour</h1>

        {loading ? (
          <p>Loading tours...</p>
        ) : tours.length === 0 ? (
          <p>No tours available yet.</p>
        ) : (
          tours.map((tour) => (
            <Link key={tour.id} to={`/tour/${tour.id}`} className="service-item">
              <img src={tour.logo || "/images/temporaryIcon.png"} alt={tour.title} className="service-icon" />
              <h3>{tour.title}</h3>
            </Link>
          ))
        )}
      </div>

      <Footer />
    </div>
  );
};