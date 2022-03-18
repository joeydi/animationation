import React from "react";
import { animated } from "react-spring";
import "./Menu.scss";

const Menu = ({ springProps }) => {
    const videos = ["https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/animationation/reelEdit_animationation_v2.mp4", "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/animationation/oldSchoolCartoons_edit.mp4", "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/animationation/01_frameByFrame_ball.mp4", "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/animationation/02_easing_linear.mp4", "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/animationation/03_easing_inOut.mp4", "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/animationation/04_easing_in.mp4", "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/animationation/05_easing_out.mp4", "https://simple-creature-website-assets.s3.amazonaws.com/simplecreature/animationation/animationPrinciples.mp4"];

    return (
        <animated.div className="menu" style={springProps}>
            {videos.map((item, i) => (
                <div className="page" key={i}>
                    <video src={item} controls loop={i} muted={i} />
                </div>
            ))}
        </animated.div>
    );
};

export default Menu;
