console.log("js for brgyfeed.html");

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

  const dispUser = document.querySelector("#dispUser");
  const dispBrgy = document.querySelector("#barangay");
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
        if(doc.data().role == 2){
          //console.log("Document data:", doc.data());
            console.log('Logged in as: ', doc.data().email, '||', doc.data().name);      
            dispUser.innerHTML += "<h4 class='myfont py-3'>" +doc.data().fname+" "+doc.data().lname+  "</h4>" // displays name when logged in
            
            var brgyID = doc.data().barangayID;
            console.log(brgyID);
          db.collection("barangay").get().then(function(querySnapshot1){
            querySnapshot1.forEach(function(doc1){

              if(doc1.id == brgyID){
                dispBrgy.innerHTML += "<h6>Official - "+doc1.data().name+"</h6>"
              }
              
              });
            })
        }
          else if(doc.data().role == 1){
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



btnLogout.addEventListener('click', e =>{
    firebase.auth().signOut(); //signs out current user
    window.location.href = "../../index.html";

    
  });

  var URLimg = "https://firebasestorage.googleapis.com/v0/b/kotlintry-f6729.appspot.com/o/ImageFolder%2Fimage%2Fdownload.png?alt=media&token=7309790a-7384-4e18-9152-2672ba9f1323";
var URLimg1 = "https://firebasestorage.googleapis.com/v0/b/kotlintry-f6729.appspot.com/o/ImageFolder%2Fimage%2Fdownload.png?alt=media&token=7309790a-7384-4e18-9152-2672ba9f1323";

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

  var btnUpload1 = document.getElementById('btnUpload1');
  btnUpload1.addEventListener('change', function(e){
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
        task1.snapshot.ref.getDownloadURL().then(function(downloadURL1){
           window.URLimg1 = downloadURL1;          
      });
      }
      );
  });


$( "#down" ).click(function() {
  $( ".showing" ).toggle();
});

  





  var db = firebase.firestore(); //firestore constant
  //const auth = firebase.auth(); //auth constant
  var dispUsers = document.querySelector("#usersTbl");
 
 
  function newAnncmnt(){

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {

    
     db.collection("users").where("uid", "==", user.uid)
    .get()
    .then(function(querySnapshot) {/*yeet*/
        querySnapshot.forEach(function(doc) {
            
            //console.log(doc.id, " => ", doc.data().name, " => ", doc.data().barangayID);
            var brgyID = doc.data().barangayID;

            //console.log(brgyID);
            var date = new Date(); // gets current date and time
    var user = firebase.auth().currentUser; //user constant
    var uidGet = user.uid; //takes unique ID
    var anncmnt = document.getElementById("announce").value; //post announcment input
    if(anncmnt == ""){
      bootbox.alert({
          title: "BarangayAide",
          message: "Please enter Announcement description!"
          
      });
    }

    
    else{
    var brgyID = doc.data().barangayID;
    db.collection("barangay").get().then(function(querySnapshot1){
      querySnapshot1.forEach(function(doc1){
        if(doc1.id == brgyID){
          var brgyName = doc1.data().name;
          db.collection("posts").doc().set({
          accepted: true,
          barangayID: brgyID,
          barangayName: brgyName,
          datetime: date,
          description: anncmnt,
          images: URLimg1,                  
          issue: "Announcement",
          pinned: false,
          userID: uidGet
          
          

        });
        }
    
  });
    })
    .then(function() {
        console.log("Announcement added!");
        $(function () {
            bootbox.alert({
            title: "BarangayAide",
            message: "Successfully posted announcement.",
            callback: function () { location.reload(true); }
        });
      })
    })
    .catch(function(error) {
        console.error("Error posting: ", error);
    });
    }
    /*;alskdjf;lakjsdf*/

    });
       
    })/*yeet*/
    .catch(function(error) {/*sdfgsdfg*/
        console.log("Error getting documents: ", error);
    });/*sdfgsdfg*/
    

    } else {
      // User not logged in or has just logged out.
      location.href ="../../index.html";
    }
    
});


  }





  var selectIssue = document.getElementById("issuedd");

  db.collection("issues").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {   

          var optionIssue = document.createElement("Option");
            txtIssue = document.createTextNode(doc.get("name"));
            optionIssue.appendChild(txtIssue);
            selectIssue.insertBefore(optionIssue, selectIssue.lastChild);

      });
  });



  




function newPost(){
  var brgyIDpost;
  var date = new Date(); // gets current date and time
  var user = firebase.auth().currentUser; //user constant
  var uidGet = user.uid; //takes unique ID
  var dscrtpn = document.getElementById("desc").value; //post description input
  var slctdIssue = selectIssue.options[selectIssue.selectedIndex].text; //stores selected issue from dropdown
 


    if(dscrtpn =="" && slctdIssue == "Type of Issue"){
    bootbox.alert({
        title: "BarangayAide",
        message: "Please input required fields!"
    });
  }
  else{
    db.collection("users").where("uid","==",uidGet).get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        var brgyID = doc.data().barangayID;
        var barangay = doc.data().barangay;

        db.collection("posts").doc().set({
          accepted: true,
          description: dscrtpn,
          datetime: date,
          status: "Ongoing",
          barangayID: brgyID, 
          barangayName: barangay,   
          issue: slctdIssue,
          userID: uidGet,
          pinned: false,
          images: URLimg,
            
        })
        .then(function() {
            console.log("Post added!");
            $(function () {
                      bootbox.alert({
                      title: "BarangayAide",
                        message: "Complaint posted.",
                      callback: function () { location.reload(true); }
                  });
                })
        })
        .catch(function(error) {
            console.error("Error posting: ", error);
            bootbox.alert(error);
        })

      });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        bootbox.alert(error);
    });     

  }


}

