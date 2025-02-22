import React from "react";
import "../Styles/Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-item">
                        <h3 className="footer-title">About Krishi Sahayata</h3>
                        <p className="footer-text">
                            Empowering farmers with modern techniques and direct market access for better agricultural outcomes.
                        </p>
                    </div>
                    <div className="footer-item">
                        <h3 className="footer-title">Quick Links</h3>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">Tutorials</a></li>
                            <li><a href="#" className="footer-link">Crop Suggestions</a></li>
                            <li><a href="#" className="footer-link">Community</a></li>
                            <li><a href="#" className="footer-link">Marketplace</a></li>
                        </ul>
                    </div>
                    <div className="footer-item">
                        <h3 className="footer-title">Support</h3>
                        <ul className="footer-links">
                            <li><a href="/contact" className="footer-link">Contact Us</a></li>
                            <li><a href="/faq" className="footer-link">FAQ</a></li>
                            <li><a href="/help" className="footer-link">Help Center</a></li>
                        </ul>
                    </div>
                    <div className="footer-item">
                        <h3 className="footer-title">Connect With Us</h3>
                        <p className="footer-text">
                            Follow us on social media for updates and farming tips.
                        </p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Krishi Sahayata. All rights reserved.</p>
                </div>
            </div>
        </footer>


    );
}

export default Footer;