import React from "react";

const Menu = ({ setMenuActive }) => {
    return (
        <button
            className="menu-toggle"
            onClick={() => {
                setMenuActive((menuActive) => {
                    console.log("menuActive", menuActive);
                    return !menuActive;
                });
            }}>
            Menu
        </button>
    );
};

export default Menu;
