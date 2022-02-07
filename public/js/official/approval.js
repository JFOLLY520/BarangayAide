 console.log("requests for admin");

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
            //dispUser.innerHTML += "<h2 class='myfont'>" +doc.data().name+  "</h2>" // displays name when logged in
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
   
  const dispPending = document.querySelector("#pend_posts");






firebase.auth().onAuthStateChanged(firebaseUser=> {
    
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
            db.collection("posts").where("accepted","==",false).where("status","==","Ongoing").where("barangayID","==",barangayID).orderBy("datetime","desc").limit(3)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                    

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
                        //console.log(doc.data());
                        dispPending.innerHTML +=
                "<tr class='text-center'>"+
                   "<td scope='col' style='width:195px;'>"+fname+" "+lname+"</td>"+
                   "<td scope='col'>"+noTZ+"</td>"+
                   "<td scope='col'>"+issue+"</td>"+
                   "<td scope='col'>"+
                   "<button type='button' class='btn btn-info btn-sm mr-1 approve-post' onclick='approvePost(\""+doc.id+"\")'>✔ Approve</button>"+
                    "<button type='button' class='btn btn-danger btn-sm' onclick='rejectPost(\""+doc.id+"\")'>✖ Reject</button>"+
                    "<button type='button' class='btn btn-danger btn-sm ml-1' onclick='deletePost(\""+doc.id+"\")'><span class='lnr lnr-trash'></span> Delete</button></td>"+
                   "<td id='show' class='lnr lnr-chevron-down' data-toggle='collapse' data-target='#collapseExample"+postID+"' aria-expanded='false' aria-controls='collapseExample'><a type='button' class='ml-2 text-right'><span ></span></td></a>"+
                 "</tr>"+


                 "<tr class='container collapse' id='collapseExample"+postID+"'>" +      
                       
                         "<td>"+                          
                           "<strong>Description: </strong><label>"+desc+"</label><br>"+
                        "</td>"+

                        "<td>"+
                           "<strong>Issue: </strong><label>"+issue+"</label><br>"+
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



              
                  
                        });
                   
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
              
              db.collection("posts").where("accepted","==",false).where("status","==","Ongoing").where("barangayID","==",barangayID).orderBy("datetime","desc")
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
          var ws_data = [['Name','Date','Issue','Description','Image URL']];
       
           const docSnapshots = querySnapshot.docs;
            for (var a in docSnapshots) {
              
              const doc = docSnapshots[a].data();
              var datef = doc.datetime
              const actualDate = datef.toDate();
              var noTZ = actualDate.toLocaleString();
              
             
            ws_data.push([doc.userID, noTZ, doc.issue, doc.description,doc.images]);
            
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
         saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'Requests.xlsx');
         
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


   function approvePost(postID){
      //are you sure you want to approve this post?
      bootbox.confirm({
          title: "BarangayAide",
          message: "Are you sure you want to approve this complaint?",
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
              var user = firebase.auth().currentUser; //user constant
              var uidGet = user.uid;
              db.collection("posts").doc(postID).update({
                  accepted: true,
                  approvedBy: uidGet
              })
              .then(function() {
                console.log("Approved");
                $(function () {
                    bootbox.alert({
                    title: "BarangayAide",
                    message: "Complaint Approved!",
                    callback: function () { location.reload(true); }
                });
              ;})

                 
              })
              .catch(function(error) {
                console.error("Error posting: ", error);
              });

             }
             else{
              $('.bootbox.modal').modal('hide')
             }

          }

      });

    }



    
    function rejectPost(postID){

      bootbox.confirm({
          title: "BarangayAide",
          message: "Are you sure you want to reject this complaint?",
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
              bootbox.confirm({
          title: "Reason why this was rejected:",
          message: "<input type='text' class='form-control' id='reason'>",
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
              var user = firebase.auth().currentUser; //user constant
          var uidGet = user.uid;
          db.collection("posts").doc(postID).get().then(function(doc){
            var reason = document.getElementById("reason").value
            var barangayID = doc.data().barangayID;
            var barangayName = doc.data().barangayName;
            var datetime = doc.data().datetime;
            var images = doc.data().images;
            var issue = doc.data().issue;
            var userID = doc.data().userID;

            db.collection("archive").doc().set({
              rejected: true,
              userID: userID,
              barangayID: barangayID,
              barangayName: barangayName,
              datetime: datetime,
              images: images,
              issue: issue,
              reason: reason
              
          
            })
            .then(function() {
              console.log("Archive added");
               $(function () {
                  bootbox.alert({
                  title: "BarangayAide",
                    message: "Post Rejected!",
                  callback: function () { location.reload(true); }
              });
            })
            })
            .catch(function(error) {
              console.error("Error posting: ", error);
            });
    
             
      
      })
      .then(function() {
        console.log("Rejected");
        removePost(postID);
        
      }).then(function(){
        
      })
      .catch(function(error) {
        console.error("Error posting: ", error);
      });

             }
             else{
              $('.bootbox.modal').modal('hide')
             }

          }

      });

            }
          }
        })

            

    }

    function removePost(postID){
      db.collection("posts").doc(postID).delete();

    }

    function sort(){
  //var announcements = document.querySelector("#announcements");
  var newest = document.getElementById("newest");

  var oldest = document.getElementById("oldest");

  var user = firebase.auth().currentUser; //user constant
                  var uidGet = user.uid; 

  var docRef = db.collection("users").doc(uidGet); //takes uid of current user
    docRef.get().then(function(doc) {
      var brgy = doc.data().barangay;
      var brgyID = doc.data().barangayID;

      if (newest.checked) {
        db.collection("posts").where("accepted","==",false).where("status","==","Ongoing").where("barangayID","==",brgyID).orderBy("datetime","desc")

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
              dispPending.innerHTML +=
                "<tr class='text-center'>"+
                   "<td scope='col' style='width:195px;'>"+fname+" "+lname+"</td>"+
                   "<td scope='col'>"+noTZ+"</td>"+
                   "<td scope='col'>"+issue+"</td>"+
                   "<td scope='col'>"+
                   "<button type='button' class='btn btn-info btn-sm mr-1 approve-post' onclick='approvePost(\""+doc.id+"\")'>✔ Approve</button>"+
                    "<button type='button' class='btn btn-danger btn-sm' onclick='rejectPost(\""+doc.id+"\")'>✖ Reject</button>"+
                    "<button type='button' class='btn btn-danger btn-sm ml-1' onclick='deletePost(\""+doc.id+"\")'><span class='lnr lnr-trash'></span> Delete</button></td>"+
                   "<td id='show' class='lnr lnr-chevron-down' data-toggle='collapse' data-target='#collapseExample"+postID+"' aria-expanded='false' aria-controls='collapseExample'><a type='button' class='ml-2 text-right'><span ></span></td></a>"+
                 "</tr>"+


                 "<tr class='container collapse' id='collapseExample"+postID+"'>" +      
                       
                         "<td>"+                          
                           "<strong>Description: </strong><label>"+desc+"</label><br>"+
                        "</td>"+

                        "<td>"+
                           "<strong>Issue: </strong><label>"+issue+"</label><br>"+
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
          db.collection("posts").where("accepted","==",false).where("status","==","Ongoing").where("barangayID","==",brgyID).orderBy("datetime","asc")
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
              

           dispPending.innerHTML +=
                "<tr class='text-center'>"+
                   "<td scope='col' style='width:195px;'>"+fname+" "+lname+"</td>"+
                   "<td scope='col'>"+noTZ+"</td>"+
                   "<td scope='col'>"+issue+"</td>"+
                   "<td scope='col'>"+
                   "<button type='button' class='btn btn-info btn-sm mr-1 approve-post' onclick='approvePost(\""+doc.id+"\")'>✔ Approve</button>"+
                    "<button type='button' class='btn btn-danger btn-sm' onclick='rejectPost(\""+doc.id+"\")'>✖ Reject</button>"+
                    "<button type='button' class='btn btn-danger btn-sm ml-1' onclick='deletePost(\""+doc.id+"\")'><span class='lnr lnr-trash'></span> Delete</button></td>"+
                   "<td id='show' class='lnr lnr-chevron-down' data-toggle='collapse' data-target='#collapseExample"+postID+"' aria-expanded='false' aria-controls='collapseExample'><a type='button' class='ml-2 text-right'><span ></span></td></a>"+
                 "</tr>"+


                 "<tr class='container collapse' id='collapseExample"+postID+"'>" +      
                       
                         "<td>"+                          
                           "<strong>Description: </strong><label>"+desc+"</label><br>"+
                        "</td>"+

                        "<td>"+
                           "<strong>Issue: </strong><label>"+issue+"</label><br>"+
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
  document.getElementById("pend_posts").innerHTML = "";
  
}

function deletePost(postID){
  bootbox.confirm({
          title: "BarangayAide",
          message: "Are you sure you want to delete this complaint?",
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
              var user = firebase.auth().currentUser; //user constant
                 db.collection("posts").doc(postID).delete()

                 .then(function() {
                  console.log("Deleted");
                  $(function () {
                    bootbox.alert({
                    title: "BarangayAide",
                    message: "Complaint Deleted",
                    callback: function () { location.reload(true); }
                });
              })
                   
                })

            }
            else{
              $('.bootbox.modal').modal('hide')
            }
          }
        })
      
    
        
    }