
// Anush Bundel 2023BCS0005

const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : `${window.location.protocol}//${window.location.hostname}:8082`;

fetch(`${API_URL}/student-details`)
  .then(res => {
    if (!res.ok) throw new Error("API error");
    return res.json();
  })
  .then(data => {
    document.getElementById("name").innerText = `Name: ${data.name}`;
    document.getElementById("roll").innerText = `Roll Number: ${data.roll}`;
    document.getElementById("register").innerText = `Register Number: ${data.register}`;
  })
  .catch(err => {
    console.error(err);
    document.getElementById("name").innerText = "Failed to load data";
  });
