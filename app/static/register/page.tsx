"use client";
// import { useEffect, useState } from "react";

import NavBar from "@/app/static/components/NavBar";
export default function register() {

  const validateUserInput = () => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
  };

  return (
    <>
      <NavBar pageName="" />
      <main>
        <h1 className="text-4xl text-center">
          Register page
        </h1>

        <form onSubmit={validateUserInput}>
          <div className="input">
            <label htmlFor="usernName">User Name</label>
            <input type="text" id="usernName"></input>
          </div>

          <div className="input">
            <label htmlFor="email">Email</label>
            <input type="text" id="email"></input>
          </div>

          <div className="input">
            <label htmlFor="password">Password</label>
            <input type="text" id="password"></input>
          </div>

          <div className="input">
            <label htmlFor="rePassowrd">Re-Passowrd</label>
            <input type="text" id="rePassowrd"></input>
          </div>

          <div className="input tick-box">
            <input type="checkbox" id="showPassword"></input>
            <label htmlFor="showPassword">Show password</label>
          </div>

          <div className="submitForm">
            <input type="submit" id="registerBtn" value="Register now!"></input>
          </div>

        </form>
      </main>
    </>
  );
}
