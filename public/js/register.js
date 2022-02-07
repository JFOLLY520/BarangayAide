console.log("js for register.html");

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


	var selectBrgy = document.getElementById("brgydd");

	db.collection("barangay").orderBy("name","asc").get().then(function(querySnapshot) {
	    querySnapshot.forEach(function(doc) {

	       

					var optionBrgy = document.createElement("Option");
						txtBrgy = document.createTextNode(doc.get("name"));
						optionBrgy.appendChild(txtBrgy);
						selectBrgy.insertBefore(optionBrgy, selectBrgy.lastChild);
						        	
	    });
	    	
	});
	
    

	function register(){
	
		var regex = /[^\s@]+@[^\s@]+\.[^\s@]+/; //email format
		var inputEmail = document.getElementById("email");
		var brgyID;
		var inputPass = document.getElementById("pass");
		var first_Name = document.getElementById("fname").value;
		var last_Name = document.getElementById("lname").value;
		var validateEmail = inputEmail.value;
		var validatePass = inputPass.value;
		var confirm = document.getElementById("confirmpass").value;
		var slctdBrgy = selectBrgy.options[selectBrgy.selectedIndex].text;
		console.log(slctdBrgy);
	
		db.collection("barangay").where("name", "==", slctdBrgy)
		.get()
		.then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				// doc.data() is never undefined for query doc snapshots
				
				brgyID = doc.id;
				  console.log(brgyID);
				
	
			});
		})
		.catch(function(error) {
			console.log("Error getting documents: ", error);
		});	
		
		
	
		
		if(validatePass == "" || validateEmail == "" || first_Name == "" || last_Name == ""){
			$(function () {
					  bootbox.alert({
					  title: "BarangayAide",
					  message: "Please enter required fields!",                 
				  });
				})
	
		}
		else if(validatePass.length < 5){
			$(function () {
					  bootbox.alert({
					  title: "BarangayAide",
					  message: "Minimum password length should be 6 characters.",                 
				  });
				})
		}
		
		else if(regex.test(validateEmail) == false){
			$(function () {
					  bootbox.alert({
					  title: "BarangayAide",
					  message: "Failed to create user: The email address is badly formatted.",                 
				  });
				})
		}
		else if(validatePass != confirm){
			$(function () {
					  bootbox.alert({
					  title: "BarangayAide",
					  message: "Passwords do not match!",                 
				  });
				})
		}
	
		else{
			firebase.auth().createUserWithEmailAndPassword(validateEmail, confirm)
		.then(function(data){
			var uidGet = data.user.uid; //unique Id
			var userEmail = data.user.email;
		
			 console.log('uid',data.user.uid); //displays newly created user's unique ID in the console
	
			var user = firebase.auth().currentUser;
	
			user.sendEmailVerification().then(function(){
			  // Email sent.
			bootbox.confirm({
			  message: 'A verification link was sent to your email. Please verify before logging in.',
			  callback: function(result) {
				if (result) {
				  window.location.href = 'index.html';
				}
			  }
			});
	
			}).catch(function(error) {
			  bootbox.alert(error); 
			});
	
			  db.collection("users").doc(uidGet).set({
			fname: first_Name,
			lname: last_Name,
			email: userEmail,
			barangayID: brgyID,
			barangay: slctdBrgy,
			role: "1", //1 - resident, 2 - official, 3 - admin;
			login: -1,
			uid: uidGet
			});
	
	
		})
		.catch(function(error) {
			bootbox.alert(error);
		});
	
		}

	

	
	
	
	//setTimeout("location.href = 'index.html';",500);
		
	//setTimeout("location.href = 'modules/residents/resfeed.html';",7000);
}
	


firebase.auth().onAuthStateChanged(firebaseUser=> {

		if(firebaseUser){
			var docRef = db.collection("users").doc(firebaseUser.uid); //takes uid of current user
				  docRef.get().then(function(doc) {

				    if (doc.exists) {
				    	firebase.auth().signOut();

				        if(doc.data().role == 1){

				        	console.log(firebaseUser.uid); //displays CURRENTLY logged in user data
							console.log("^ logged in.")
							firebase.auth().signOut();
							//setTimeout("location.href = 'index.html';",500);
							//setTimeout("location.href = 'modules/residents/resfeed.html';",1000);
				        }
				        
				   } 
				    else {
				        // doc.data() will be undefined in this case
				        console.log("No such document!");
				        
				        firebase.auth().signOut();
				    	//setTimeout("location.href = 'index.html';",1000);
				    }
				}).catch(function(error) {
				    console.log("Error getting document:", error);
				});	
		}
		else {
			console.log('no one logged in.');

		}

	});