console.log("announcemnts.html => anncmnts.js");

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

var db = firebase.firestore(); //firestore constant
  const auth = firebase.auth(); //auth constant
  

 firebase.auth().onAuthStateChanged(firebaseUser=> {
    const report_data = document.querySelector("#data1")
    if(firebaseUser){
        var email_verified = firebaseUser.emailVerified;
        console.log(email_verified);
     


    db.collection("users").where("uid", "==", firebaseUser.uid)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
            //console.log(doc.id, " => ", doc.data().name, " => ", doc.data().barangayID);
            var barangayID = doc.data().barangayID;

            console.log(doc.data().barangayID);
            var brgy = doc.data().barangay;
            
            db.collection("posts").where("accepted","==",true).where("barangayName", "==", brgy).where("issue", "==", "Announcement").orderBy("datetime","desc")
                .get()
                .then(function(querySnapshot) {
                    
                    


                        

                        var wb = XLSX.utils.book_new();
  wb.Props = {
                Title: "Resolved Reports",
                Subject: "Reports",
                Author: "barangayName",
                CreatedDate: new Date(2017,12,19)
        };
        wb.SheetNames.push("Test Sheet");
        var ws_data = [['Name','Date','Description','Image URL']];
     
         const docSnapshots = querySnapshot.docs;
          for (var a in docSnapshots) {
            
            const doc = docSnapshots[a].data();
            var datef = doc.datetime
            const actualDate = datef.toDate();
            var noTZ = actualDate.toLocaleString();
            var remarks = doc.remarks
            
           
          ws_data.push([doc.userID, noTZ, doc.description,doc.images]);
          
        }
           
        
         
        
         
        //a row with 2 columns
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        wb.Sheets["Test Sheet"] = ws;

        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
        function s2ab(s) { 
                var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
                var view = new Uint8Array(buf);  //create uint8array as viewer
                for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
                return buf;    
}
$("#button-a").click(function(){
       saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'Announcements.xlsx');
       
});




                      
               
                })



                
                .catch(function(error) {
                    console.log("Error getting documents: ", error);
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
          description: anncmnt,
          announcement: true,
          datetime: date,
          userID: uidGet,
          issue: "Announcement",
          images: URLimg, 
          barangayID: brgyID,
          barangayName: brgyName

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
    

    });
       
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    

    } else {
      // User not logged in or has just logged out.
      location.href ="../../index.html";
    }
    
});


  }



  firebase.auth().onAuthStateChanged((user) => {
    var announcements = document.querySelector("#announcements");
    var docRef = db.collection("users").doc(user.uid); //takes uid of current user
    docRef.get().then(function(doc) {
      var brgy = doc.data().barangay;

      if (doc.exists) {
        db.collection("posts").where("accepted","==",true).where("barangayName", "==", brgy).where("issue", "==", "Announcement").orderBy("datetime","desc")

          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  // doc.data() is never undefined for query doc snapshots
                        var datef = doc.data().datetime;
                        const actualDate = datef.toDate();
                        var noTZ = actualDate.toLocaleString();
                        var postID = doc.id;
                        var desc = doc.data().description;
                        var images = doc.data().images;
                        var issue = doc.data().issue;
                        var brgy = doc.data().barangayName;

          db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
              var fname = querySnapshot1.get("fname");
              var lname = querySnapshot1.get("lname");
              announcements.innerHTML += 

           "<tr>"+
              "<td scope='col'>"+fname+" "+lname+"</td>"+
              "<td scope='col'>"+noTZ+"</td>"+
              "<td scope='col'>"+
              "<button type='button' class='btn btn-danger btn-sm mr-1' onclick='deleteAnncmnt(\""+doc.id+"\")'><span class='lnr lnr-trash'></span> Delete</button>"+
              "<button type='button' id='resetBtn' class='btn btn-info btn-sm mr-1' onclick='editAnncmnt(\""+doc.id+"\")' data-toggle='modal' data-target='#editAnncmntModal'><span class='lnr lnr-pencil'></span> Edit</button>"+
              "<button type='button' style='color:white;' id='pin' class='btn btn-warning btn-sm' onclick='pinAnnouncement(\""+doc.id+"\")'><span class='lnr lnr-star'></span> Pin</button></td>"+
              "<td><a type='button' class='ml-2 text-right'><span id='show' class='lnr lnr-chevron-down' data-toggle='collapse' data-target='#collapseExample"+postID+"' aria-expanded='false' aria-controls='collapseExample'></span></a></td>"+
            "</tr>"+

    
              "<tr class='container collapse' id='collapseExample"+postID+"'>" +      
                       
                         "<td>"+                          
                           "<strong>Description: </strong><label>"+desc+"</label><br>"+
                        "</td>"+

                        "<td>"+
                           "<strong>Barangay: </strong><label>"+brgy+"</label><br>"+
                        "</td>"+
                       

                        "<td>"+
                           "<strong>Attached Image: </strong><br>"+
                           "<img src='"+images+"' style='width:350px; height:180px;' class='card-img '>"+

                        " </td>"+
                        "<td></td>"
            "</tr>"

          
            

          })
              });
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
         
      } 
      else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
});



