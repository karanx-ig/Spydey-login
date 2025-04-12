import "./App.css";

import { useState } from "react";

export const QRCodeGenerator = ({ user, setUser }) => {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = () => {
    setLoading(true);

    fetch(`/api/qrcode?text=${encodeURIComponent(text)}`, {
      headers: {
        Authorization: "Bearer " + user.token,
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Login Failed!");
        }
        return response.json();
      })
      .then((data) => setImageUrl(data.imageUrl))
      .catch((error) => {
        console.error("Failed to get QR!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "1px solid #ccc",
          paddingBottom: "10px",
        }}
      >
        <h3 style={{ margin: 0 }}>Welcome {user.name}</h3>
        <button
          onClick={() => {
            setUser(null);
          }}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <textarea
          type="text"
          value={text}
          placeholder="Enter Text"
          onChange={(e) => setText(e.target.value)}
          maxLength={2096}
          style={{
            width: "100%",
            height: "100px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            resize: "none",
            fontSize: "14px",
          }}
        />
        <button
          onClick={onSubmit}
          style={{
            marginTop: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : !imageUrl ? (
          <div>Enter Text & Click Submit</div>
        ) : (
          <div>
            <img src={imageUrl} alt="QR Code" style={{ maxWidth: "100%", marginBottom: "10px" }} />
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = imageUrl;
                a.download = "";
                a.click();
              }}
              style={{
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
