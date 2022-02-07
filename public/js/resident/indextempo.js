console.log("js for resfeed.html");

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
			//console.log(firebaseUser); //logs CURRENTLY logged in user data
			//console.log('Currently logged in as: ', firebaseUser.email);
			
			
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
const dispFeed = document.querySelector("#feed");

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
		      	dispUser.innerHTML += "<h2 class='myfont'>" +doc.data().name+  "</h2>" // displays name when logged in
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



var URLimg = "https://firebasestorage.googleapis.com/v0/b/kotlintry-f6729.appspot.com/o/ImageFolder%2Fimage%2Fdownload.png?alt=media&token=7309790a-7384-4e18-9152-2672ba9f1323";
//no image uploaded

/*----------------------------------IMAGE UPLOAD---------------------------------*/
var btnUpload = document.getElementById('btnUpload');

	btnUpload.addEventListener('change', function(e){
		var file = e.target.files[0];

		var storageRef = firebase.storage().ref('pictures/' + file.name);	

		var task = storageRef.put(file);


		task.on('state_changed',
			function progress(snapshot){
				var progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
				console.log("upload is " +progress+ "% done");

			},
			function error(err){

			},
			function url(){
				task.snapshot.ref.getDownloadURL().then(function(downloadURL){
					
					
						window.URLimg = downloadURL;
					

					

			});
			}

			);
	});




/*============================Issue Filter================================*/
	var filterIssue = document.getElementById("filter_issue");

	db.collection("issues").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
              
				var issues_F = document.createElement("Option");
					txtIssue_F = document.createTextNode(doc.get("name"));
					issues_F.appendChild(txtIssue_F);
					filterIssue.insertBefore(issues_F, filterIssue.lastChild);	
    	});
	});
/*============================Issue Filter================================*/

/*============================Barangay Filter================================*/
	var filterBrgy = document.getElementById("filter_brgy");

	db.collection("barangay").get().then(function(querySnapshot) {
	    querySnapshot.forEach(function(doc) {
	              
					var brgy_F = document.createElement("Option");
						txtBrgy_F = document.createTextNode(doc.get("name"));
						brgy_F.appendChild(txtBrgy_F);
						filterBrgy.insertBefore(brgy_F, filterBrgy.lastChild);	
	    });
	});
/*============================Barangay Filter================================*/

/*==================================FEED=====================================*/

