import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useCallback, useEffect, useState } from "react";
import { useSpring } from "react-spring";
import "./App.css";
import Menu from "./Menu.jsx";

gsap.registerPlugin(Draggable, InertiaPlugin);

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

            if (event.key === "Enter") {
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

    const clickHandler = () => {
        setMenuActive(!menuActive);
    };

    const springProps = useSpring({
        transform: menuActive
            ? `translateZ(-250vw) rotateX(${rotateX}deg) rotateZ(10deg) rotateY(${rotateY}deg)`
            : `translateZ(-125vw) rotateX(0deg) rotateZ(0deg) rotateY(${rotateY}deg)`,
        config: {
            tension: menuActive ? 200 : 150,
            friction: 15,
        },
    });

    useEffect(() => {
        const handleWidth = document.querySelector(".drag-handle").clientWidth;
        const containerWidth = document.querySelector(".drag-container").clientWidth;
        const maxWidth = containerWidth - handleWidth;

        let index;

        Draggable.create(".drag-handle", {
            type: "x",
            inertia: true,
            throwResistance: 100,
            bounds: ".drag-container",
            edgeResistance: 0.5,
            onDrag: function () {
                index = gsap.utils.mapRange(0, maxWidth, 0, 7, this.x);
                setIndex(index);
            },
            onThrowUpdate: function () {
                index = gsap.utils.mapRange(0, maxWidth, 0, 7, this.x);
                setIndex(index);
            },
            snap: {
                x: function (endValue) {
                    return (Math.round((endValue * 7) / maxWidth) / 7) * maxWidth;
                },
            },
            onThrowComplete: () => {
                setIndex(Math.round(index));
            },
        });
    }, []);

    return (
        <div className="App" onMouseMove={mouseMoveHandler} onClick={clickHandler}>
            <div className="drag-container">
                <div className="drag-handle"></div>
            </div>
            <Menu springProps={springProps} setMenuActive={setMenuActive} setIndex={setIndex} index={index} />
        </div>
    );
}

export default App;
