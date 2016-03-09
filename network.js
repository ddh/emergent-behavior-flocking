// Socket to connect to Chris's server
var socket = io.connect("http://76.28.150.193:8888");

// Function to load data from Chris's server
var loadNetworkData = function () {
    console.log("Loading previous state of Boids Simulation...");
    socket.emit("load", {studentname: "Duy Huynh", statename: "BoidsData"});


};

// Function to save data to Chris's server
var saveNetworkData = function () {
    console.log("Saving Boids and simulation settings");

    // For each boid, save it's x, y, angle and velocity
    var boidsSave = [];
    for (var i = 0; i < boids.length; i++) {
        boidsSave.push({angle: boids[i].angle, position: boids[i].position, velocity: boids[i].velocity});
    }

    socket.emit("save", {
        studentname: "Duy Huynh",
        statename: "BoidsData",
        boids: boidsSave, // Unable to directly put in the boids object; it's too big I guess
        distances: [SEPARATION_DISTANCE, ALIGNMENT_DISTANCE, COHESION_DISTANCE],
        multipliers: [SEPARATION_MULTIPLIER, ALIGNMENT_MULTIPLIER, COHESION_MULTIPLIER]
    });
};

// This is called whenever data is loaded from the server
socket.on("load", function (data) {
    console.log("Loading...");

    // Empty the entities and boids array
    gameEngine.boids = [];
    gameEngine.entities = [];

    // Recreate each boid given the save data
    for (var i = 0; i < data.boids.length; i++) {
        var boid = new Boid(gameEngine, data.boids[i].position.x, data.boids[i].position.y, data.boids[i].angle);
        boid.velocity = new Victor(data.boids[i].velocity.x, data.boids[i].velocity.y);
        gameEngine.addEntity(boid);
        gameEngine.boids.push(boid);
    }

    // Now reset the sliders back to where they were on last save
    $('#separation-distance-slider').val(data.distances[0]).change();
    $('#alignment-distance-slider').val(data.distances[1]).change();
    $('#cohesion-distance-slider').val(data.distances[2]).change();
    $('#separation-distance-value').val(data.distances[0]).change();
    $('#alignment-distance-value').val(data.distances[1]).change();
    $('#cohesion-distance-value').val(data.distances[2]).change();
    $('#separation-multiplier-slider').val(data.multipliers[0]).change();
    $('#alignment-multiplier-slider').val(data.multipliers[1]).change();
    $('#cohesion-multiplier-slider').val(data.multipliers[2]).change();
    $('#separation-multiplier-value').val(data.multipliers[0]).change();
    $('#alignment-multiplier-value').val(data.multipliers[1]).change();
    $('#cohesion-multiplier-value').val(data.multipliers[2]).change();


});

window.onload = function () {
    console.log("starting up da sheild");
    //var messages = [];
    //var field = document.getElementById("field");
    //var username = document.getElementById("username");
    //var content = document.getElementById("content");

    socket.on("ping", function (ping) {
        console.log(ping);
        socket.emit("pong");
    });

    //socket.on("sync", function (data) {
    //    messages = data;
    //    var html = '';
    //    for (var i = 0; i < messages.length; i++) {
    //        html += '<b>' + (messages[i].username ? messages[i].username : "Server") + ": </b>";
    //        html += messages[i].message + "<br />";
    //    }
    //    content.innerHTML = html;
    //    content.scrollTop = content.scrollHeight;
    //    console.log("sync " + html);
    //});

    //socket.on("message", function (data) {
    //    if (data.message) {
    //        messages.push(data);
    //        var html = '';
    //        for (var i = 0; i < messages.length; i++) {
    //            html += '<b>' + (messages[i].username ? messages[i].username : "Server") + ": </b>";
    //            html += messages[i].message + "<br />";
    //        }
    //        content.innerHTML = html;
    //        content.scrollTop = content.scrollHeight;
    //    } else {
    //        console.log("No message.");
    //    }
    //});

    socket.on("connect", function () {
        console.log("Socket connected.")
    });
    socket.on("disconnect", function () {
        console.log("Socket disconnected.")
    });
    socket.on("reconnect", function () {
        console.log("Socket reconnected.")
    });

};
