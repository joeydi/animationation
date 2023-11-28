import React from "react";
import { animated } from "react-spring";
import "./Menu.scss";

const Menu = ({ springProps }) => {
    const videos = ["/videos/reelEdit_animationation_v2.mp4", "/videos/oldSchoolCartoons_edit.mp4", "/videos/01_frameByFrame_ball.mp4", "/videos/02_easing_linear.mp4", "/videos/03_easing_inOut.mp4", "/videos/04_easing_in.mp4", "/videos/05_easing_out.mp4", "/videos/animationPrinciples.mp4"];

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
