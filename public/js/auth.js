console.log("index.html");

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAuEY3ajMcu2qIYsha8tT1TEVtCSDkUzBw",
    authDomain: "kotlintry-f6729.firebaseapp.com",
    databaseURL: "https://kotlintry-f6729.firebaseio.com",
    projectId: "kotlintry-f6729",
    storageBucket: "kotlintry-f6729.appspot.com",
    messagingSenderId: "428608128780",
    appId: "1:428608128780:web:d91389f3bf5cbe0d7feb29"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


var db = firebase.firestore(); //firestore constant
const auth = firebase.auth(); //auth constant



	



firebase.auth().onAuthStateChanged(firebaseUser=> {
	
	
		if(firebaseUser){
			var docRef = db.collection("users").doc(firebaseUser.uid); //takes uid of current user
				  docRef.get().then(function(doc) {
				    if (doc.exists) {
				        if(doc.data().role == 1){//resident
				        var email_verified = firebaseUser.emailVerified; 
				        	if(email_verified == true ){ //make sure set to true 
				        		console.log(firebaseUser.uid); //displays CURRENTLY logged in user data
								console.log("^ logged in.");

								var logged = db.collection("users").doc(firebaseUser.uid);
									var logged_in = parseInt(doc.data().login) + 1;
									// Set the "capital" field of the city 'DC'
									return logged.update({
									    login: logged_in
									})
									.then(function() {
									    console.log("+1");
									    setTimeout("location.href = 'modules/residents/resfeed.html';",400);
									})
									.catch(function(error) {
									    // The document probably doesn't exist.
									    console.error("Error updating document: ", error);
									});
									

								
				        	}
				        	else {
				        		firebase.auth().signOut();
				        		
				        		$(function () {
								    bootbox.alert({
								    message: "We have sent you an email verification link; please verify your account first.",
								    callback: function () { location.reload(true); }
									});
								});
				        		

				        	}
				        	
				        }
				        else if(doc.data().role == 2){ //official
				        	console.log(firebaseUser.uid); //displays CURRENTLY logged in user data
							console.log("^ logged in.")
							
							var logged = db.collection("users").doc(firebaseUser.uid);
									var logged_in = parseInt(doc.data().login) + 1;
									// Set the "capital" field of the city 'DC'
									return logged.update({
									    login: logged_in
									})
									.then(function() {
									    console.log("+1");
									    setTimeout("location.href = 'modules/officials/brgyfeed.html';",400);
									})
									.catch(function(error) {
									    // The document probably doesn't exist.
									    console.error("Error updating document: ", error);
									});
									

				        }
				        else if(doc.data().role == 3){ //admin
				        	console.log(firebaseUser.uid); //displays CURRENTLY logged in user data
							console.log("^ logged in.")
							
							var logged = db.collection("users").doc(firebaseUser.uid);
									var logged_in = parseInt(doc.data().login) + 1;
									// Set the "capital" field of the city 'DC'
									return logged.update({
									    login: logged_in
									})
									.then(function() {
									    console.log("+1");
									    setTimeout("location.href = 'modules/admin/adminfeed.html';",400);
									})
									.catch(function(error) {
									    // The document probably doesn't exist.
									    console.error("Error updating document: ", error);
									});
									

				        }
				   } 
				    else {
				        // doc.data() will be undefined in this case
				        console.log("No such document!");
				    }
				}).catch(function(error) {
				    console.log("Error getting document:", error);
				});	
		}
		else {
			console.log('no one logged in.');

		}

	});


const loginEmail = document.getElementById('email_login');
const loginPass = document.getElementById('pass_login');


	btnLogin.addEventListener('click', e => {
		const email = loginEmail.value;
		const pass = loginPass.value;

		if(email == "" || pass == ""){
			bootbox.alert("Please enter required fields!");
		}
		else{
			const promise = auth.signInWithEmailAndPassword(email,pass);
		
		promise.catch(e => bootbox.alert(e.message));
		}
		


		
			
		
	});


function resetPassword(){
	var auth = firebase.auth();
	var regex = /[^\s@]+@[^\s@]+\.[^\s@]+/; //email format
	var recovery = document.getElementById("recovery").value;

	
	var emailAddress = recovery;

	if(recovery == ""){
		$(function () {
	      bootbox.alert({
	      title: "BarangayAide",
	        message: "Please enter an email!",
	          
	      });
	    })
	}
	else if(regex.test(recovery) == false){
		$(function () {
                  bootbox.alert({
                  title: "BarangayAide",
                    message: "Email poorly formatted. (Please enter a valid email address!)",
                  
              });
            })
	}
	else{
		auth.sendPasswordResetEmail(emailAddress).then(function() {
		  $(function () {
	      bootbox.alert({
	      title: "BarangayAide",
	        message: "Sent! Please check your email.",
	        callback: function () { location.reload(true); }
	          
	      });
	    })
		}).catch(function(error) {
		  
		  bootbox.alert(error);
		});
	}


}


	/*function resendEmail(){
		//firebase.auth().currentUser.reload() // reloads user fields, like emailVerified:
			if (!firebase.auth().currentUser.emailVerified) {
			    //resend verification email
			    firebase.auth().currentUser.sendEmailVerification();
			} else {
			     //login
			}
	}*/
	
//login
/*
function login(){

	firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    window.location.replace("modules/residents/resfeed.html");
  } else {
    // No user is signed in.
  }
	});

	var userEmail = document.getElementById("email_login").value;
	var userPass = document.getElementById("password_login").value;

	firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
  	// Handle Errors here.
  	var errorCode = error.code;
  	var errorMessage = error.message;

  	window.alert("error" + error);
  	// ...
});
}*/





//logout

////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
var inputfName = document.getElementById("fname").value;
	var inputlName = document.getElementById("lname").value;
db.collection("users").doc(uid).set({
		    fname: inputfName,
		    lname: inputlName,
		    uid: user.uid
		    //role: Resident
		})
		.then(function() {
			//window.alert("Document successfully written!");
		    console.log("Document successfully written!");
		})
		.catch(function(error) {
			//window.alert("Error writing document: ", error);
		    console.error("Error writing document: ", error);

		});
*/

/*function newUser(){

	var inputfName = document.getElementById("fname").value;
	var inputlName = document.getElementById("lname").value;
	var inputEmail = document.getElementById("email").value;
	var inputPass = document.getElementById("password").value;
	// Add a new document in collection "cities"

	db.collection("users").doc().set({
	    fname: inputfName,
	    lname: inputlName,
	    email: inputEmail,
	    password: inputPass
	    //role: Resident
	})
	.then(function() {
		//window.alert("Document successfully written!");
	    console.log("Document successfully written!");
	})
	.catch(function(error) {
		//window.alert("Error writing document: ", error);
	    console.error("Error writing document: ", error);

	});

}*/