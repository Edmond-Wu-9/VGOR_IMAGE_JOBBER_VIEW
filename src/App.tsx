import React from "react";
import PartList from "./components/PartList";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="header text-white text-center py-3 mb-4">
        <h1>Part Number and Image Viewer</h1>
        <p className="mt-3">
          Please upload an Excel file with the following column order:
          <br />
          <strong>
            Part Number | Year Start | Year End | Make | Model | Image Link 1 |
            Image Link 2 | ...
          </strong>
        </p>
      </header>
      <div className="container">
        <PartList />
      </div>
      <footer className="footer text-center py-3 mt-4">
        <p className="mb-0">© 2024 Vanguard OffRoad</p>
      </footer>
    </div>
  );
}

export default App;