db.collection("posts").where("accepted", "==", true).orderBy("datetime","desc")
		    .get()
		    .then(function(querySnapshot) {
		        querySnapshot.forEach(function(doc) {

		            //console.log(doc.id, " => ", doc.data().description);
		            	var datef = doc.data().datetime;
			            const actualDate = datef.toDate();
			            var noTZ = actualDate.toLocaleString();
			            var yesdate = noTZ.toString();

			db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
				var name = querySnapshot1.get("name");
			
				if(doc.data().issue == "Announcement" || doc.data().anonymous == false){
		         var name = querySnapshot1.get("name");
		        }
		        else {
		          var name = "Anonymous"
		        }

			dispFeed.innerHTML += 

			"<div class='row' id='hideDefault'>"+
				"<div class='card' style='width:100%;'>"+

					"<div class='card-body cardo'>"+
						"<p>by <strong>"+name+"</strong></p>"+
						"<p class='card-text'>" +noTZ+ " | <strong>" +doc.data().issue+ "</strong> | <strong>" +doc.data().barangayName+  "</strong></p>"+
						"<p class='card-text'>" +doc.data().description+ "</p><img src='"+doc.data().images+ "' class='card-img'>"+
					"</div>"+

					"<div class='card-footer cardo' >"+
						"<div class='row'>"+
							"<div class='col-lg-6'>"+
								"<input type='button' id='liked' class='btn btn-block' value='👍 Like' onclick='likePost(\""+doc.id+"\")'>"+
							"</div>"+
							"<div class='col-lg-6'>"+
								"<button type='button' class='btn btn-block' onclick='comments(\""+doc.id+"\")' data-toggle='modal' data-target='#modal_comments'>Comment</button>"+
							"</div>"+
						"</div>"+
						"&nbsp;"+

						"<div class='row'>"+
							"<div class='col-lg-11'>"+
								"<input type='text' id='comment' style='width:100%;' placeholder='Write a comment...'>"+
								//cmntBox.cmntBox();
							"</div>"+
							"<div class='col-lg-1'>"+
							
								"<button type='button' onclick='addComment(\""+doc.id+"\")'><span class='lnr lnr-location'></span></button>"+
								
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


/*==================================FEED=====================================*/



function reset_Filter(){
	location.reload();
	
	return false;
}


function comments(postID){
	const cmmtData = document.querySelector("#cmmts_modal");

	var docRef = db.collection("posts").doc(postID);

		docRef.get().then(function(doc) {
		    if (doc.exists) {
		    	console.log("Post ID:", doc.id);
		    	var post = doc.id

		    	db.collection("feedback").where("postID", "==", post)
				    .get()
				    .then(function(querySnapshot) {
				        querySnapshot.forEach(function(doc) {
				            // doc.data() is never undefined for query doc snapshots
				            //console.log(doc.id, " => ", doc.data());
				            db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
				            	if(doc.data().anonymous == false){
						             var name = querySnapshot1.get("name");
						            }
						            else {
						              var name = "Anonymous"
						            }
						            cmmtData.innerHTML += 

				            "<div class='row mb-1'>"+
					            "<div class='col-md-12'>"+
					            	"<p>by: <h6>"+name+":</h6></p>"+

					            	"<label>"+doc.data().comment+"</label>"+
					            "</div>"+				            
				            "</div>"+
				            "<hr>"


				            });
      
				        });
				    })
				    .catch(function(error) {
				        console.log("Error getting documents: ", error);
				    });
		        
		    } else {
		        // doc.data() will be undefined in this case
		        console.log("No such document!");
		    }
		}).catch(function(error) {
		    console.log("Error getting document:", error);
		});


		$('#modal_comments').on('hidden.bs.modal', function () { 
		    location.reload();
		});
}




//filter button
$(document).ready(function(){
	  $("#filter").click(function(){
	    $("#reset").show();
	    $("#filter").hide();
	    //$('#default').hide();
	  });
	  $("#reset").click(function(){
	    $("#filter").show();
	    $("#reset").hide();
	  });
	});
 	

/*--------------------------------------------------------------------------------*/


var selectIssue = document.getElementById("issuedd");

db.collection("issues").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
              
				var optionIssue = document.createElement("Option");
					txtIssue = document.createTextNode(doc.get("name"));
					optionIssue.appendChild(txtIssue);
					selectIssue.insertBefore(optionIssue, selectIssue.lastChild);	
    	});
	});

	var arrayBrgy = [];

	function brgyInfo(nameofbrgy,idofbrgy){
		const brgyObj = {};
		brgyObj.name = nameofbrgy;
		brgyObj.id = idofbrgy;
		return brgyObj;
		//var name = nameofbrgy;
		//var id = idofbrgy;
		//alert("name of " + name);
	}

	var selectBrgy = document.getElementById("brgydd");

	db.collection("barangay").get().then(function(querySnapshot) {
	    querySnapshot.forEach(function(doc) {

	       console.log(doc.data().name + " " + doc.id.toString());

	       let id_name = brgyInfo(doc.data().name, doc.id.toString());
	       //alert(makeThing.name);
	       arrayBrgy.push(id_name);
	       //alert(something[0].name);
	       			idToString = doc.id.toString();
	       			//window.alert(yes);
					var optionBrgy = document.createElement("Option");
						txtBrgy = document.createTextNode(doc.get("name"));
						

						optionBrgy.appendChild(txtBrgy);
						selectBrgy.insertBefore(optionBrgy, selectBrgy.lastChild);
						        	
	    });
	    	
	});
	