/*==================================FEED=====================================*/

function deleteAnncmnt(postID){

bootbox.confirm({
          title: "BarangayAide",
          message: "Are you sure you want to delete this Announcement?",
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
                  message: "Announcement deleted.",
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


var URLimg1;
function editAnncmnt(postID){
  var docRef = db.collection("posts").doc(postID);

    const editDetails = document.querySelector("#editAnncmnt");
    const modalBtns = document.querySelector("#modal_btns");
   
   
      var anncmntDtls = db.collection("posts").doc(postID);
      
    anncmntDtls.get().then(function(doc) {
        if (doc.exists) {



            //console.log("Document data:", doc.data());
            editDetails.innerHTML += 
            "<div class='row'>"+
            "<div class='col-md-12'>"+
              "<label for='updAnnounce'>Edit Announcement:</label>"+
              //"<input type='input' class='form-control' value='"+doc.data().description+"' readonly>"+
              "<textarea class='form-control reportdesc mb-1' id='updAnnounce' rows='3' cols='30'>"+doc.data().description+"</textarea>"+
              "<label for='btUpload'>Change image:</label>"+
              //"</p><img src='"+doc.data().images+ "' class='card-img' style='width:470px;height:330px;'>"+
              "<input type='file' class='form-control-file mt-1' id='btnUpload1'>"+
            "</div>"+     
          "</div>"

          modalBtns.innerHTML +=
          "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>"+
          "<button type='button' onclick='updAnncmnt(\""+doc.id+"\")' data-dismiss='modal' class='btn btn-primary'>Save changes</button>"

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
           //window.URLimg1 = downloadURL1;    
           URLimg1 = downloadURL1;
                
      });
      }
      );
  });
          
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

}
 $('#editAnncmntModal').on('hidden.bs.modal', function () { 
    document.getElementById("editAnncmnt").innerHTML = "";
    document.getElementById("modal_btns").innerHTML = "";
});



function updAnncmnt(postID){
  
    var updateDesc = document.getElementById("updAnnounce").value;

    

    var updateDocRef = db.collection("posts").doc(postID); 
    
    if(URLimg1 == null){
      updateDocRef.update({
        description: updateDesc
        
      })
      .then(function() {
      console.log("Document successfully updated!");
      });
    }

    else{
      updateDocRef.update({
        description: updateDesc,
          images: URLimg1
    })
    .then(function() {
          console.log("Document successfully updated!");
    });

    }
    
    $(function () {
        bootbox.alert({
        message: "Successfully updated announcement!",
        callback: function () { location.reload(true); }
      });
    })
}

