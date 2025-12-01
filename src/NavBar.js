import React from "react";
import { NavLink } from "react-router-dom";
import "./App.css";

const NavBar = () => {
  return (
    <div className="top-menu printable">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          "tab-link" + (isActive ? " tab-link-active" : "")
        }
      >
        Печать изображений
      </NavLink>
      <NavLink
        to="/labels"
        className={({ isActive }) =>
          "tab-link" + (isActive ? " tab-link-active" : "")
        }
      >
        Наклейки / этикетки
      </NavLink>
    </div>
  );
};

export default NavBar;
