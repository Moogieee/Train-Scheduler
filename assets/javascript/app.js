/* global moment firebase */
// Initialize Firebase      
  var config = {
    apiKey: "AIzaSyCgkD-pSu1mv32BAbAQ5H3KHRmZrRBxlfs",
    authDomain: "cn-firebase.firebaseapp.com",
    databaseURL: "https://cn-firebase.firebaseio.com",
    projectId: "cn-firebase",
    storageBucket: "",
    messagingSenderId: "992428345090"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// create button to add new train
$("#add-train-btn").on("click", function(event) {
	event.preventDefault();

	// Grab user input
	var trainName = $("#train-name-input").val().trim();
	var destination = $("#destination-input").val().trim();
	var firstTrainTime = $("#first-train-time-input").val().trim();
	var frequency = $("#frequency-input").val().trim();

	// create local "temporary" object for holding employee data
	var newTrain = {
		name: trainName,
		destination: destination,
		firstTrainTime: firstTrainTime,
		frequency: frequency
	};

	// upload employee data to the database
	database.ref().push(newTrain);

	console.log(newTrain.name);
	console.log(newTrain.destination);
	console.log(newTrain.firstTrainTime);
	console.log(newTrain.frequency);


	alert("Train schedule successfully added");

	// clear the text boxes
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#first-train-time-input").val("");
	$("#frequency-input").val("");

});

database.ref().on("child_added", function(snapshot, prevChildKey) {

	console.log(snapshot.val());

	var name = snapshot.val().name;
	var destination = snapshot.val().destination;
	var firstTrainTime = snapshot.val().firstTrainTime;
	var frequency = snapshot.val().frequency;

	var remainingTime = moment().diff(moment.unix(firstTrainTime), "minutes") % frequency;

	var nextArrival = moment().add(minutesAway,"m").format("hh:mm A");

	var minutesAway = frequency - remainingTime;

	console.log(name);
	console.log(destination);
	console.log(firstTrainTime);
	console.log(frequency);
	console.log(nextArrival);
	console.log(minutesAway);

	$("#train-table > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + " min" + "</td></tr>");
});