function sort(){
  var announcements = document.querySelector("#announcements");
  var newest = document.getElementById("newest");

  var oldest = document.getElementById("oldest");

  var user = firebase.auth().currentUser; //user constant
                  var uidGet = user.uid; 

  var docRef = db.collection("users").doc(uidGet); //takes uid of current user
    docRef.get().then(function(doc) {
      var brgy = doc.data().barangay;

      if (newest.checked) {
        db.collection("posts").where("accepted","==",true).where("barangayName", "==", brgy).where("issue", "==", "Announcement").orderBy("datetime","desc")

          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  // doc.data() is never undefined for query doc snapshots
                 var datef = doc.data().datetime;
                        const actualDate = datef.toDate();
                        var noTZ = actualDate.toLocaleString();
                        var postID = doc.id;
                        var desc = doc.data().description;
                        var images = doc.data().images;
                        var issue = doc.data().issue;
                        var brgy = doc.data().barangayName;

          db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
              var fname = querySnapshot1.get("fname");
              var lname = querySnapshot1.get("lname");
              announcements.innerHTML += 

           "<tr>"+
              "<td scope='col'>"+fname+" "+lname+"</td>"+
              "<td scope='col'>"+noTZ+"</td>"+
              "<td scope='col'>"+
              "<button type='button' class='btn btn-danger btn-sm mr-1' onclick='deleteAnncmnt(\""+doc.id+"\")'><span class='lnr lnr-trash'></span> Delete</button>"+
              "<button type='button' id='resetBtn' class='btn btn-info btn-sm mr-1' onclick='editAnncmnt(\""+doc.id+"\")' data-toggle='modal' data-target='#editAnncmntModal'><span class='lnr lnr-pencil'></span> Edit</button>"+
              "<button type='button' style='color:white;' id='pin' class='btn btn-warning btn-sm' onclick='pinAnnouncement(\""+doc.id+"\")'><span class='lnr lnr-star'></span> Pin</button></td>"+
              "<td><a type='button' class='ml-2 text-right'><span id='show' class='lnr lnr-chevron-down' data-toggle='collapse' data-target='#collapseExample"+postID+"' aria-expanded='false' aria-controls='collapseExample'></span></a></td>"+
            "</tr>"+

    
              "<tr class='container collapse' id='collapseExample"+postID+"'>" +      
                       
                         "<td>"+                          
                           "<strong>Description: </strong><label>"+desc+"</label><br>"+
                        "</td>"+
                        "<td>"+
                           "<strong>Barangay: </strong><label>"+brgy+"</label><br>"+
                        "</td>"+
                       

                        "<td>"+
                           "<strong>Attached Image: </strong><br>"+
                           "<img src='"+images+"' style='width:350px; height:180px;' class='card-img '>"+

                        " </td>"+
                        "<td></td>"
            "</tr>"


          
            

          })
              });
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
         
      } 
      else if(oldest.checked) {
          // doc.data() will be undefined in this case
          db.collection("posts").where("accepted","==",true).where("barangayName", "==", brgy).where("issue", "==", "Announcement").orderBy("datetime","asc")
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  // doc.data() is never undefined for query doc snapshots
                 var datef = doc.data().datetime;
                        const actualDate = datef.toDate();
                        var noTZ = actualDate.toLocaleString();
                        var postID = doc.id;
                        var desc = doc.data().description;
                        var images = doc.data().images;
                        var issue = doc.data().issue;
                        var brgy = doc.data().barangayName;

          db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
              var fname = querySnapshot1.get("fname");
              var lname = querySnapshot1.get("lname");
              announcements.innerHTML += 

           "<tr>"+
              "<td scope='col'>"+fname+" "+lname+"</td>"+
              "<td scope='col'>"+noTZ+"</td>"+
              "<td scope='col'>"+
              "<button type='button' class='btn btn-danger btn-sm mr-1' onclick='deleteAnncmnt(\""+doc.id+"\")'><span class='lnr lnr-trash'></span> Delete</button>"+
              "<button type='button' id='resetBtn' class='btn btn-info btn-sm mr-1' onclick='editAnncmnt(\""+doc.id+"\")' data-toggle='modal' data-target='#editAnncmntModal'><span class='lnr lnr-pencil'></span> Edit</button>"+
              "<button type='button' style='color:white;' id='pin' class='btn btn-warning btn-sm' onclick='pinAnnouncement(\""+doc.id+"\")'><span class='lnr lnr-star'></span> Pin</button></td>"+
              "<td><a type='button' class='ml-2 text-right'><span id='show' class='lnr lnr-chevron-down' data-toggle='collapse' data-target='#collapseExample"+postID+"' aria-expanded='false' aria-controls='collapseExample'></span></a></td>"+
            "</tr>"+

    
              "<tr class='container collapse' id='collapseExample"+postID+"'>" +      
                       
                         "<td>"+                          
                           "<strong>Description: </strong><label>"+desc+"</label><br>"+
                        "</td>"+

                      

                        "<td>"+
                           "<strong>Barangay: </strong><label>"+brgy+"</label><br>"+
                        "</td>"+
                       

                        "<td>"+
                           "<strong>Attached Image: </strong><br>"+
                           "<img src='"+images+"' style='width:350px; height:180px;' class='card-img '>"+

                        " </td>"+
                        "<td></td>"
            "</tr>"

          
            

          })
              });
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          });
      }
  cleartable();

  
})
  }

function cleartable(){
  document.getElementById("announcements").innerHTML = "";
}




  
//announcement has been pinned.
//are you sure you want to pin this announcment?
//announcement has been pinned.


function pinAnnouncement(postID){
  var pin = document.getElementById("pin");
  var pinPost = db.collection("posts").doc(postID);

  pinPost.get().then(function(doc) {
      if (doc.exists) {

          if(doc.data().pinned == false){
              pinPost.update({
                pinned: true
              })

            .then(function() {
                console.log("Pinned");

            });
          }
          else{
             pinPost.update({
                pinned: false
              })

            .then(function() {
                console.log("Unpinned");
            });


          }



      } else {
          
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
   
  
}


  