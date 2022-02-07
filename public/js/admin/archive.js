 console.log("resolve.js for ADMIN");

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
const dispRejected = document.querySelector("#archive");
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
            //dispUser.innerHTML += "<h2 class='myfont'>" +doc.data().name+  "</h2>" // displays name when logged in
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

var db = firebase.firestore(); //firestore constant
  const auth = firebase.auth(); //auth constant

btnLogout.addEventListener('click', e =>{
    firebase.auth().signOut(); //signs out current user
    window.location.href = "../../index.html";

    
  });

  firebase.auth().onAuthStateChanged(firebaseUser=> {
    
    if(firebaseUser){
        
     

    db.collection("users").where("uid", "==", firebaseUser.uid)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
            //console.log(doc.id, " => ", doc.data().name, " => ", doc.data().barangayID);
            var barangayID = doc.data().barangayID;

            console.log(doc.data().barangayID);
            db.collection("archive").where("rejected","==",true).where("barangayID","==",barangayID)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                    

                        var datef = doc.data().datetime;
                        const actualDate = datef.toDate();
                        var noTZ = actualDate.toLocaleString();

                        db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
                        var name = querySnapshot1.get("name");
                        dispRejected.innerHTML +=
                        "<tr>"+
                           
                            "<td>" +name+ "</td>"+
                            "<td>"+noTZ+"</td>"+
                            "<td>"+doc.data().issue+"</td>"+
                            "<td>"+doc.data().reason+"</td>"+
                            "<td><button type='button' class='btn btn-danger btn-sm' onclick='deletePost(\""+doc.id+"\")'>✖ Delete</button></td></td>"+
                            
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



    function deletePost(postID){
  bootbox.confirm({
          title: "BarangayAide",
          message: "Are you sure you want to delete this entry?",
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
                 db.collection("archive").doc(postID).delete()

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

const sample = document.querySelector("#_archive");

     firebase.auth().onAuthStateChanged(firebaseUser=> {
    
    if(firebaseUser){
        
     

    db.collection("users").where("uid", "==", firebaseUser.uid)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

          var fname = doc.data().fname;
          var lname = doc.data().lname;
            
            //console.log(doc.id, " => ", doc.data().name, " => ", doc.data().barangayID);
            var barangayID = doc.data().barangayID;
            var docRef = db.collection("posts").doc("1ttfLqZCaULINi4pi9XW");

          docRef.get().then(function(doc) {
              if (doc.exists) {
                  
                 var datef = doc.data().datetime;
                        const actualDate = datef.toDate();
                        var noTZ = actualDate.toLocaleString();
                        var issue = doc.data().issue;
                        var brgy = doc.data().barangayName
                        var desc =  doc.data().description;

                        db.collection("users").doc(doc.data().userID).get().then(function(querySnapshot1){
                        var name = querySnapshot1.get("name");
                        dispRejected.innerHTML +=
                        "<tr>"+
                           
                             "<td>" +name+ "</td>"+
                            "<td>"+noTZ+"</td>"+
                            "<td>"+issue+"</td>"+
                            "<td>"+brgy+"</td>"+
                            "<td>"+desc+"</td>"+
                            
                        "</tr>"

                         




                  
                        });

              } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
              }
          }).catch(function(error) {
              console.log("Error getting document:", error);
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



                     


