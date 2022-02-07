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

//display name in feed
const dispUser = document.querySelector("#dispUser");
const pending = document.querySelector("#pending");

firebase.auth().onAuthStateChanged(firebaseUser=> {
		if(firebaseUser){
			var email_verified = firebaseUser.emailVerified;
			console.log(email_verified);
			//console.log(firebaseUser.uid);
			//console.log(firebaseUser); //logs CURRENTLY logged in user data
			//console.log('Currently logged in as: ', firebaseUser.email);

db.collection("posts").where("accepted","==",false).where("userID", "==", firebaseUser.uid).orderBy("datetime","desc")
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
        	pending.innerHTML += 

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
								"<button type='button' class='btn btn-block' onclick='deletePost(\""+doc.id+"\")'><i class='bi bi-trash'></i> Delete</button>"+
							"</div>"+
							"<div class='col-lg-6'>"+
								 "<button type='button' id='resetBtn' class='btn btn-block' onclick='editPost(\""+doc.id+"\")' data-toggle='modal' data-target='#editPostModal'><i class='bi bi-pen'></i> Edit</button>"+
							"</div>"+
						"</div>"+
						"&nbsp;"+

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
		      	dispUser.innerHTML += "<h4 class='myfont'>" +doc.data().fname+" "+doc.data().lname+  "</h4>" // displays name when logged in
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


function deletePost(postID){

bootbox.confirm({
          title: "BarangayAide",
          message: "Are you sure you want to delete this post?",
          buttons: {
              cancel: {
                  label: '<i class="fa fa-times"></i> Cancel'

              },
              confirm: {
                  label: '<i class="fa fa-check"></i> Confirm'
              }
          },
          callback: function (result) {
            
             if(result != false){
              	db.collection("posts").doc(postID).delete();
			      console.log("deleted");
			      $(function () {
			            bootbox.alert({
			            title: "BarangayAide",
			            message: "Successfully deleted post.",
			            callback: function () { location.reload(true); }
			        });
			    })

             }

             else{
              $('.bootbox.modal').modal('hide')
             }

          }

      });     

    }

    

var selectBrgy;
var selectIssue;

 
var URLimg;
function editPost(postID){

    

    const editDetails = document.querySelector("#editPost");
    const modalBtns = document.querySelector("#modal_btns");
   
   
      var postDtls = db.collection("posts").doc(postID);
      
    postDtls.get().then(function(doc) {
        if (doc.exists) {

            //console.log("Document data:", doc.data());
            editDetails.innerHTML += 
            "<div class='form-group'>"+
                       "<div class='col-xs-6 m-1' >"+
                            "<select id='resIssue' class='form-control'>"+
                               "<option selected='selected'>"+doc.data().issue+"</option>"+
                              
                            "</select>"+
                        "</div>"+
                        "<div class='col-xs-6 m-1' >"+
                            "<select id='resBrgy' class='form-control'>"+
                                "<option selected='selected'>"+doc.data().barangayName+"</option>"+
                              
                            "</select>"+
                          "</div>"+

                          "<div class='form-group'>"+
                           " <label for='exampleFormControlTextarea1'>Report description:</label>"+
                            "<textarea class='form-control reportdesc' id='updPost' rows='3' cols='30'>"+doc.data().description+"</textarea>"+

                          "</div>"+

                          "<div class='form-group'>"+                                  
                              "<div class='form-group' id='updimage'>"+
                                    "<input type='file' class='form-control-file' id='btnUpload'>"+
                                                      
                              "</div>"+
                            
                          "</div>"+
                 
                      "</div>"

                      var btnUpload = document.getElementById('btnUpload');
  btnUpload.addEventListener('change', function(e){
    var file1 = e.target.files[0];
    var storageRef1 = firebase.storage().ref('pictures/' + file1.name); 
    var task1 = storageRef1.put(file1);
    task1.on('state_changed',
      function progress1(snapshot){
        var progress1 = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        console.log("upload is " +progress1+ "% done");
      },
      function error1(err){
      },
      function url1(){
        task1.snapshot.ref.getDownloadURL().then(function(downloadURL){
           //window.URLimg1 = downloadURL1;    
           URLimg = downloadURL;
                
      });
      }
      );
  });




     selectBrgy = document.getElementById("resBrgy");

    db.collection("barangay").orderBy("name","asc").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc){
                    
          var optionBrgy = document.createElement("Option");
          txtBrgy = document.createTextNode(doc.get("name"));
          optionBrgy.appendChild(txtBrgy);
          selectBrgy.insertBefore(optionBrgy, selectBrgy.lastChild);

                      
        });
          
    });

 selectIssue = document.getElementById("resIssue");

db.collection("issues").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
              
        var optionIssue = document.createElement("Option");
          txtIssue = document.createTextNode(doc.get("name"));
          optionIssue.appendChild(txtIssue);
          selectIssue.insertBefore(optionIssue, selectIssue.lastChild);

      });
  });

          modalBtns.innerHTML +=
          "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>"+
          "<button type='button' onclick='updPost(\""+doc.id+"\")' class='btn btn-primary'>Save changes</button>"
          

          
        } 

        else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

$('#editPostModal').on('hidden.bs.modal', function () { 
    document.getElementById("editPost").innerHTML = "";
    document.getElementById("modal_btns").innerHTML ="";
    console.log("post");
});

}

function updPost(postID){
  var slctdBrgy = selectBrgy.options[selectBrgy.selectedIndex].text; //stores selected barangay NAME from dropdown
  console.log(slctdBrgy);
  var slctdIssue = selectIssue.options[selectIssue.selectedIndex].text; //stores selected issue from dropdown
    var updateDesc = document.getElementById("updPost").value;
    var updateDocRef = db.collection("posts").doc(postID); 

    db.collection("barangay").where("name", "==", slctdBrgy)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          var brgyID = doc.id;
          if(URLimg == null){
           updateDocRef.update({
                 description: updateDesc,
                 barangayName: slctdBrgy,
                 barangayID: brgyID,
                 issue: slctdIssue
               })

             .then(function() {
                 console.log("Document successfully updated!");
             });
          }
          else{
            updateDocRef.update({
                 description: updateDesc,
                 barangayName: slctdBrgy,
                 barangayID: brgyID,
                 issue: slctdIssue,
                 images: URLimg
               })

             .then(function() {
                 console.log("Document successfully updated!");
             });

          }

        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    

    $(function () {
        bootbox.alert({
        message: "Updated successfully!",
        callback: function () { location.reload(true); }
      });
    })
}



