
import React, { useEffect, useState } from "react";
import darkIcon from "../../img/logo/dark.png";
import brightnessIcon from "../../img/logo/brightness.png";
export default function DarkMode() {
  useEffect(() => {
    /*darkmode*/
    //check browser
    const toggleSwitch = document.querySelector(
      '.toggle-switch input[type="checkbox"]'
    );
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      document.documentElement.setAttribute("class", currentTheme);
      if (currentTheme === "dark") {
        toggleSwitch.checked = true;
      }
    }
    //set class dark or light
    function switchTheme(e) {
      if (e.target.checked) {
        document.documentElement.setAttribute("class", "dark");
        localStorage.setItem("theme", "dark"); //set key = theme,value = dark and save it on localstorage
      } else {
        document.documentElement.setAttribute("class", "light");
        localStorage.setItem("theme", "light");
      }
    }
    //run event change and run func switchtheme
    toggleSwitch.addEventListener("change", switchTheme);

    //icondarkmode
    let darkmodeicon = document.querySelector(".darkmode-icon");
    console.log(darkIcon);
    function icondarmode(e) {
      if (e.target.checked) {
        darkmodeicon.setAttribute("src", darkIcon);
      } else {
        darkmodeicon.setAttribute("src", brightnessIcon);
      }
    }
    toggleSwitch.addEventListener("change", icondarmode);
  });

  return (
    <label
      htmlFor="toggle"
      className="inline-block cursor-pointer toggle-switch "
    >
      <input
        type="checkbox"
        name
        id="toggle"
        className="darkmode-input hidden"
      />
      <div
        className="
                w-[100px]
                h-[40px]
                border border-[#ccc]
                rounded-full
                fixed
                right-5
                bottom-5
                z-50
                p-[5px]
                transition-colors"
      >
        <div
          className="
                  w-7
                  h-7
                  bg-[#ccc]
                  rounded-full
                  transition-transform
                  darkmode-spinner"
        />
      </div>
    </label>
  );
}

