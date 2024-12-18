import React from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ImageEnhancement from "./components/ImageEnhancement.jsx";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        <ImageEnhancement />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
