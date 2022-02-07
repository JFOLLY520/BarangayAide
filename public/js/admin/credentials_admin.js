console.log("js for ressettings.html");

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

firebase.auth().onAuthStateChanged((user)=> {
		var docRef = db.collection("users").doc(user.uid); //takes uid of current user
    docRef.get().then(function(doc) {
      if (doc.exists) {
        if(doc.data().role == 3){
          //console.log("Document data:", doc.data());
            console.log('Logged in as: ', doc.data().email, '||', doc.data().name);      
            dispUser.innerHTML += "<h2 class='myfont'>" +doc.data().fname+" "+doc.data().lname+  "</h2>" // displays name when logged in
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

btnLogout.addEventListener('click', e =>{
		firebase.auth().signOut(); //signs out current user
		window.location.href = "../../index.html";

		
	});

const dispName = document.querySelector("#dispName");
const dispInfo = document.querySelector("#dispInfo");
const modal_userN = document.querySelector("#name_modal");
const modal_userE = document.querySelector("#email_modal");
const modal_userP = document.querySelector("#pass_modal");
firebase.auth().onAuthStateChanged((user) => {
	  if (user) {


	  	var docRef = db.collection("users").doc(user.uid); //takes uid of current user
	  docRef.get().then(function(doc) {
	    if (doc.exists) {
	    	dispInfo.innerHTML += 
	  	"<div class='row'>"+
            "<div class='col'>"+
                "<label><h4>Name</h4></label>"+
                  	"<div class='ml-3' id='firstname'>"+
                  		"<label><h3>"+doc.data().fname+" "+doc.data().lname+" | "+"</h3></label>"+
                  		"<a href='#' type='button' class='ml-1' data-toggle='modal' data-target='#edit_resName'>Edit</a>"+
                  	"</div>"+

                  	"<div id='eName' class='row ml-3'>"+
	                  	"<div class='col-xs-3 mb-2'>"+
	                  		//"<input type='text' class='form-control' id='newName' placeholder='New display name'>"+
	                  	"</div>"+
	                  	"<div class='pull-left col-xs-1 mb-2'>"+
	                  		//"<button type='button' onclick='updName()' class='ml-1 update_Name btn btn-outline-info'>Update</button>"+
	                  		//"<button type='button' class='ml-1 btn btn-outline-danger'>Cancel</button>"+
	                  	"</div>"+
                  	"</div>"+

            "</div>"+
        "</div>"+
        "<hr>"+
        "<div class='row'>"+
            "<div class='col'>"+
                "<label><h4>Email</h4></label>"+
                  	"<div class='ml-3' id='emadd'>"+
                  		"<label><h3>"+user.email+" | "+"</h3></label>"+
                  		"<a href='#' type='button' class='ml-1' data-toggle='modal' data-target='#edit_resEmail'>Edit</a>"+
                  	"</div>"+

                  	"<div id='eEmail' class='row ml-3'>"+
	                  	"<div class='col-xs-3 mb-2'>"+
	                  		//"<input type='text' class='form-control' placeholder='New Email'>"+
	                  	"</div>"+
	                  	"<div class='pull-left col-xs-1 mb-2'>"+
	                  		//"<button type='button' class='ml-1 btn btn-outline-info'>Update</button>"+
	                  		//"<button type='button' class='ml-1 btn btn-outline-danger'>Cancel</button>"+
	                  	"</div>"+
                  	"</div>"+

            "</div>"+
        "</div>"+
        "<hr>"+
        "<div class='row'>"+
            "<div class='col'>"+
                "<label><h4>Password</h4></label>"+
                  	"<div class='ml-3' id='emadd'>"+
                  		"<label><h3>******** | "+"</h3></label>"+
                  		"<a href='#' type='button' class='ml-1' data-toggle='modal' data-target='#edit_resPass'>Edit</a>"+
                  	"</div>"+

                  	"<div id='eEmail' class='row ml-3'>"+
	                  	"<div class='col-xs-3 mb-2'>"+
	                  		//"<input type='text' class='form-control' placeholder='New Email'>"+
	                  	"</div>"+
	                  	"<div class='pull-left col-xs-1 mb-2'>"+
	                  		//"<button type='button' class='ml-1 btn btn-outline-info'>Update</button>"+
	                  		//"<button type='button' class='ml-1 btn btn-outline-danger'>Cancel</button>"+
	                  	"</div>"+
                  	"</div>"+

            "</div>"+
        "</div>"+
        "<hr>"+
        "<div class='row'>"+
            "<div class='col'>"+
                "<label><h4>Barangay</h4></label>"+
                  	"<div class='ml-3' id='emadd'>"+
                  		"<label><h3>"+doc.data().barangay+" </label>"+
                  		
                  	"</div>"+            

            "</div>"+
			"<div class='col'>"+
                "<label><h4>Post Longevity</h4></label><br>"+

                  	"<select id='years' class='text-center btn btn-sm btn-light mx-auto' style='box-shadow: none; font-size: 2.1vh;  color:black; width: 6vw;'>"+
					  "<option selected >"+doc.data().explicitYears+"</option>"+
					  "<option >1</option>"+
					  "<option >2</option>"+
					  "<option >3</option>"+
					  "<option >4</option>"+
					  "<option >5</option>"+
                                                
                         "</select>"+         
						 "<button type='button' class='btn btn-info btn-sm mx-2' onclick='updYears()'>Update</button>"+

            "</div>"+
        "</div>"

	    } 
	    else {
	        // doc.data() will be undefined in this case
	        console.log("No such document!");
	    }
	}).catch(function(error) {
	    console.log("Error getting document:", error);
	});


	  	window.userID = user.uid;

	    // User logged in already or has just logged in.
	    console.log(user.uid); //logs currently logged in user's UID
	    console.log(user.email);
	  } else {
	    // User not logged in or has just logged out.
	    location.href ="../../index.html";
	  }
	  var docRef = db.collection("users").doc(user.uid); //takes uid of current user
	  docRef.get().then(function(doc) {
	    if (doc.exists) {

		        dispName.innerHTML += "<h4 class='myfont'>Admin  -  " +doc.data().fname+" "+doc.data().lname+ "</h4>" // displays name when logged in
		        modal_userN.innerHTML += 

		      	"<div class='row mb-1'>"+
		            "<div class='col-md-12'>"+
		              "<label>Current Name</label>"+
		              "<input class='form-control' value='"+doc.data().fname+" "+doc.data().lname+"' readonly>"+
		            "</div>"+  

		         "</div>"+

		         "<div class='row'>"+          
		            "<div class='col-md-6'>"+
		              "<label>First Name</label>"+
		              "<input type='text' id='update_fname' class='form-control' placeholder='New Display Name' value='"+doc.data().fname+"'>"+
		            "</div>"+
		            "<div class='col-md-6'>"+
		              "<label>Last Name</label>"+
		              "<input type='text' id='update_lname' class='form-control' placeholder='New Display Name' value='"+doc.data().lname+"'>"+
		            "</div>"+
	          	"</div>" 

	          	modal_userE.innerHTML +=

	          	"<div class='row mb-1'>"+
		            "<div class='col-md-12'>"+
		              "<label>Current Email</label>"+
		              "<input class='form-control' value='"+doc.data().email+"' readonly>"+
		            "</div>"+    
		         "</div>"+

		         "<div class='row'>"+          
		            "<div class='col-md-12'>"+
		              "<label>New Email</label>"+
		              "<input type='email' id='update_email' class='form-control' placeholder='New Email' required>"+
		            "</div>"+
	          	"</div>" 

	          	modal_userP.innerHTML +=
	          	"<div class='row mb-1'>"+		               
		            "<div class='col-md-12'>"+
		              "<p>*password should be at least 6 characters in length.</p>"+
		              "<input type='password' id='update_pass' class='form-control' placeholder='New Password' required>"+
		            "</div>"+
	          	"</div>" 

	    } 
	    else {
	        // doc.data() will be undefined in this case
	        console.log("No such document!");
	    }
	}).catch(function(error) {
	    console.log("Error getting document:", error);
	});
});

function updYears(){
	var years = document.getElementById("years").value;
	var update_years = parseInt(years);
	console.log(update_years);
	firebase.auth().onAuthStateChanged((user) => {
	  if (user) {
	  	bootbox.confirm({
          title: "BarangayAide:",
          message: "Are you sure you want to change how long posts last on the system?",
          buttons: {
              cancel: {
                  label: '<i class="fa fa-times"></i> Cancel'

              },
              confirm: {
                  label: '<i class="fa fa-check"></i> Confirm'
              }
          },
          callback: function (result) {
          	if(result == true){
				var docRef = db.collection("users").doc(user.uid);

				docRef.get().then((doc) => {
					if (doc.exists) {
						var updateYears = db.collection("users").doc(user.uid); //takes uid of current user
						updateYears.update({
						explicitYears: update_years
						})

						.then(function() {
						    console.log("Longevity changed!");
						    bootbox.alert({
							    message: "Post Life changed!",
							    callback: function () { location.reload(true); }
								});
						});
					} else {
						
					}
				})
	    
          	}
          	else{

          	}
          }
      });


	 
	    
	  } 
	  else {
	    // User not logged in or has just logged out.
	    location.href ="../../index.html";
	  }
	});


}



function updPass(){
	var newPassword = document.getElementById("update_pass").value;
  	if(newPassword == ""){
  		$(function () {
                  bootbox.alert({
                  title: "BarangayAide",
                  message: "Please add a Password!",                 
              });
            })
  	}
  	else if(newPassword.length < 5){
  		$(function () {
                  bootbox.alert({
                  title: "BarangayAide",
                  message: "Please make your password atleast 6 characters long!",                 
              });
            })
  	}
  	else{
  		bootbox.confirm({
          title: "BarangayAide:",
          message: "Are you sure you want to change your Password?",
          buttons: {
              cancel: {
                  label: '<i class="fa fa-times"></i> Cancel'

              },
              confirm: {
                  label: '<i class="fa fa-check"></i> Confirm'
              }
          },
          callback: function (result) {
          	var user = firebase.auth().currentUser;
          	if(result == true){
          		var user = firebase.auth().currentUser;
				//var userProvidedPassword = prompt("Password: ");

				bootbox.prompt({
				    title: "Please enter current password to continue: ",
				    inputType: 'password',
				    callback: function (result) {
				        var userProvidedPassword = result;
				        //var userProvidedPassword = document.getElementById("password");
					const credential = firebase.auth.EmailAuthProvider.credential(
					user.email, 
					userProvidedPassword
				);
				// Now you can use that to reauthenticate
				user.reauthenticateWithCredential(credential).then(function() {
					  // User re-authenticated.
					  console.log("User Reauthenticated!");
					  
					  	
						user.updatePassword(newPassword).then(function() {
						  // Update successful.
						  $(function () {
			                  bootbox.alert({
			                  title: "BarangayAide",
			                    message: "Password changed",
			                  callback: function () { location.reload(true); }
			              });
			            })
						}).catch(function(error) {
						  // An error happened.
						});
					
					}).catch(function(error) {
					  // An error happened.
					  $(function () {
			                  bootbox.alert({
			                  title: "BarangayAide",
			                    message: "Wrong Password!",
			                  callback: function () { location.reload(true); }
			              });
			            })
					});

				    }
				});
          	}

          }
      });	
  	}

}

//bootbox.alert("Please enter an Email!");

function updEmail(){
var newEmail = document.getElementById("update_email").value;
var regex = /[^\s@]+@[^\s@]+\.[^\s@]+/; //email format
    
	if(newEmail == ""){
		$(function () {
                  bootbox.alert({
                  title: "BarangayAide",
                    message: "Please add an email!",
                  
              });
            })
	}
	else if(regex.test(newEmail) == false){
		$(function () {
                  bootbox.alert({
                  title: "BarangayAide",
                    message: "Email poorly formatted. (Please enter a valid email address!)",
                  
              });
            })
	}
	
	else{
		bootbox.confirm({
          title: "BarangayAide:",
          message: "Are you sure you want to change your Email?",
          buttons: {
              cancel: {
                  label: '<i class="fa fa-times"></i> Cancel'

              },
              confirm: {
                  label: '<i class="fa fa-check"></i> Confirm'
              }
          },
          callback: function (result) {
          	var user = firebase.auth().currentUser;
          	if(result == true){
          		var user = firebase.auth().currentUser;
				//var userProvidedPassword = prompt("Password: ");

				bootbox.prompt({
				    title: "Please enter password to continue: ",
				    inputType: 'password',
				    callback: function (result) {
				        var userProvidedPassword = result;
				        //var userProvidedPassword = document.getElementById("password");
					const credential = firebase.auth.EmailAuthProvider.credential(
					user.email, 
					userProvidedPassword
				);
				// Now you can use that to reauthenticate
				user.reauthenticateWithCredential(credential).then(function() {
					  // User re-authenticated.
					  console.log("User Reauthenticated!");
					  
					  	var updateDocRef = db.collection("users").doc(user.uid); 
					    updateDocRef.update({
					      email: newEmail
					    })

					  .then(function() {
					      console.log("Document successfully updated!");
					  });
						user.updateEmail(newEmail).then(function() {
						  // Update successful.
						  $(function () {
			                  bootbox.alert({
			                  title: "BarangayAide",
			                    message: "Email changed",
			                  callback: function () { location.reload(true); }
			              });
			            })
						}).catch(function(error) {
						  // An error happened.
						});

					  
					}).catch(function(error) {
					  // An error happened.
					  $(function () {
			                  bootbox.alert({
			                  title: "BarangayAide",
			                    message: "Wrong Password!",
			                  callback: function () { location.reload(true); }
			              });
			            })
					});

				    }
				});
          	}

          }
      });
	}



}




function updName(){
	updatefName = document.getElementById("update_fname").value;
	updatelName = document.getElementById("update_lname").value;
	if(updatefName == "" || updatelName == ""){
		$(function () {
                  bootbox.alert({
                  title: "BarangayAide",
                    message: "Please enter required names!",
                  
              });
            })
	}
	else{
		firebase.auth().onAuthStateChanged((user) => {
	  
	  bootbox.confirm({
          title: "BarangayAide:",
          message: "Are you sure you want to change your name?",
          buttons: {
              cancel: {
                  label: '<i class="fa fa-times"></i> Cancel'

              },
              confirm: {
                  label: '<i class="fa fa-check"></i> Confirm'
              }
          },
          callback: function (result) {
          	if(result == true){
          		var updateDocRef = db.collection("users").doc(user.uid); //takes uid of current user
					 	updateDocRef.update({
					    fname: updatefName,
					    lname: updatelName
	  })

	.then(function() {
	    console.log("Document successfully updated!");
	});

		$(function () {
		    bootbox.alert({
		    message: "Name(s) changed successfully!",
		    callback: function () { location.reload(true); }
			});
		})
          	}
          	else{

          	}
          }
      });
	  
	
	})
	}
	
	

}




