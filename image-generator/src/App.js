// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// function App() {
//   const [prompt, setPrompt] = useState(""); // For user input
//   const [media, setMedia] = useState(null); // To store fetched media (image/video)
//   const [mediaType, setMediaType] = useState("image"); // To distinguish between image and video
//   const [loading, setLoading] = useState(false); // To show loading status
//   const [selectedType, setSelectedType] = useState("pic"); // Dropdown value for media type

//   const PEXELS_ACCESS_KEY =
//     "fK3XSijHeLjYG2mreskNyI3l5iz7HroAVgUJkez8mkGi5laqocwkKYvb"; // Replace with your Pexels API access key

//   const generateMedia = async () => {
//     setLoading(true);

//     if (selectedType === "video") {
//       // Fetch video from Pexels Video API
//       const response = await fetch(
//         `https://api.pexels.com/videos/search?query=${prompt}&per_page=1`, // Fetching 1 video
//         {
//           headers: {
//             Authorization: PEXELS_ACCESS_KEY,
//           },
//         }
//       );

//       const data = await response.json();

//       if (data.videos && data.videos.length > 0) {
//         setMedia(data.videos[0].video_files[0].link); // Set the first result's video URL
//         setMediaType("video"); // Mark as video
//       } else {
//         setMedia(null);
//       }
//     } else {
//       // Fetch image from Pexels Image API
//       const response = await fetch(
//         `https://api.pexels.com/v1/search?query=${prompt}&per_page=1`, // Fetching 1 image
//         {
//           headers: {
//             Authorization: PEXELS_ACCESS_KEY,
//           },
//         }
//       );

//       const data = await response.json();

//       if (data.photos && data.photos.length > 0) {
//         setMedia(data.photos[0].src.medium); // Set the first result's image URL
//         setMediaType("image"); // Mark as image
//       } else {
//         setMedia(null);
//       }
//     }

//     setLoading(false);
//   };

//   const clearMedia = () => {
//     setMedia(null);
//   };

//   return (
//     <div className="container text-center mt-5">
//       <h1 className="mb-4">AI Media Generator</h1>
//       <div className="row justify-content-center mb-3">
//         <div className="col-md-6">
//           <div className="input-group">
//             {/* Dropdown for selecting image or video */}
//             <select
//               className="form-select"
//               value={selectedType}
//               onChange={(e) => setSelectedType(e.target.value)}
//               style={{ maxWidth: "150px" }}
//             >
//               <option value="pic">Picture</option>
//               <option value="video">Video</option>
//             </select>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Enter search keyword"
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//             />
//             <button
//               className="btn btn-primary"
//               onClick={generateMedia}
//               disabled={loading}
//             >
//               Generate
//             </button>
//           </div>
//         </div>
//       </div>

//       {loading && <p>Loading...</p>}

//       {media && mediaType === "image" ? (
//         <div className="media-display mt-4">
//           <img
//             src={media}
//             alt="Generated Media"
//             className="img-fluid"
//             style={{ marginTop: "20px", maxWidth: "100%" }}
//           />
//           <button className="btn btn-danger mt-3" onClick={clearMedia}>
//             OK
//           </button>
//         </div>
//       ) : media && mediaType === "video" ? (
//         <div className="media-display mt-4">
//           <video
//             src={media}
//             controls
//             className="img-fluid"
//             style={{ marginTop: "20px", maxWidth: "100%" }}
//           ></video>
//           <button className="btn btn-danger mt-3" onClick={clearMedia}>
//             Save
//           </button>
//         </div>
//       ) : (
//         !loading && <p>No media found. Try a different keyword.</p>
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState(""); // For user input
  const [media, setMedia] = useState(null); // To store fetched media (image/video)
  const [mediaType, setMediaType] = useState("image"); // To distinguish between image and video
  const [loading, setLoading] = useState(false); // To show loading status
  const [transactionHash, setTransactionHash] = useState(null); // Blockchain transaction hash
  const [selectedType, setSelectedType] = useState("pic"); // Dropdown value for media type

  const generateMedia = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/generate-media",
        {
          prompt,
          mediaType: selectedType === "video" ? "video" : "image",
        }
      );

      setMedia(response.data.mediaUrl);
      setTransactionHash(response.data.transactionHash);
      setMediaType(response.data.mediaType);
    } catch (error) {
      console.error("Error generating media:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">AI Media Generator with Blockchain</h1>
      <div className="row justify-content-center mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <select
              className="form-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ maxWidth: "150px" }}
            >
              <option value="pic">Picture</option>
              <option value="video">Video</option>
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Enter search keyword"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={generateMedia}
              disabled={loading}
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {media && mediaType === "image" ? (
        <div className="media-display mt-4">
          <img
            src={media}
            alt="Generated Media"
            className="img-fluid"
            style={{ marginTop: "20px", maxWidth: "100%" }}
          />
          <p>Blockchain Transaction Hash: {transactionHash}</p>
        </div>
      ) : media && mediaType === "video" ? (
        <div className="media-display mt-4">
          <video
            src={media}
            controls
            className="img-fluid"
            style={{ marginTop: "20px", maxWidth: "100%" }}
          ></video>
          <p>Blockchain Transaction Hash: {transactionHash}</p>
        </div>
      ) : (
        !loading && <p>No media found. Try a different keyword.</p>
      )}
    </div>
  );
}

export default App;