function likebtn(postID){
  document.getElementById("divLiked"+postID).innerHTML ="";
}



function likeStatus(postID){
  var user = firebase.auth().currentUser; //user constant
  var uidGet = user.uid; 
  var liked = document.getElementById("liked"+postID);
  var divLiked = document.getElementById("divLiked"+postID)

  db.collection("feedback").where("postID", "==", postID).where("userID", "==", uidGet)
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
              likebtn(postID);
               document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up-fill'></i></button>";
            }
            
            if (change.type === "removed") {
              likebtn(postID);
                document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>";
            }
        });
    });
}


function likePost(postID){
  var user = firebase.auth().currentUser; //user constant
  var uidGet = user.uid; 
  var liked = document.getElementById("liked"+postID);
  var divLiked = document.getElementById("divLiked"+postID)

  likeStatus(postID)

  db.collection("feedback").where("postID", "==", postID).where("userID", "==", uidGet)
  .where("like", "==", true).get().then(function(querySnapshot) {
    if (querySnapshot.empty){
  
    
      //document.querySelector("liked"+postID).textContent = '<i class="bi bi-hand-thumbs-up-fill"></i>';
      likebtn(postID);
      //document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up-fill'></i></button>";
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
      likebtn(postID);
      //document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>";
      querySnapshot.forEach(function(doc) {
        var feedbackPostID = doc.data().postID;
        db.collection("feedback").doc(doc.id).delete()
        console.log("Unliked");
       
       });
    
    
    }
  });
  
}


function addComment(postID){
  var date = new Date(); // gets current date and time
  var user = firebase.auth().currentUser; //user constant
  var uidGet = user.uid; //takes unique ID

  var cmmt = document.getElementById("comment"+postID).value; //post description input
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
       
       
    })
    .catch(function(error) {
        console.error("Error posting: ", error);
    });
    }
    clearCommentBox(postID);
    
}

function clearCommentBox(postID){
  document.getElementById("comment"+postID).value ="";
}

function comments(postID){
  const cmmtData = document.querySelector("#cmmts_"+postID);
  

  var docRef = db.collection("posts").doc(postID);

    docRef.get().then(function(doc) {
        if (doc.exists) {
          
          var post = doc.id


          db.collection("feedback").where("postID", "==", post).where("commented","==", true).orderBy("datetime","asc")
              .onSnapshot(function(querySnapshot) {
                  
                  
                  var datetime = [];
                  var comments = [];


                  querySnapshot.forEach(function(doc) {
                     comments.push(doc.data().comment);
                     datetime.push(doc.data().datetime);
                     clearcmmts(postID);
                     db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
                       
                          var fname = querySnapshot1.get("fname");
                          var lname = querySnapshot1.get("lname");
                          var datef = doc.data().datetime;
                          const actualDate = datef.toDate();
                          var noTZ = actualDate.toLocaleString();
                         
                         cmmtData.innerHTML += 

                     "<div class='row mb-1'>"+
                       "<div class='col-md-12'>"+
                         "<p> <h6>"+fname+" "+lname+"</h6> "+noTZ+"</p>"+

                         "<label>"+doc.data().comment+"</label>"+
                       "</div>"+                   
                     "</div>"+
                     "<hr>"

                     });

                  });
                  
              });

         
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    
}

function clearcmmts(postID){
  
  document.getElementById("cmmts_"+postID).innerHTML = "";

}



const dispFeed = document.querySelector("#feed");
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

  db.collection("barangay").orderBy("name","asc").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
                
          var brgy_F = document.createElement("Option");
            txtBrgy_F = document.createTextNode(doc.get("name"));
            brgy_F.appendChild(txtBrgy_F);
            filterBrgy.insertBefore(brgy_F, filterBrgy.lastChild);  
      });
  });
/*============================Barangay Filter================================*/

var sortBrgy = filterBrgy.options[filterBrgy.selectedIndex].text;
  var sortIssue = filterIssue.options[filterIssue.selectedIndex].text;
  var filterStatus = document.getElementById("filter_status");
  var sortStatus = filter_status.options[filter_status.selectedIndex].text;
  var x = filterStatus.value;
  var sortStatus = filterStatus.options[filterStatus.selectedIndex].text;

  filterFeed(sortBrgy, sortIssue, sortStatus)
document.getElementById("filter").onclick = function() { filterFeed(sortBrgy, sortIssue, sortStatus)};


function clearFeed(){
  document.getElementById("feed").innerHTML = "";
}

//--------------------------------------------------------------------------------------------

