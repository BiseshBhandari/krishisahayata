import React from "react";
import Navbar from "../Components/Navbar";
import { IoVideocam } from "react-icons/io5";
import { AiFillShop } from "react-icons/ai";
import { PiPlantBold } from "react-icons/pi";
import { FaPeopleGroup } from "react-icons/fa6";

import "../Styles/LandingPage.css";
import HeroImg from "../assets/Images/homeee.webp"

function LandingPage() {
    return (
        <div className="whole">
            <Navbar />
            <div className="first_section">
                <div className="heroText">
                    <div className="headings-text">
                        <h1 className="headings">Smart Farming Solutions</h1>
                        <h1 className="headings">For Modern Agriculture</h1>
                    </div>

                    <div className="sub-heading-text">
                        <p className="sub-headings">Your complete guide to successful farming with expert tutorials, marketplace access, and crop recommendations.</p>
                    </div>
                </div>
                <div className="heroImage">
                    <img src={HeroImg} alt="" />
                </div>
            </div>
            <div className="second_section">
                <div className="second_section-head">
                    <h1 className="second-head">Everything You Need to Grow</h1>
                    <p className="p">Comprehensive tools and resources for modern farming</p>
                </div>

                <div className="second-section-cards">
                    <div className="second-card">
                        <div className="second_icon">
                            <IoVideocam size={30} color="green" />
                        </div>
                        <div className="second_title">
                            <p>Tutorial Video</p>
                        </div>
                        <div className="second_text">
                            <p>Learn farming techniques from expert tutorials and guides</p>
                        </div>
                    </div>

                    <div className="second-card">
                        <div className="second_icon">
                            <AiFillShop size={30} color="green" />
                        </div>
                        <div className="second_title">
                            <p>Marketplace</p>
                        </div>
                        <div className="second_text">
                            <p>Buy and sell agricultural products directly</p>
                        </div>
                    </div>

                    <div className="second-card">
                        <div className="second_icon">
                            <PiPlantBold size={30} color="green" />
                        </div>
                        <div className="second_title">
                            <p>Crop Suggestion</p>
                        </div>
                        <div className="second_text">
                            <p>Get personalized crop recommendations</p>
                        </div>
                    </div>

                    <div className="second-card">
                        <div className="second_icon">
                            <FaPeopleGroup size={30} color="green" />
                        </div>
                        <div className="second_title">
                            <p>Community</p>
                        </div>
                        <div className="second_text">
                            <p>Share experiences and get advice from the farming community.</p>
                        </div>
                    </div>

                </div>

            </div>
            <div className="third_section-videos">
                <div className="video_head">
                    <p>Popular Videos</p>
                </div>
            </div>

            <div className="fourth_section-products">
                <div className="prodcut_head">
                    <p></p>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;