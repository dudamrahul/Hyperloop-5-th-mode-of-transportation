const apiKey = 'NBOWTET4KT7V9LEQ';  // Replace with your ThingSpeak Write API Key

function getFareAndDistance() {
  var passengerName = document.getElementById("passengerName").value;
  var from = document.getElementById("option1").value;
  var to = document.getElementById("option2").value;

  if (!passengerName || !from || !to) {
    alert("Please fill in all fields.");
    return;
  }

  if (from === to) {
    alert("From and Destination cannot be the same.");
    return;
  }

  var amount = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
  var amountWithSuffix = amount + "/-"; // Adding "/-" at the end of the fare
  var distance = Math.floor(Math.random() * (50 - 10 + 1)) + 10; // Simulating distance
  var time = Math.floor(distance / 2) + " mins"; // Simulating time based on distance
  var data = passengerName + "," + from + "," + to + "," + amountWithSuffix + "," + distance + " km," + time + "\n";
  var existingData = localStorage.getItem("travelData") || "";
  var newData = existingData + data;
  localStorage.setItem("travelData", newData);
  displayData(data); // Display only the newly entered data
  
  // Send data to ThingSpeak
  sendDataToThingSpeak(passengerName, from, to, amountWithSuffix, distance, time);

  // Clear form fields after saving data
  document.getElementById("myForm").reset();
}

function displayData(data) {
  var rows = data.trim().split("\n");
  var html = "<table>";
  html += "<tr><th>Passenger Name</th><th>From</th><th>Destination</th><th>Fare</th><th>Distance</th><th>Time</th></tr>";
  rows.forEach(row => {
    var cols = row.split(",");
    if (cols.length === 6) {
      html += "<tr>";
      cols.forEach(col => {
        html += "<td>" + col + "</td>";
      });
      html += "</tr>";
    }
  });
  html += "</table>";
  document.getElementById("result").innerHTML = html;

  // Hide the result after 15 seconds
  setTimeout(() => {
    document.getElementById("result").innerHTML = "";
  }, 15000);
}

function promptPasswordAndDownload() {
  var password = prompt("Enter the password to download the data:");
  if (password === "mrem12345678") {
    downloadData();
  } else {
    alert("Incorrect password. Access denied.");
  }
}

function downloadData() {
  var data = localStorage.getItem("travelData") || "";
  if (data) {
    var csvContent = "data:text/csv;charset=utf-8," + "Passenger Name,From,Destination,Fare,Distance,Time\n" + data;
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "passenger_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert("No data to download!");
  }
}

function sendDataToThingSpeak(passengerName, from, to, amountWithSuffix, distance, time) {
  var url = `https://api.thingspeak.com/update?api_key=${apiKey}&field1=${encodeURIComponent(passengerName)}&field2=${encodeURIComponent(from)}&field3=${encodeURIComponent(to)}&field4=${amountWithSuffix}&field5=${distance}&field6=${encodeURIComponent(time)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => console.log("Data sent to ThingSpeak:", data))
    .catch(error => console.error("Error sending data to ThingSpeak:", error));
}

function downloadTicket() {
  var passengerName = document.getElementById("passengerName").value;
  var from = document.getElementById("option1").value;
  var to = document.getElementById("option2").value;

  if (!passengerName || !from || !to) {
    alert("Please fill in all fields.");
    return;
  }

  if (from === to) {
    alert("From and Destination cannot be the same.");
    return;
  }

  var amount = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
  var amountWithSuffix = amount + "/-"; // Adding "/-" at the end of the fare
  var distance = Math.floor(Math.random() * (50 - 10 + 1)) + 10; // Simulating distance
  var time = Math.floor(distance / 2) + " mins"; // Simulating time based on distance

  var { jsPDF } = window.jspdf; // This line might be problematic
  var doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Travel Ticket", 20, 20);

  doc.setFontSize(12);
  doc.text(`Passenger Name: ${passengerName}`, 20, 40);
  doc.text(`From: ${from}`, 20, 50);
  doc.text(`Destination: ${to}`, 20, 60);
  doc.text(`Fare: ${amountWithSuffix}`, 20, 70);
  doc.text(`Distance: ${distance} km`, 20, 80);
  doc.text(`Time: ${time}`, 20, 90);

  doc.save("ticket.pdf");
}

