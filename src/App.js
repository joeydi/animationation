import gsap from "gsap";
import Draggable from "gsap/Draggable";
import InertiaPlugin from "gsap/InertiaPlugin";
import React, { useState, useEffect } from "react";
import { useSpring } from "react-spring";
import "./App.css";
import Menu from "./Menu.js";
import MenuToggle from "./MenuToggle.js";

gsap.registerPlugin(Draggable);
gsap.registerPlugin(InertiaPlugin);

function App() {
    const [menuActive, setMenuActive] = useState(false);
    const [index, setIndex] = useState(0);

    const rotateY = (index / 8) * -360;

    useEffect(() => {
        document.querySelectorAll("video").forEach((video, i) => {
            if (i === index) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, [index]);

    // const playVideo = (index) => {
    //     document.querySelectorAll("video").forEach((video, i) => {
    //         if (i === index) {
    //             video.play();
    //         } else {
    //             video.pause();
    //         }
    //     });
    // };

    const selectPrevious = () => {
        if (!menuActive) {
            setMenuActive(true);
            setIndex((oldIndex) => oldIndex - 1);
            // playVideo(index);
            window.setTimeout(() => {
                setMenuActive(false);
            }, 500);
        } else {
            setIndex((oldIndex) => oldIndex - 1);
        }
    };

    const selectNext = () => {
        if (!menuActive) {
            setMenuActive(true);
            setIndex((oldIndex) => oldIndex + 1);
            // playVideo(index);
            window.setTimeout(() => {
                setMenuActive(false);
            }, 500);
        } else {
            setIndex((oldIndex) => oldIndex + 1);
        }
    };

    const [rotateX, setRotateX] = useState(0);
    const mouseMoveHandler = (e) => {
        const rotateX = gsap.utils.mapRange(0, window.innerHeight, 10, -10, e.clientY);
        setRotateX(rotateX);
        // TODO: Update drag position to keep in sync
        // gsap.set(".drag-handle", {});
    };

    const springProps = useSpring({
        transform: menuActive ? `translateZ(-250vw) rotateX(${rotateX}deg) rotateZ(10deg) rotateY(${rotateY}deg)` : `translateZ(-125vw) rotateX(0deg) rotateZ(0deg) rotateY(${rotateY}deg)`,
        config: {
            tension: menuActive ? 200 : 150,
            friction: 15,
        },
    });

    // const imgProps = useSpring({
    //     transform: menuActive ? `rotateZ(-10deg) scale(1.25)` : `rotateZ(0deg) scale(1)`,
    //     config: {
    //         tension: 210,
    //         friction: 20,
    //     },
    // });

    useEffect(() => {
        const handleWidth = document.querySelector(".drag-handle").clientWidth;
        const containerWidth = document.querySelector(".drag-container").clientWidth;
        const maxWidth = containerWidth - handleWidth;

        // console.log(handleWidth, containerWidth, maxWidth);

        Draggable.create(".drag-handle", {
            type: "x",
            inertia: true,
            throwResistance: 100,
            bounds: ".drag-container",
            edgeResistance: 0.5,
            onDrag: function () {
                const index = gsap.utils.mapRange(0, maxWidth, 0, 7, this.x);
                // console.log(this.x, index);
                setIndex(index);
            },
            onThrowUpdate: function () {
                const index = gsap.utils.mapRange(0, maxWidth, 0, 7, this.x);
                // console.log(this.x, index);
                setIndex(index);
            },
            snap: {
                x: function (endValue) {
                    return (Math.round((endValue * 7) / maxWidth) / 7) * maxWidth;
                },
            },
        });
    }, []);

    return (
        <div className="App" onMouseMove={mouseMoveHandler}>
            <MenuToggle setMenuActive={setMenuActive} />
            <div className="menu-buttons">
                <button onClick={selectPrevious}>Previous</button>
                <button onClick={selectNext}>Next</button>
            </div>
            <div className="drag-container">
                <div className="drag-handle"></div>
            </div>
            <Menu springProps={springProps} setMenuActive={setMenuActive} setIndex={setIndex} index={index} />
        </div>
    );
}

export default App;
