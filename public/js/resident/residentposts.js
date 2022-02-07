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
			var email_verified = firebaseUser.emailVerified;
			console.log(email_verified);
			//console.log(firebaseUser.uid);
			//console.log(firebaseUser); //logs CURRENTLY logged in user data
			//console.log('Currently logged in as: ', firebaseUser.email);

db.collection("posts").where("accepted","==",true).where("status","==","Ongoing").where("userID", "==", firebaseUser.uid).orderBy("datetime","desc")
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
        

        var datef = doc.data().datetime;
        const actualDate = datef.toDate();
        var noTZ = actualDate.toLocaleString();
        var yesdate = noTZ.toString();

        db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
			var fname = querySnapshot1.get("fname");
			var lname = querySnapshot1.get("lname");
        	rejected.innerHTML += 

			"<div class='row' id='hideDefault'>"+
				"<div class='card' style='width:100%;'>"+

					"<div class='card-body cardo'>"+
						"<p>by <strong>"+fname+" "+lname+"</strong></p>"+
						"<p class='card-text'>" +noTZ+ " | <strong>" +doc.data().issue+ "</strong> | <strong>" +doc.data().barangayName+  "</strong></p>"+
						"<p class='card-text'>" +doc.data().description+ "</p><img src='"+doc.data().images+ "' class='card-img'>"+
					"</div>"+

					"<div class='card-footer cardo' >"+
						"<div class='row'>"+
							"<div class='col-lg-6'>"+
								
						"</div>"+	
					"</div>"+

						/*"<div class='row' id='cmnts' style='display:none;'>"+
							"<div class='col-lg-12'>"+
								"<label>Comments here</label>"+
						"</div>"+*/
						

					"</div>"+ //card footer	
				"</div>"+	  //card div
			"</div>&nbsp;"    //Row div
			});
  });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });


		}
		else {
			console.log('no one logged in.');
		}
	});

btnLogout.addEventListener('click', e =>{
		firebase.auth().signOut(); //signs out current user
		window.location.href = "../../index.html";

		
	});



//display name in feed
const dispUser = document.querySelector("#dispUser");
const rejects = document.querySelector("#rejected");

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
	    	if(doc.data().role == 1){
	    		//console.log("Document data:", doc.data());
		        console.log('Logged in as: ', doc.data().email, '||', doc.data().name);      
		      	dispUser.innerHTML += "<h2 class='myfont'>" +doc.data().fname+" "+doc.data().lname+  "</h2>" // displays name when logged in
	    	}
	        else if(doc.data().role == 2){
	        	window.location.href = "../../index.html";
	        }
	        else if(doc.data().role == 3){
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