var selectedID;
function newPost(){
	var date = new Date(); // gets current date and time
	var user = firebase.auth().currentUser; //user constant
	var uidGet = user.uid; //takes unique ID
	var dscrtpn = document.getElementById("desc").value; //post description input
	var slctdBrgy = selectBrgy.options[selectBrgy.selectedIndex].text; //stores selected barangay NAME from dropdown
	var slctdIssue = selectIssue.options[selectBrgy.selectedIndex].text; //stores selected issue from dropdown				

	var checkbox = document.getElementById("anon");
	var checkMetadata = {};
	if(checkbox.checked == true){
		checkbox = true;
	}
	else {
		checkbox = false;
	}

	if(dscrtpn =="" && slctdBrgy == "Barangay" && slctdIssue == "Type of Issue"){
		bootbox.alert({
		    title: "BarangayAide",
		    message: "Please input required fields!"
		});
	}
	else{
		var brgyID = function(brgyName){

		arrayBrgy.forEach(function(idToString){
		
			if(idToString.name == brgyName){
				selectedID = idToString.id;
				//alert("working pls");
				//alert(selectedID);
				//return yes.id;
			}


		});
	
	}

	brgyID(slctdBrgy);
	



		db.collection("posts").doc().set({
		accepted: false,
		description: dscrtpn,
		datetime: date,
		anonymous: checkbox,
		status: "Ongoing", 
		barangayName: slctdBrgy,
		barangayID: selectedID,
		issue: slctdIssue,
		userID: uidGet,
		images: URLimg,
		rejected: false
	    
		})
		.then(function() {
		    console.log("Post added!");
		    $(function () {
                  bootbox.alert({
                  title: "BarangayAide",
                    message: "Success! Please wait for your post to be approved.",
                  callback: function () { location.reload(true); }
              });
            })
		})
		.catch(function(error) {
		    console.error("Error posting: ", error);
		});


	}
	//window.alert(slctdBrgy);

	//window.alert(something[0].name);
	

}



/*-------------------------feed----------------------------*/




 


function addComment(postID){

	var date = new Date(); // gets current date and time
	var user = firebase.auth().currentUser; //user constant
	var uidGet = user.uid; //takes unique ID
	var cmmt = document.getElementById("comment").value; //post description input
	if(cmmt ==""){
		bootbox.alert({
			title: "BarangayAide",
			message: "Comments can't be blank!",
		})
	}
		else{
			db.collection("feedback").doc().set({
		comment: cmmt,
		datetime: date,
		userID: uidGet,
		commented: true,
		postID: postID
		})
		.then(function() {
		    console.log("Comment added");
		    location.reload();
		   
		})
		.catch(function(error) {
		    console.error("Error posting: ", error);
		});
		}
		


}


function likePost(postID){
	var user = firebase.auth().currentUser; //user constant
	var uidGet = user.uid; 
	var liked = document.getElementById("liked");

	db.collection("feedback").where("postID", "==", postID).where("userID", "==", uidGet)
	.where("like", "==", true).get().then(function(querySnapshot) {
		if (querySnapshot.empty){
	
			liked.value = " Unlike"
			
			
			db.collection("feedback").doc().set({
				postID: postID,
				userID: uidGet,
				like: true
		
			})
			.then(function() {
				console.log("Like added");

			   
			})
			.catch(function(error) {
				console.error("Error posting: ", error);
			});
			

		}else{
			querySnapshot.forEach(function(doc) {
				var feedbackPostID = doc.data().postID;
				db.collection("feedback").doc(doc.id).delete()
				console.log("Unliked");
				liked.value = "👍 Like"
			 });
		
		
		}
	});

	
	
}

/*-------------------------feed----------------------------*/


/*


*/

