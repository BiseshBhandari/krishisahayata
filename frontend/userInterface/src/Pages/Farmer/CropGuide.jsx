// import React from "react";

// function CropGuide() {
//     return (
//         <div className="container">
//            <div className="guide_form">

//            </div>
//            <div className="recomeded">

//            </div>

//         </div>
//     );
// }

// export default CropGuide;

import React, { useState } from "react";
import axios from "axios";
import "../../Styles/CropGuide.css";

function CropGuide() {
    const [formData, setFormData] = useState({
        temperature: "",
        humidity: "",
        ph: "",
        rainfall: "",
    });

    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setRecommendation(null);

        try {
            const response = await axios.post("http://localhost:3000/farmer/getCropGuide", formData);
            setRecommendation(response.data);
        } catch (err) {
            setError("Failed to fetch recommendation");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1 className="title">🌱 Crop Recommendation Guide</h1>

            <div className="flex-layout">
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="card">
                    <h2>Enter Weather & Soil Info</h2>

                    {["temperature", "humidity", "ph", "rainfall"].map((field) => (
                        <div className="input-group" key={field}>
                            <label htmlFor={field}>{field}</label>
                            <input
                                type="number"
                                name={field}
                                id={field}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}

                    <button className="button" type="submit" disabled={loading}>
                        {loading ? "Predicting..." : "Get Crop Suggestion"}
                    </button>

                    {error && <p className="error">{error}</p>}
                </form>

                {/* Result Section */}
                <div className="card">
                    <h2>Recommended Crop</h2>

                    {recommendation ? (
                        recommendation.success ? (
                            <div>
                                <p>
                                    ✅ Recommended crop:{" "}
                                    <span className="success">{recommendation.recommended_fruit}</span>
                                </p>
                                <p style={{ marginTop: "1rem" }}>Helpful Resources:</p>
                                <ul className="link-list">
                                    {recommendation.links.map((link, i) => (
                                        <li key={i}>
                                            <a href={link} target="_blank" rel="noopener noreferrer">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="error">{recommendation.error}</p>
                        )
                    ) : (
                        <p style={{ color: "#666" }}>Submit form to get a recommendation.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CropGuide;
