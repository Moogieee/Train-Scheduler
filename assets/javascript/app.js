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
	// var firstTrainTime = $("#first-train-time-input").val().trim();

	// store firstTrainTime as UNIX format
	var firstTrainTime = moment($("#first-train-time-input").val().trim(), "HH:mm").format("X");

	var frequency = $("#frequency-input").val().trim();

	// create local "temporary" object for holding train data
	var newTrain = {
		name: trainName,
		destination: destination,
		firstTrainTime: firstTrainTime,
		frequency: frequency
	};

	// upload train data to the firebase database
	database.ref().push(newTrain);

	// console.log(newTrain.name);
	// console.log(newTrain.destination);
	// console.log(newTrain.firstTrainTime);
	// console.log(newTrain.frequency);


	alert("Train successfully added");

	// clear the input boxes
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


//=================== Train Time Calculations =====================


	// format currentTime to military time
	var currentTime = moment().format("HH:mm");
	console.log("Current Time: " + currentTime);

	// calculate difference betweent currentTime & trainArrival in "minutes"
	var timeDifference = moment().diff(moment.unix(firstTrainTime, "X"), "minutes");
	console.log("Time Difference: " + timeDifference);

	// divide diffTime by frequency to get the remainder
	var timeRemainder = timeDifference % frequency;
	console.log("Time Remainder: " + timeRemainder);

	// minTilArrival = frequency - timeRemainder
	var minTilArrival = frequency - timeRemainder;
	console.log("Minutes Until Arrival: " + minTilArrival);

	// nextTrainArrival = minTilArrival + currentTime
	var nextTrainArrival = moment().add(minTilArrival, "minutes").format("HH:mm");
	console.log("Next Train Arrives in: " + nextTrainArrival);



//==================================================================


	console.log(name);
	console.log(destination);
	console.log(firstTrainTime);
	console.log(frequency);
	console.log(nextTrainArrival);
	console.log(minTilArrival);


	// add values to html page
	$("#train-table > tbody").append("<tr><td>" + name + 
									"</td><td>" + destination + 
									"</td><td>" + frequency  +
									"</td><td>" + nextTrainArrival + 
									"</td><td>" + minTilArrival +
									"</td></tr>");
});



//====================== Current Time Clock ========================

// this clock works fine... except that I tried to get the nextTrainArrival and minTilArrival to refresh every minute but I couldn't. So this would look weird if I left it on my page.

// function displayTime() {
//     var time = moment().format('HH:mm:ss');
//     $('#clock').html(time);
//     setTimeout(displayTime, 1000);
// }

// $(document).ready(function() {
//     displayTime();
// });

//==================================================================