/*var postOwner = db.collection("users").doc(doc.data().userID);

					postOwner.get().then(function(doc) {
					    if (doc.exists) {
					    	var yes = doc.data().name;
					    	
					       console.log("Document data:", yes);
					    } else {
					        // doc.data() will be undefined in this case
					        console.log("No such document!");
					    }

					window.yes = doc.data().name;
 	
	}).catch(function(error) {
	console.log("Error getting document:", error);
});*/






//location
/*function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    console.log("Geolocation is not supported by this browser.");
  }
}
	var lat;
		 var long;

	
function showPosition(position) {
	 

	return {
       	lat: position.coords.latitude,
        long: position.coords.longitude
    }
	//console.log(position.coords.latitude);
	//console.log(position.coords.longitude);
  
}*/








/*const dispUser = document.querySelector("#dispUser");

db.collection("users").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());

        dispUser.innerHTML += "<h2 class='myfont'>" +doc.data().fname+ " " +doc.data().lname+ "</h2>"
    });
});*/



//--------------------------------------------------------------------------------------------

function filterFeed(sortBrgy,sortIssue,sortStatus){
 	var sortBrgy = filterBrgy.options[filterBrgy.selectedIndex].text;
 	var sortIssue = filterIssue.options[filterIssue.selectedIndex].text;
 	var filterStatus = document.getElementById("filter_status");
	var sortStatus = filter_status.options[filter_status.selectedIndex].text;
	//var x = filterStatus.value;
 	//var sortStatus = filterStatus.options[filterStatus.selectedIndex].text;

 	//	SORTED BY ALL
 	if(sortBrgy == "Barangay" && sortIssue == "Issue" && sortStatus == "Status"){
	 		db.collection("posts").where("accepted", "==", true).orderBy("datetime","desc")
		    .get()
		    .then(function(querySnapshot) {
		        querySnapshot.forEach(function(doc) {

		            console.log(doc.id, " => ", doc.data().description);
		            	var datef = doc.data().datetime;
			            const actualDate = datef.toDate();
			            var noTZ = actualDate.toLocaleString();
			            var yesdate = noTZ.toString();

			db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){querySnapshot1.data().name
				var name = querySnapshot1.get("name");

			dispFeed.innerHTML += 
			"<div class='row'>"+
				"<div class='card' style='width:100%;'>"+

					"<div class='card-body cardo'>"+
						"<p>by <strong>"+name+"</strong></p>"+
						"<p class='card-text'>" +noTZ+ " | <strong>" +doc.data().issue+ "</strong> | <strong>" +doc.data().barangayName+  "</strong></p>"+
						"<p class='card-text'>" +doc.data().description+ "</p><img src='"+doc.data().images+ "' class='card-img'>"+
					"</div>"+

					"<div class='card-footer cardo' >"+
						"<div class='row'>"+
							"<div class='col-lg-6'>"+
								"<button class='btn btn-block' onclick='likePost()'><span class='lnr lnr-thumbs-up'></span>Like</button>"+
							"</div>"+
							"<div class='col-lg-6'>"+
								"<button class='btn btn-block' onclick='toggleCmnts()' id='showCmnts'>Comment</button>"+
							"</div>"+
						"</div>"+
						"&nbsp;"+

						"<div class='row'>"+
							"<div class='col-lg-11'>"+
								"<input type='text' id='comment' style='width:100%;' placeholder='Write a comment...'>"+
								//cmntBox.cmntBox();
							"</div>"+
							"<div class='col-lg-1'>"+
								"<button type='button' onclick='addComment()'><i class='fas fa-play'></i></button>"+
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
 	//	SORTED BY BARANGAYS ONLY
 	else if(sortBrgy != "Barangay" && sortIssue == "Issue" && sortStatus == "Status"){
		
 		db.collection("posts").where("accepted","==",true).where("barangayName","==",sortBrgy).orderBy("datetime","desc")
		    .get()
		    .then(function(querySnapshot) {
		        querySnapshot.forEach(function(doc) {
		            // doc.data() is never undefined for query doc snapshots
					console.log("BARANGAY ONLY "+doc.id, " => ", doc.data().barangayName);
					var datef = doc.data().datetime;
					const actualDate = datef.toDate();
					var noTZ = actualDate.toLocaleString();
					var yesdate = noTZ.toString();


		db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){querySnapshot1.data().name
			var name = querySnapshot1.get("name");

			
		dispFeed.innerHTML += 
		"<div class='row' id='forCmnts'>"+
			"<div class='card' style='width:100%;'>"+

				"<div class='card-body cardo'>"+
					"<p>by <strong>"+name+"</strong></p>"+
					"<p class='card-text'>" +noTZ+ " | <strong>" +doc.data().issue+ "</strong> | <strong>" +doc.data().barangayName+  "</strong></p>"+
					"<p class='card-text'>" +doc.data().description+ "</p><img src='"+doc.data().images+ "' class='card-img'>"+
				"</div>"+

				"<div class='card-footer cardo' >"+
					"<div class='row'>"+
						"<div class='col-lg-6'>"+
							"<button class='btn btn-block' onclick='likePost()'><span class='lnr lnr-thumbs-up'></span>Like</button>"+
						"</div>"+
						"<div class='col-lg-6'>"+
							"<button class='btn btn-block' onclick='toggleCmnts()' id='showCmnts'>Comment</button>"+
						"</div>"+
					"</div>"+
					"&nbsp;"+

					"<div class='row'>"+
						"<div class='col-lg-11'>"+
							"<input type='text' id='comment' style='width:100%;' placeholder='Write a comment...'>"+
							//cmntBox.cmntBox();
						"</div>"+
						"<div class='col-lg-1'>"+
							"<button type='button' onclick='addComment()'><i class='fas fa-play'></i></button>"+
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
 	//	SORTED BY ISSUES ONLY
 	else if(sortBrgy == "Barangay" && sortIssue != "Issue" && sortStatus == "Status"){
 		db.collection("posts").where("accepted","==",true).where("issue","==",sortIssue).orderBy("datetime","desc")
		    .get()
		    .then(function(querySnapshot) {
		        querySnapshot.forEach(function(doc) {
		            // doc.data() is never undefined for query doc snapshots
		            console.log("ISSUE ONLY "+doc.id, " => ", doc.data().issue);
		        });
		    })
		    .catch(function(error) {
		        console.log("Error getting documents: ", error);
		    });
 	}
 	//	SORTED BY STATUS ONLY
 	else if(sortBrgy == "Barangay" && sortIssue == "Issue" && sortStatus !="Status"){
 		
 		db.collection("posts").where("accepted", "==", true).where("status","==",sortStatus).orderBy("datetime","desc")
		    .get()
		    .then(function(querySnapshot) {
		        querySnapshot.forEach(function(doc) {
		            // doc.data() is never undefined for query doc snapshots
		            console.log("STATUS ONLY "+doc.id, " => ", doc.data().status);
		        });
		    })
		    .catch(function(error) {
		        console.log("Error getting documents: ", error);
		    });
 	}
 		//sortBrgy == "Barangay" && (sortIssue == "Vandalism" || "Garbage" || "Pollution") && (sortStatus == "Ongoing" || "Resolved")
 		//	SORTED BY ISSUE AND STATUS
 	else if(sortBrgy == "Barangay" && sortIssue != "Issue" && sortStatus != "Status"){
 		
 		db.collection("posts").where("accepted", "==", true).where("issue","==",sortIssue).where("status","==",sortStatus).orderBy("datetime","desc")
		    .get()
		    .then(function(querySnapshot) {
		        querySnapshot.forEach(function(doc) {
		            // doc.data() is never undefined for query doc snapshots
		            console.log("ISSUE and STATUS " + doc.id, " => ", doc.data().issue, " => ",doc.data().status );
		            var datef = doc.data().datetime;
			            const actualDate = datef.toDate();
			            var noTZ = actualDate.toLocaleString();
			            var yesdate = noTZ.toString();


			db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){querySnapshot1.data().name
				var name = querySnapshot1.get("name");

				
			dispFeed.innerHTML += 
			"<div class='row' id='forCmnts'>"+
				"<div class='card' style='width:100%;'>"+

					"<div class='card-body cardo'>"+
						"<p>by <strong>"+name+"</strong></p>"+
						"<p class='card-text'>" +noTZ+ " | <strong>" +doc.data().issue+ "</strong> | <strong>" +doc.data().barangayName+  "</strong></p>"+
						"<p class='card-text'>" +doc.data().description+ "</p><img src='"+doc.data().images+ "' class='card-img'>"+
					"</div>"+

					"<div class='card-footer cardo' >"+
						"<div class='row'>"+
							"<div class='col-lg-6'>"+
								"<button class='btn btn-block' onclick='likePost()'><span class='lnr lnr-thumbs-up'></span>Like</button>"+
							"</div>"+
							"<div class='col-lg-6'>"+
								"<button class='btn btn-block' onclick='toggleCmnts()' id='showCmnts'>Comment</button>"+
							"</div>"+
						"</div>"+
						"&nbsp;"+

						"<div class='row'>"+
							"<div class='col-lg-11'>"+
								"<input type='text' id='comment' style='width:100%;' placeholder='Write a comment...'>"+
								//cmntBox.cmntBox();
							"</div>"+
							"<div class='col-lg-1'>"+
								"<button type='button' onclick='addComment()'><i class='fas fa-play'></i></button>"+
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
 	//	SORTED BY BARANGAY AND STATUS
 	else if(sortBrgy != "Barangay" && sortIssue == "Issue" && sortStatus != "Status"){
 		
 		db.collection("posts").where("accepted", "==", true).where("barangayName","==",sortBrgy).where("status","==",sortStatus).orderBy("datetime","desc")
		    .get()
		    .then(function(querySnapshot) {
		        querySnapshot.forEach(function(doc) {
		            // doc.data() is never undefined for query doc snapshots
		            console.log("BARANGAY and STATUS " + doc.id, " => ", doc.data().barangayName, " => ",doc.data().status );
		        });
		    })
		    .catch(function(error) {
		        console.log("Error getting documents: ", error);
		    });
 	}
 	//	SORTED BY BARANGAY AND ISSUE
 	else if(sortBrgy != "Barangay" && sortIssue != "Issue" && sortStatus == "Status"){
 		
 		db.collection("posts").where("accepted", "==", true).where("barangayName","==",sortBrgy).where("issue","==",sortIssue).orderBy("datetime","desc")
		    .get()
		    .then(function(querySnapshot) {
		        querySnapshot.forEach(function(doc) {
		            // doc.data() is never undefined for query doc snapshots
		            console.log("ISSUE and STATUS " + doc.id, " => ", doc.data().barangayName, " => ",doc.data().issue );
		        });
		    })
		    .catch(function(error) {
		        console.log("Error getting documents: ", error);
		    });
 	}
 	// SORTED BY BARANGAY, ISSUE AND STATUS
 	else if(sortBrgy != "Barangay" && sortIssue != "Issue" && sortStatus != "Status"){
 		
 		db.collection("posts").where("accepted", "==", true).where("issue","==",sortIssue).where("barangayName","==",sortBrgy).where("status","==",sortStatus).orderBy("datetime","desc")
		    .get()
		    .then(function(querySnapshot) {
		        querySnapshot.forEach(function(doc) {
		            // doc.data() is never undefined for query doc snapshots
		            console.log("ISSUE, BARANGAY and STATUS " + doc.id, " => ", doc.data().issue, " => ",doc.data().barangayName, " => ",doc.data().status );
		        });
		    })
		    .catch(function(error) {
		        console.log("Error getting documents: ", error);
		    });
 	}

 	
 }