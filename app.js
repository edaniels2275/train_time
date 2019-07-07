// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAEl2Gb-Af5Mh8TR2-hF7VdcNJAphXg4tI",
    authDomain: "traintime-db183.firebaseapp.com",
    databaseURL: "https://traintime-db183.firebaseio.com/",
    storageBucket: "traintime-db183.appspot.com"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // 2. Button for adding Employees
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();

    //used moment for correct input here
    var firstTrainTime = moment($("#first-train-time-input").val().trim(), "HH:mm").format("YYYY-MM-DD HH:mm");
    var trainFrequency = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      first_train: firstTrainTime,
      frequency: trainFrequency
    };
  
    // Uploads train data to the database by pushing train object
    database.ref().push(newTrain);
  
    // Clears all of the text-boxes in the form
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#frequency-input").val("");
  });
  
  // 3. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    // console.log(childSnapshot.val());
  
    // Store each object property: value pair into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().first_train;
    var trainFrequency = childSnapshot.val().frequency;

      var currentTime = moment();
  
      //Subtracts the schedule of the first train time back a year to make sure it's before current time.
      var firstTrainConverted = moment(childSnapshot.val().first_train, "hh:mm").subtract(1, "years");
      console.log(firstTrainConverted);
  
      //The time difference between current time and the converted first train time in minutes.
      var difference = currentTime.diff(moment(firstTrainConverted), "minutes");
      console.log(difference);
  
      //Time since most recent departure.
      var remainder = difference % childSnapshot.val().frequency;
      console.log(remainder);
  
      //Minutes until next train leaves.
      var minUntilTrain = childSnapshot.val().frequency - remainder;
      console.log(minUntilTrain);
  
      //Time when the next train leaves.
      var nextTrain = currentTime.add(minUntilTrain, "minutes").format("LT");
      console.log(nextTrain);
  
    // Create the new row.
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(trainFrequency),
      $("<td>").text(nextTrain),
      $("<td>").text(minUntilTrain)
    );
  
    // Append the new row to the table.
    $("#train-table > tbody").append(newRow);
  
    });