import React, { useState } from "react";
import sendDynamicRequest from "../../instance/apiUrl";
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

        const payload = {
            temperature: Number(formData.temperature),
            humidity: Number(formData.humidity),
            ph: Number(formData.ph),
            rainfall: Number(formData.rainfall),
        };

        if (
            isNaN(payload.temperature) ||
            isNaN(payload.humidity) ||
            isNaN(payload.ph) ||
            isNaN(payload.rainfall)
        ) {
            setError("Please enter valid numeric values for all fields.");
            setLoading(false);
            return;
        }

        try {
            const response = await sendDynamicRequest("post", "farmer/getCropGuide", payload);
            setRecommendation(response);
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Failed to fetch recommendation. Please try again.";
            setError(errorMessage);
            console.error("Error details:", err.response || err.message);
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
                            <label htmlFor={field}>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </label>
                            <input
                                type="number"
                                name={field}
                                id={field}
                                value={formData[field]}
                                onChange={handleChange}
                                required
                                step="0.1" // Allow decimal inputs
                                min="0" // Prevent negative values
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
                                    Recommended crop:{" "}
                                    <span className="success">{recommendation.recommended_fruit}</span>
                                </p>
                                <p style={{ marginTop: "1rem" }} className="help_header">Helpful Resources:</p>
                                <ul className="link-list">
                                    {recommendation.links?.map((link, i) => (
                                        <li key={i} className="crop-link-item">
                                            <a href={link} target="_blank" rel="noopener noreferrer" className="crop_info_link">
                                                {link.split("/").pop()}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="error">{recommendation.error || "No recommendation available."}</p>
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