function filterFeed(sortBrgy, sortIssue, sortStatus){
   sortBrgy = filterBrgy.options[filterBrgy.selectedIndex].text;
   sortIssue = filterIssue.options[filterIssue.selectedIndex].text;
  var filterStatus = document.getElementById("filter_status");
   sortStatus = filter_status.options[filter_status.selectedIndex].text;
   x = filterStatus.value;
  sortStatus = filterStatus.options[filterStatus.selectedIndex].text;
  


  if(sortBrgy == "Barangay" && sortIssue == "Issue" && sortStatus == "Status"){
    firebase.auth().onAuthStateChanged((user) => {
  	var docRef = db.collection("users").doc(user.uid);
		docRef.get().then(function(doc) {

		    var default_brgy = doc.data().barangay;

		    db.collection("posts").where("accepted", "==", true).where("barangayName","==",default_brgy).orderBy("pinned","desc").orderBy("datetime","desc")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {

                //console.log(doc.id, " ALL ", doc.data().description);
                  var datef = doc.data().datetime;
                  const actualDate = datef.toDate();
                  var noTZ = actualDate.toLocaleString();
                  var yesdate = noTZ.toString();
                  var postID = doc.id;
                  var images = doc.data().images;
                  var issue = doc.data().issue;
                  var desc = doc.data().description;
                  var barangay = doc.data().barangayName;
                  var user = firebase.auth().currentUser; //user constant
                  var uidGet = user.uid; 

                  var number = 0;
                  var x = number++;

      db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
        var fname = querySnapshot1.get("fname");
        var lname = querySnapshot1.get("lname");

        db.collection("feedback").where("postID", "==", postID).where("userID", "==", uidGet)
              .where("like", "==", true).get().then(function(querySnapshot) {
                  
                dispFeed.innerHTML += 
      "<div class='row'>"+
        "<div class='card' style='width:100%;'>"+

          "<div class='card-body cardo'>"+
            "<p>by <strong>"+fname+" "+lname+"</strong></p>"+
            "<p class='card-text'>" +noTZ+ " | <strong>" +issue+ "</strong> | <strong>" +barangay+  "</strong></p>"+
            "<p class='card-text'>" +desc+ "</p><img src='"+images+"' class='card-img'>"+
          "</div>"+


          "<div class='card-footer cardo' >"+
            "<div class='row'>"+
              "<div class='col-lg-6' id='divLiked"+postID+"'>"+
                "<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>"+
               
              "</div>"+
              "<div class='col-lg-6'>"+
                "<button class='btn btn-block' type='button' onclick='comments(\""+postID+"\"); clearcmmts(\""+postID+"\");' data-toggle='collapse' data-target='#collapseExample"+postID+"' aria-expanded='false' aria-controls='collapseExample'><i class='bi bi-chat-right-text'></i></button>"+
              "</div>"+
            "</div>"+
            "&nbsp;"+
            "<div class='collapse' id='collapseExample"+postID+"'>"+
              "<div class='card card-body'>"+
                "<div id='cmmts_"+postID+"'>"+

                "</div>"+
             " </div>"+
            "</div>"+


            "<div class='row mb-2'>"+
              "<div class='col-lg-12 input-group input-group px-3 mb-1'>"+
                
               
              "<input type='text' id='comment"+postID+"' class='form-control' commentID="+postID+" placeholder='Write a comment...' aria-label='Comment' aria-describedby='basic-addon2'>"+
              "<div class='input-group-append'>"+
                "<button class='btn btn-outline-info commentBtn' onclick='addComment(\""+postID+"\")' type='button'><span class='lnr lnr-rocket'></span></button>"+
              "</div>"+
                
              "</div>"+
              
            "</div>"+
            
          "</div>"+ //card footer 
        "</div>"+   //card div
      "</div>&nbsp;"    //Row div

        db.collection("feedback").where("postID", "==", postID).where("userID", "==", uidGet)
          .where("like", "==", true).get().then(function(querySnapshot) {
            if (querySnapshot.empty){     
              
               document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>";
              

            }else{
              querySnapshot.forEach(function(doc) {
                  document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up-fill'></i></button>";
               }); 
            }
          })





        })


       
       

    

          });
            });


        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
      });




		}).catch(function(error) {
		    console.log("Error getting document:", error);
		});
	})
      clearFeed();
      
      
  }
  //  SORTED BY BARANGAYS ONLY
  if(sortBrgy != "Barangay" && sortIssue == "Issue" && sortStatus == "Status"){
    
    db.collection("posts").where("accepted","==",true).where("barangayName","==",sortBrgy).orderBy("datetime","desc")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {

                console.log(doc.id, " Barangay ", doc.data().description);
                  var datef = doc.data().datetime;
                  const actualDate = datef.toDate();
                  var noTZ = actualDate.toLocaleString();
                  var yesdate = noTZ.toString();
                  var postID = doc.id;
                  var images = doc.data().images;
                  var issue = doc.data().issue;
                  var desc = doc.data().description;
                  var barangay = doc.data().barangayName;
                  var user = firebase.auth().currentUser; //user constant
                  var uidGet = user.uid; 

                  var number = 0;
                  var x = number++;

      db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
        var fname = querySnapshot1.get("fname");
        var lname = querySnapshot1.get("lname");

        dispFeed.innerHTML += 
      "<div class='row'>"+
        "<div class='card' style='width:100%;'>"+

          "<div class='card-body cardo'>"+
            "<p>by <strong>"+fname+" "+lname+"</strong></p>"+
            "<p class='card-text'>" +noTZ+ " | <strong>" +issue+ "</strong> | <strong>" +barangay+  "</strong></p>"+
            "<p class='card-text'>" +desc+ "</p><img src='"+images+"' class='card-img'>"+
          "</div>"+


          "<div class='card-footer cardo' >"+
            "<div class='row'>"+
              "<div class='col-lg-6' id='divLiked"+postID+"'>"+
                "<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>"+
               
              "</div>"+
              "<div class='col-lg-6'>"+
                "<button class='btn btn-block' type='button' onclick='comments(\""+postID+"\"); clearcmmts(\""+postID+"\");' data-toggle='collapse' data-target='#collapseExample"+postID+"' aria-expanded='false' aria-controls='collapseExample'><i class='bi bi-chat-right-text'></i></button>"+
              "</div>"+
            "</div>"+
            "&nbsp;"+
            "<div class='collapse' id='collapseExample"+postID+"'>"+
              "<div class='card card-body'>"+
                "<div id='cmmts_"+postID+"'>"+

                "</div>"+
             " </div>"+
            "</div>"+


            "<div class='row mb-2'>"+
              "<div class='col-lg-12 input-group input-group px-3 mb-1'>"+
                
               
              "<input type='text' id='comment"+postID+"' class='form-control' commentID="+postID+" placeholder='Write a comment...' aria-label='Comment' aria-describedby='basic-addon2'>"+
              "<div class='input-group-append'>"+
                "<button class='btn btn-outline-info commentBtn' onclick='addComment(\""+postID+"\")' type='button'><span class='lnr lnr-rocket'></span></button>"+
              "</div>"+
                
              "</div>"+
              
            "</div>"+
            
          "</div>"+ //card footer 
        "</div>"+   //card div
      "</div>&nbsp;"    //Row div
      db.collection("feedback").where("postID", "==", postID).where("userID", "==", uidGet)
          .where("like", "==", true).get().then(function(querySnapshot) {
            if (querySnapshot.empty){     
              
               document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>";
              

            }else{
              querySnapshot.forEach(function(doc) {
                  document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up-fill'></i></button>";
               }); 
            }
          })

              

    

          });
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
      });
      clearFeed();
     
      
  }
  //  SORTED BY ISSUES ONLY
  if(sortBrgy == "Barangay" && sortIssue != "Issue" && sortStatus == "Status"){
    db.collection("posts").where("accepted","==",true).where("issue","==",sortIssue).orderBy("datetime","desc")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {

                console.log(doc.id, " Issue ", doc.data().description);
                  var datef = doc.data().datetime;
                  const actualDate = datef.toDate();
                  var noTZ = actualDate.toLocaleString();
                  var yesdate = noTZ.toString();
                  var postID = doc.id;
                  var images = doc.data().images;
                  var issue = doc.data().issue;
                  var desc = doc.data().description;
                  var barangay = doc.data().barangayName;
                  var user = firebase.auth().currentUser; //user constant
                  var uidGet = user.uid; 

                  var number = 0;
                  var x = number++;

      db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
        var fname = querySnapshot1.get("fname");
        var lname = querySnapshot1.get("lname");

        dispFeed.innerHTML += 
      "<div class='row'>"+
        "<div class='card' style='width:100%;'>"+

          "<div class='card-body cardo'>"+
            "<p>by <strong>"+fname+" "+lname+"</strong></p>"+
            "<p class='card-text'>" +noTZ+ " | <strong>" +issue+ "</strong> | <strong>" +barangay+  "</strong></p>"+
            "<p class='card-text'>" +desc+ "</p><img src='"+images+"' class='card-img'>"+
          "</div>"+


          "<div class='card-footer cardo' >"+
            "<div class='row'>"+
              "<div class='col-lg-6' id='divLiked"+postID+"'>"+
                "<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>"+
               
              "</div>"+
              "<div class='col-lg-6'>"+
                "<button class='btn btn-block' type='button' onclick='comments(\""+postID+"\"); clearcmmts(\""+postID+"\");' data-toggle='collapse' data-target='#collapseExample"+postID+"' aria-expanded='false' aria-controls='collapseExample'><i class='bi bi-chat-right-text'></i></button>"+
              "</div>"+
            "</div>"+
            "&nbsp;"+
            "<div class='collapse' id='collapseExample"+postID+"'>"+
              "<div class='card card-body'>"+
                "<div id='cmmts_"+postID+"'>"+

                "</div>"+
             " </div>"+
            "</div>"+


            "<div class='row mb-2'>"+
              "<div class='col-lg-12 input-group input-group px-3 mb-1'>"+
                
               
              "<input type='text' id='comment"+postID+"' class='form-control' commentID="+postID+" placeholder='Write a comment...' aria-label='Comment' aria-describedby='basic-addon2'>"+
              "<div class='input-group-append'>"+
                "<button class='btn btn-outline-info commentBtn' onclick='addComment(\""+postID+"\")' type='button'><span class='lnr lnr-rocket'></span></button>"+
              "</div>"+
                
              "</div>"+
              
            "</div>"+
            
          "</div>"+ //card footer 
        "</div>"+   //card div
      "</div>&nbsp;"    //Row div

      db.collection("feedback").where("postID", "==", postID).where("userID", "==", uidGet)
          .where("like", "==", true).get().then(function(querySnapshot) {
            if (querySnapshot.empty){     
              
               document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>";
              

            }else{
              querySnapshot.forEach(function(doc) {
                  document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up-fill'></i></button>";
               }); 
            }
          })

       

    

          });
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        clearFeed();
        clearcmmts();
  }
  //  SORTED BY STATUS ONLY
  if(sortBrgy == "Barangay" && sortIssue == "Issue" && sortStatus !="Status"){
    
    db.collection("posts").where("accepted", "==", true).where("status","==",sortStatus).orderBy("datetime","desc")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {

                console.log(doc.id, " Status ", doc.data().description);
                  var datef = doc.data().datetime;
                  const actualDate = datef.toDate();
                  var noTZ = actualDate.toLocaleString();
                  var yesdate = noTZ.toString();
                  var postID = doc.id;
                  var images = doc.data().images;
                  var issue = doc.data().issue;
                  var desc = doc.data().description;
                  var barangay = doc.data().barangayName;
                  var user = firebase.auth().currentUser; //user constant
                  var uidGet = user.uid; 

                  var number = 0;
                  var x = number++;

      db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
        var fname = querySnapshot1.get("fname");
        var lname = querySnapshot1.get("lname");

        dispFeed.innerHTML += 
      "<div class='row'>"+
        "<div class='card' style='width:100%;'>"+

          "<div class='card-body cardo'>"+
            "<p>by <strong>"+fname+" "+lname+"</strong></p>"+
            "<p class='card-text'>" +noTZ+ " | <strong>" +issue+ "</strong> | <strong>" +barangay+  "</strong></p>"+
            "<p class='card-text'>" +desc+ "</p><img src='"+images+"' class='card-img'>"+
          "</div>"+


          "<div class='card-footer cardo' >"+
            "<div class='row'>"+
              "<div class='col-lg-6' id='divLiked"+postID+"'>"+
                "<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>"+
               
              "</div>"+
              "<div class='col-lg-6'>"+
                "<button class='btn btn-block' type='button' onclick='comments(\""+postID+"\"); clearcmmts(\""+postID+"\");' data-toggle='collapse' data-target='#collapseExample"+postID+"' aria-expanded='false' aria-controls='collapseExample'><i class='bi bi-chat-right-text'></i></button>"+
              "</div>"+
            "</div>"+
            "&nbsp;"+
            "<div class='collapse' id='collapseExample"+postID+"'>"+
              "<div class='card card-body'>"+
                "<div id='cmmts_"+postID+"'>"+

                "</div>"+
             " </div>"+
            "</div>"+


            "<div class='row mb-2'>"+
              "<div class='col-lg-12 input-group input-group px-3 mb-1'>"+
                
               
              "<input type='text' id='comment"+postID+"' class='form-control' commentID="+postID+" placeholder='Write a comment...' aria-label='Comment' aria-describedby='basic-addon2'>"+
              "<div class='input-group-append'>"+
                "<button class='btn btn-outline-info commentBtn' onclick='addComment(\""+postID+"\")' type='button'><span class='lnr lnr-rocket'></span></button>"+
              "</div>"+
                
              "</div>"+
              
            "</div>"+
            
          "</div>"+ //card footer 
        "</div>"+   //card div
      "</div>&nbsp;"    //Row div


     db.collection("feedback").where("postID", "==", postID).where("userID", "==", uidGet)
          .where("like", "==", true).get().then(function(querySnapshot) {
            if (querySnapshot.empty){     
              
               document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>";
              

            }else{
              querySnapshot.forEach(function(doc) {
                  document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up-fill'></i></button>";
               }); 
            }
          })

       

    

          });
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        clearFeed();
        clearcmmts();
  }
    //sortBrgy == "Barangay" && (sortIssue == "Vandalism" || "Garbage" || "Pollution") && (sortStatus == "Ongoing" || "Resolved")
    //  SORTED BY ISSUE AND STATUS
  if(sortBrgy == "Barangay" && sortIssue != "Issue" && sortStatus != "Status"){
    
    db.collection("posts").where("accepted", "==", true).where("issue","==",sortIssue).where("status","==",sortStatus).orderBy("datetime","desc")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {

                console.log(doc.id, " Issue Status ", doc.data().description);
                  var datef = doc.data().datetime;
                  const actualDate = datef.toDate();
                  var noTZ = actualDate.toLocaleString();
                  var yesdate = noTZ.toString();
                  var postID = doc.id;
                  var images = doc.data().images;
                  var issue = doc.data().issue;
                  var desc = doc.data().description;
                  var barangay = doc.data().barangayName;
                  var user = firebase.auth().currentUser; //user constant
                  var uidGet = user.uid; 

                  var number = 0;
                  var x = number++;

      db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
        var fname = querySnapshot1.get("fname");
        var lname = querySnapshot1.get("lname");

      
       dispFeed.innerHTML += 
      "<div class='row'>"+
        "<div class='card' style='width:100%;'>"+

          "<div class='card-body cardo'>"+
            "<p>by <strong>"+fname+" "+lname+"</strong></p>"+
            "<p class='card-text'>" +noTZ+ " | <strong>" +issue+ "</strong> | <strong>" +barangay+  "</strong></p>"+
            "<p class='card-text'>" +desc+ "</p><img src='"+images+"' class='card-img'>"+
          "</div>"+


          "<div class='card-footer cardo' >"+
            "<div class='row'>"+
              "<div class='col-lg-6' id='divLiked"+postID+"'>"+
                "<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>"+
               
              "</div>"+
              "<div class='col-lg-6'>"+
                "<button class='btn btn-block' type='button' onclick='comments(\""+postID+"\"); clearcmmts(\""+postID+"\");' data-toggle='collapse' data-target='#collapseExample"+postID+"' aria-expanded='false' aria-controls='collapseExample'><i class='bi bi-chat-right-text'></i></button>"+
              "</div>"+
            "</div>"+
            "&nbsp;"+
            "<div class='collapse' id='collapseExample"+postID+"'>"+
              "<div class='card card-body'>"+
                "<div id='cmmts_"+postID+"'>"+

                "</div>"+
             " </div>"+
            "</div>"+


            "<div class='row mb-2'>"+
              "<div class='col-lg-12 input-group input-group px-3 mb-1'>"+
                
               
              "<input type='text' id='comment"+postID+"' class='form-control' commentID="+postID+" placeholder='Write a comment...' aria-label='Comment' aria-describedby='basic-addon2'>"+
              "<div class='input-group-append'>"+
                "<button class='btn btn-outline-info commentBtn' onclick='addComment(\""+postID+"\")' type='button'><span class='lnr lnr-rocket'></span></button>"+
              "</div>"+
                
              "</div>"+
              
            "</div>"+
            
          "</div>"+ //card footer 
        "</div>"+   //card div
      "</div>&nbsp;"    //Row div

      db.collection("feedback").where("postID", "==", postID).where("userID", "==", uidGet)
          .where("like", "==", true).get().then(function(querySnapshot) {
            if (querySnapshot.empty){     
              
               document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>";
              

            }else{
              querySnapshot.forEach(function(doc) {
                  document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up-fill'></i></button>";
               }); 
            }
          })


    

          });
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        clearFeed();
        clearcmmts();
  }
  //  SORTED BY BARANGAY AND STATUS
  if(sortBrgy != "Barangay" && sortIssue == "Issue" && sortStatus != "Status"){
    
    db.collection("posts").where("accepted", "==", true).where("barangayName","==",sortBrgy).where("status","==",sortStatus).orderBy("datetime","desc")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {

                console.log(doc.id, " Barangay Status ", doc.data().description);
                  var datef = doc.data().datetime;
                  const actualDate = datef.toDate();
                  var noTZ = actualDate.toLocaleString();
                  var yesdate = noTZ.toString();
                  var postID = doc.id;
                  var images = doc.data().images;
                  var issue = doc.data().issue;
                  var desc = doc.data().description;
                  var barangay = doc.data().barangayName;
                  var user = firebase.auth().currentUser; //user constant
                  var uidGet = user.uid; 

                  var number = 0;
                  var x = number++;

      db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
        var fname = querySnapshot1.get("fname");
        var lname = querySnapshot1.get("lname");

        
       dispFeed.innerHTML += 
      "<div class='row'>"+
        "<div class='card' style='width:100%;'>"+

          "<div class='card-body cardo'>"+
            "<p>by <strong>"+fname+" "+lname+"</strong></p>"+
            "<p class='card-text'>" +noTZ+ " | <strong>" +issue+ "</strong> | <strong>" +barangay+  "</strong></p>"+
            "<p class='card-text'>" +desc+ "</p><img src='"+images+"' class='card-img'>"+
          "</div>"+


          "<div class='card-footer cardo' >"+
            "<div class='row'>"+
              "<div class='col-lg-6' id='divLiked"+postID+"'>"+
                "<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>"+
               
              "</div>"+
              "<div class='col-lg-6'>"+
                "<button class='btn btn-block' type='button' onclick='comments(\""+postID+"\"); clearcmmts(\""+postID+"\");' data-toggle='collapse' data-target='#collapseExample"+postID+"' aria-expanded='false' aria-controls='collapseExample'><i class='bi bi-chat-right-text'></i></button>"+
              "</div>"+
            "</div>"+
            "&nbsp;"+
            "<div class='collapse' id='collapseExample"+postID+"'>"+
              "<div class='card card-body'>"+
                "<div id='cmmts_"+postID+"'>"+

                "</div>"+
             " </div>"+
            "</div>"+


            "<div class='row mb-2'>"+
              "<div class='col-lg-12 input-group input-group px-3 mb-1'>"+
                
               
              "<input type='text' id='comment"+postID+"' class='form-control' commentID="+postID+" placeholder='Write a comment...' aria-label='Comment' aria-describedby='basic-addon2'>"+
              "<div class='input-group-append'>"+
                "<button class='btn btn-outline-info commentBtn' onclick='addComment(\""+postID+"\")' type='button'><span class='lnr lnr-rocket'></span></button>"+
              "</div>"+
                
              "</div>"+
              
            "</div>"+
            
          "</div>"+ //card footer 
        "</div>"+   //card div
      "</div>&nbsp;"    //Row div

      db.collection("feedback").where("postID", "==", postID).where("userID", "==", uidGet)
          .where("like", "==", true).get().then(function(querySnapshot) {
            if (querySnapshot.empty){     
              
               document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>";
              

            }else{
              querySnapshot.forEach(function(doc) {
                  document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up-fill'></i></button>";
               }); 
            }
          })


    

          });
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        clearFeed();
        clearcmmts();
  }
  //  SORTED BY BARANGAY AND ISSUE
  if(sortBrgy != "Barangay" && sortIssue != "Issue" && sortStatus == "Status"){
    
    db.collection("posts").where("accepted", "==", true).where("barangayName","==",sortBrgy).where("issue","==",sortIssue).orderBy("datetime","desc")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {

                console.log(doc.id, " Barangay Issue ", doc.data().description);
                  var datef = doc.data().datetime;
                  const actualDate = datef.toDate();
                  var noTZ = actualDate.toLocaleString();
                  var yesdate = noTZ.toString();
                  var postID = doc.id;
                  var images = doc.data().images;
                  var issue = doc.data().issue;
                  var desc = doc.data().description;
                  var barangay = doc.data().barangayName;
                  var user = firebase.auth().currentUser; //user constant
                  var uidGet = user.uid; 

                  var number = 0;
                  var x = number++;

      db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
        var fname = querySnapshot1.get("fname");
        var lname = querySnapshot1.get("lname");

       dispFeed.innerHTML += 
      "<div class='row'>"+
        "<div class='card' style='width:100%;'>"+

          "<div class='card-body cardo'>"+
            "<p>by <strong>"+fname+" "+lname+"</strong></p>"+
            "<p class='card-text'>" +noTZ+ " | <strong>" +issue+ "</strong> | <strong>" +barangay+  "</strong></p>"+
            "<p class='card-text'>" +desc+ "</p><img src='"+images+"' class='card-img'>"+
          "</div>"+


          "<div class='card-footer cardo' >"+
            "<div class='row'>"+
              "<div class='col-lg-6' id='divLiked"+postID+"'>"+
                "<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>"+
               
              "</div>"+
              "<div class='col-lg-6'>"+
                "<button class='btn btn-block' type='button' onclick='comments(\""+postID+"\"); clearcmmts(\""+postID+"\");' data-toggle='collapse' data-target='#collapseExample"+postID+"' aria-expanded='false' aria-controls='collapseExample'><i class='bi bi-chat-right-text'></i></button>"+
              "</div>"+
            "</div>"+
            "&nbsp;"+
            "<div class='collapse' id='collapseExample"+postID+"'>"+
              "<div class='card card-body'>"+
                "<div id='cmmts_"+postID+"'>"+

                "</div>"+
             " </div>"+
            "</div>"+


            "<div class='row mb-2'>"+
              "<div class='col-lg-12 input-group input-group px-3 mb-1'>"+
                
               
              "<input type='text' id='comment"+postID+"' class='form-control' commentID="+postID+" placeholder='Write a comment...' aria-label='Comment' aria-describedby='basic-addon2'>"+
              "<div class='input-group-append'>"+
                "<button class='btn btn-outline-info commentBtn' onclick='addComment(\""+postID+"\")' type='button'><span class='lnr lnr-rocket'></span></button>"+
              "</div>"+
                
              "</div>"+
              
            "</div>"+
            
          "</div>"+ //card footer 
        "</div>"+   //card div
      "</div>&nbsp;"    //Row div

      db.collection("feedback").where("postID", "==", postID).where("userID", "==", uidGet)
          .where("like", "==", true).get().then(function(querySnapshot) {
            if (querySnapshot.empty){     
              
               document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>";
              

            }else{
              querySnapshot.forEach(function(doc) {
                  document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up-fill'></i></button>";
               }); 
            }
          })


          });
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        clearFeed();
        clearcmmts();
  }
  // SORTED BY BARANGAY, ISSUE AND STATUS
  if(sortBrgy != "Barangay" && sortIssue != "Issue" && sortStatus != "Status"){
    
    db.collection("posts").where("accepted", "==", true).where("issue","==",sortIssue).where("barangayName","==",sortBrgy).where("status","==",sortStatus).orderBy("datetime","desc")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {

                console.log(doc.id, " Barangay Issue Status ", doc.data().description);
                  var datef = doc.data().datetime;
                  const actualDate = datef.toDate();
                  var noTZ = actualDate.toLocaleString();
                  var yesdate = noTZ.toString();
                  var postID = doc.id;
                  var images = doc.data().images;
                  var issue = doc.data().issue;
                  var desc = doc.data().description;
                  var barangay = doc.data().barangayName;
                  var user = firebase.auth().currentUser; //user constant
                  var uidGet = user.uid; 

                  var number = 0;
                  var x = number++;

      db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
        var fname = querySnapshot1.get("fname");
        var lname = querySnapshot1.get("lname");

        dispFeed.innerHTML += 
      "<div class='row'>"+
        "<div class='card' style='width:100%;'>"+

          "<div class='card-body cardo'>"+
            "<p>by <strong>"+fname+" "+lname+"</strong></p>"+
            "<p class='card-text'>" +noTZ+ " | <strong>" +issue+ "</strong> | <strong>" +barangay+  "</strong></p>"+
            "<p class='card-text'>" +desc+ "</p><img src='"+images+"' class='card-img'>"+
          "</div>"+


          "<div class='card-footer cardo' >"+
            "<div class='row'>"+
              "<div class='col-lg-6' id='divLiked"+postID+"'>"+
                "<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>"+
               
              "</div>"+
              "<div class='col-lg-6'>"+
                "<button class='btn btn-block' type='button' onclick='comments(\""+postID+"\"); clearcmmts(\""+postID+"\");' data-toggle='collapse' data-target='#collapseExample"+postID+"' aria-expanded='false' aria-controls='collapseExample'><i class='bi bi-chat-right-text'></i></button>"+
              "</div>"+
            "</div>"+
            "&nbsp;"+
            "<div class='collapse' id='collapseExample"+postID+"'>"+
              "<div class='card card-body'>"+
                "<div id='cmmts_"+postID+"'>"+

                "</div>"+
             " </div>"+
            "</div>"+


            "<div class='row mb-2'>"+
              "<div class='col-lg-12 input-group input-group px-3 mb-1'>"+
                
               
              "<input type='text' id='comment"+postID+"' class='form-control' commentID="+postID+" placeholder='Write a comment...' aria-label='Comment' aria-describedby='basic-addon2'>"+
              "<div class='input-group-append'>"+
                "<button class='btn btn-outline-info commentBtn' onclick='addComment(\""+postID+"\")' type='button'><span class='lnr lnr-rocket'></span></button>"+
              "</div>"+
                
              "</div>"+
              
            "</div>"+
            
          "</div>"+ //card footer 
        "</div>"+   //card div
      "</div>&nbsp;"    //Row div

      db.collection("feedback").where("postID", "==", postID).where("userID", "==", uidGet)
          .where("like", "==", true).get().then(function(querySnapshot) {
            if (querySnapshot.empty){     
              
               document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>";
              

            }else{
              querySnapshot.forEach(function(doc) {
                  document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up-fill'></i></button>";
               }); 
            }
          })


    

          });
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        clearFeed();
        clearcmmts();
  }

  
 }

  function searchFunc(){
  clearFeed();
  var search = document.getElementById("search").value;

  db.collection("posts").where("description","==",search)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          var datef = doc.data().datetime;
                  const actualDate = datef.toDate();
                  var noTZ = actualDate.toLocaleString();
                  var yesdate = noTZ.toString();
                  var postID = doc.id;
                  var images = doc.data().images;
                  var issue = doc.data().issue;
                  var desc = doc.data().description;
                  var barangay = doc.data().barangayName;
                  var anon = doc.data().anonymous;
                  var user = firebase.auth().currentUser; //user constant
                  var uidGet = user.uid; 
                  var pinned = doc.data().pinned;
            db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
            if(anon == false || issue == "Announcement"){
          var fname = querySnapshot1.get("fname");
          var lname = querySnapshot1.get("lname");
        }
        else{
          var fname = "Anonymous"
          var lname = "person"
        }
        if(issue == "Announcement" && pinned == true){
          var append = "<i class='bi bi-pin-angle-fill'></i>";
        }
        else if(issue == "Announcement" && pinned == false){
          var append = "";
        }
        else{
          var append = doc.data().status;
        }

            dispFeed.innerHTML += 
      "<div class='row'>"+
        "<div class='card' style='width:100%;'>"+

          "<div class='card-body cardo'>"+
            "<p>by <strong>"+fname+" "+lname+"</strong></p>"+
            "<p class='card-text'>" +noTZ+ " || <strong>" +issue+ "</strong> || <strong>" +barangay+  "</strong> || <strong>" +append+  "</strong></p>" +
            "<p class='card-text'>" +desc+ "</p><img src='"+images+"' class='card-img'>"+
          "</div>"+


          "<div class='card-footer cardo' >"+
            "<div class='row'>"+
              "<div class='col-lg-6' id='divLiked"+postID+"'>"+
                "<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>"+
               
              "</div>"+
              "<div class='col-lg-6'>"+
                "<button class='btn btn-block' type='button' onclick='comments(\""+postID+"\"); clearcmmts(\""+postID+"\");' data-toggle='collapse' data-target='#collapseExample"+postID+"' aria-expanded='false' aria-controls='collapseExample'><i class='bi bi-chat-right-text'></i></button>"+
              "</div>"+
            "</div>"+
            "&nbsp;"+
            "<div class='collapse' id='collapseExample"+postID+"'>"+
              "<div class='card card-body'>"+
                "<div id='cmmts_"+postID+"'>"+

                "</div>"+
             " </div>"+
            "</div>"+


            "<div class='row mb-2'>"+
              "<div class='col-lg-12 input-group input-group px-3 mb-1'>"+
                
               
              "<input type='text' id='comment"+postID+"' class='form-control' commentID="+postID+" placeholder='Write a comment...' aria-label='Comment' aria-describedby='basic-addon2'>"+
              "<div class='input-group-append'>"+
                "<button class='btn btn-outline-info commentBtn' onclick='addComment(\""+postID+"\")' type='button'><span class='lnr lnr-rocket'></span></button>"+
              "</div>"+
                
              "</div>"+
              
            "</div>"+
            
          "</div>"+ //card footer 
        "</div>"+   //card div
      "</div>&nbsp;"    //Row div

      db.collection("feedback").where("postID", "==", postID).where("userID", "==", uidGet)
          .where("like", "==", true).get().then(function(querySnapshot) {
            if (querySnapshot.empty){     
              
               document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up'></i></button>";
              

            }else{
              querySnapshot.forEach(function(doc) {
                  document.getElementById("divLiked"+postID).innerHTML ="<button type='button' class='btn btn-block likeBtn' id='liked"+postID+"' onclick='likePost(\""+postID+"\")' likeID="+postID+" ><i class='bi bi-hand-thumbs-up-fill'></i></button>";
               }); 
            }
          })

        });
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

 }

 function resetFilter(){

  location.reload();
 }