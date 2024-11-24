import React, { useState } from "react";

const App = () => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }

      const data = await response.json();
      setPrediction(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setPrediction(null);
    }
  };

  return (
    <div className="px-12 py-10 h-screen flex flex-col justify-center items-center">
      <form
        className="flex flex-col items-center"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h1 className="font-bold text-4xl tracking-wider underline mb-4">
          Breast Cancer Detection
        </h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 border border-gray-400 rounded p-2"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-500 font-semibold">Error: {error}</p>
      )}

      {prediction && (
        <div className="mt-6 p-4 border border-gray-400 rounded bg-gray-100">
          <h2 className="font-bold text-xl">Prediction Result</h2>
          <p className="mt-2">
            <strong>Predicted Class:</strong> {prediction.predicted_class}
          </p>
          <p>
            <strong>Confidence:</strong>{" "}
            {(prediction.confidence * 100).toFixed(2)}%
          </p>
          <p>
            {/* <strong>Raw Predictions:</strong> {JSON.stringify(prediction.raw_predictions)} */}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
