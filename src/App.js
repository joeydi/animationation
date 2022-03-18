import gsap from "@gsap/shockingly";
import Draggable from "@gsap/shockingly/Draggable";
import InertiaPlugin from "@gsap/shockingly/InertiaPlugin";
import React, { useCallback, useEffect, useState } from "react";
import { useSpring } from "react-spring";
import "./App.css";
import Menu from "./Menu.js";
// import MenuToggle from "./MenuToggle.js";

gsap.registerPlugin(Draggable);
gsap.registerPlugin(InertiaPlugin);

function App() {
    const [menuActive, setMenuActive] = useState(false);
    const [index, setIndex] = useState(0);
    const rotateY = (index / 8) * -360;

    useEffect(() => {
        const moduloIndex = index % 8;
        document.querySelectorAll("video").forEach((video, i) => {
            if (i === moduloIndex) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, [index]);

    const selectPrevious = useCallback(() => {
        if (!menuActive) {
            setMenuActive(true);
            setIndex((oldIndex) => oldIndex - 1);
            window.setTimeout(() => {
                setMenuActive(false);
            }, 500);
        } else {
            setIndex((oldIndex) => oldIndex - 1);
        }
    }, [menuActive]);

    const selectNext = useCallback(() => {
        if (!menuActive) {
            setMenuActive(true);
            setIndex((oldIndex) => oldIndex + 1);
            window.setTimeout(() => {
                setMenuActive(false);
            }, 500);
        } else {
            setIndex((oldIndex) => oldIndex + 1);
        }
    }, [menuActive]);

    const handleKeyPress = useCallback(
        (event) => {
            console.log(`Key pressed: ${event.key}`);

            if (event.key === "ArrowLeft") {
                selectPrevious();
            }

            if (event.key === "ArrowRight") {
                selectNext();
            }

            if (event.key === "Escape") {
                setMenuActive((menuActive) => {
                    return !menuActive;
                });
            }
        },
        [setMenuActive, selectPrevious, selectNext]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);

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

        let index;

        Draggable.create(".drag-handle", {
            type: "x",
            inertia: true,
            throwResistance: 100,
            bounds: ".drag-container",
            edgeResistance: 0.5,
            onDrag: function () {
                index = gsap.utils.mapRange(0, maxWidth, 0, 7, this.x);
                // console.log(this.x, index);
                setIndex(index);
            },
            onThrowUpdate: function () {
                index = gsap.utils.mapRange(0, maxWidth, 0, 7, this.x);
                // console.log(this.x, index);
                setIndex(index);
            },
            snap: {
                x: function (endValue) {
                    return (Math.round((endValue * 7) / maxWidth) / 7) * maxWidth;
                },
            },
            onThrowComplete: () => {
                // console.log(this);
                // const index = gsap.utils.mapRange(0, maxWidth, 0, 7, this.x);
                setIndex(Math.round(index));
            },
        });
    }, []);

    return (
        <div className="App" onMouseMove={mouseMoveHandler}>
            {/* <MenuToggle setMenuActive={setMenuActive} />
            <div className="menu-buttons">
                <button onClick={selectPrevious}>Previous</button>
                <button onClick={selectNext}>Next</button>
            </div> */}
            <div className="drag-container">
                <div className="drag-handle"></div>
            </div>
            <Menu springProps={springProps} setMenuActive={setMenuActive} setIndex={setIndex} index={index} />
        </div>
    );
}

export default App;
