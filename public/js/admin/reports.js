console.log("resolve.js for ADMIN");

  // Your web app's Firebase configuration
  var firebaseConfig1 = {
    apiKey: "AIzaSyAuEY3ajMcu2qIYsha8tT1TEVtCSDkUzBw",
    authDomain: "kotlintry-f6729.firebaseapp.com",
    databaseURL: "https://kotlintry-f6729.firebaseio.com",
    projectId: "kotlintry-f6729",
    storageBucket: "kotlintry-f6729.appspot.com",
    messagingSenderId: "428608128780",
    appId: "1:428608128780:web:d91389f3bf5cbe0d7feb29"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig1);

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User logged in already or has just logged in.
      console.log(user.uid); //logs currently logged in user's UID
      
    } else {
      // User not logged in or has just logged out.
      location.href ="../../index.html";
    }
    var docRef = db.collection("users").doc(user.uid); //takes uid of current user
    docRef.get().then(function(doc) {
      if (doc.exists) {
        if(doc.data().role == 3){
          //console.log("Document data:", doc.data());
            console.log('Logged in as: ', doc.data().email, '||', doc.data().name);      
             // displays name when logged in
        }
          else if(doc.data().role == 1){
            window.location.href = "../../index.html";
          }
          else if(doc.data().role == 2){
            window.location.href = "../../index.html";
          }
         
      } 
      else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
});

var db1 = firebase.firestore(); //firestore constant
  const auth1 = firebase.auth(); //auth constant

 