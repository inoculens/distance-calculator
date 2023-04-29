window.onload = function() {
    // Clear Inputs
    document.getElementById("eventLocation").value = "";
    document.getElementById("eventDays").value = "0";
}

function calculateDistance() {
    let location1 = document.getElementById('baseLocation').value;
    let location2 = document.getElementById('eventLocation').value;

    if (location1.trim() === "" || location2.trim() === "") {
        alert("Please enter the event location.");
        return;
    }

    // Geocode the locations using the Nominatim API
    var geocodeUrl1 = "https://nominatim.openstreetmap.org/search?q=" + encodeURI(location1) + "&format=json";
    var geocodeUrl2 = "https://nominatim.openstreetmap.org/search?q=" + encodeURI(location2) + "&format=json";

    Promise.all([
        fetch(geocodeUrl1).then(response => response.json()),
        fetch(geocodeUrl2).then(response => response.json())
    ])
    .then(results => {
        var location1Coords = [results[0][0].lat, results[0][0].lon];
        var location2Coords = [results[1][0].lat, results[1][0].lon];

        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(location2Coords[0]-location1Coords[0]);
        var dLng = deg2rad(location2Coords[1]-location1Coords[1]);
        var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(location1Coords[0])) * Math.cos(deg2rad(location2Coords[0])) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var distance = R * c;

        document.getElementById('submit').click();
        document.getElementById('result').innerHTML = distance.toFixed(2) + " km";
        let nigts = document.getElementById('eventDays').value
        let cost = distance.toFixed(2) / 8 * 5 + nigts * 150;
        document.getElementById('cost').innerHTML = "€" + cost.toFixed(2);
    })
    .catch(error => {
        alert("An error occurred while geocoding the locations.");
        console.error(error);
    });
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}