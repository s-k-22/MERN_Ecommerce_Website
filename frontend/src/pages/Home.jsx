import React from "react";
import "../pageStyles/Home.css";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <div className="home-container">
        <h2 className="home-heading">
          Trending Now
        </h2>
      </div>
      <Footer />
    </>
  );
}

export default Home;
