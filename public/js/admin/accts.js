console.log("if u dont see this it aint werk");

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

  var accountsConfig = {
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
  // Initialize Config for account creation
  var secondary = firebase.initializeApp(accountsConfig, "Secondary")

  btnLogout.addEventListener('click', e =>{
    firebase.auth().signOut(); //signs out current user
    window.location.href = "../../index.html";
  });

 var db = firebase.firestore(); //firestore constant
  const auth = firebase.auth(); //auth constant
  var dispUsers = document.querySelector("#usersTbl");

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User logged in already or has just logged in.
      console.log(user.uid); //logs currently logged in user's UID
        //table for users
      var docRef = db.collection("users").doc(user.uid);

      docRef.get().then(function(doc) {
          if (doc.exists) {
            var brgyID = doc.data().barangayID;
            //console.log(doc.data());

            db.collection("users").where("role", "==", "2").where("barangayID","==",brgyID)
              .get()
              .then(function(querySnapshot) {
                  querySnapshot.forEach(function(doc) {
                      // doc.data() is never undefined for query doc snapshots
                      dispUsers.innerHTML +=
              
                        "<tr>"+
                          "<td>" +doc.data().fname+" "+doc.data().lname+ "</td>"+
                          "<td>"+doc.data().email+"</td>"+
                          
                        "</tr>"
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
      
    } else {
      // User not logged in or has just logged out.
      location.href ="../../index.html";
    }
    var docRef = db.collection("users").doc(user.uid); //takes uid of current user
    docRef.get().then(function(doc) {
      if (doc.exists) {
        if(doc.data().role == 3){
          //console.log("Document data:", doc.data());
            console.log('Logged in as: ', doc.data().email, '||', doc.data().lname, '||', doc.data().uid);      
            
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


 function createReport(){
  var doc = new jsPDF();

  doc.text(20,20,"Test report");
  doc.text(20,40,"This is a report");
  doc.text(20,60,"IT WORKS!");

  doc.fromHTML($("#usersTbl").get(0),20,80,{
    'width':500
  })

  doc.save('Test.pdf');
 } 


//create barangay official account
/*******************************************************************/
 function rgstrOffcl(){

  //var inputlName = document.getElementById("lname").value;
  //const promise = auth.createUserWithEmailAndPassword(inputEmail.value, inputPass.value);
  //promise.catch(e=> alert(e.message));

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {

  var confirm = document.getElementById("confirmpass").value;
      // User logged in already or has just logged in.
      db.collection("users").where("uid", "==", user.uid)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var regex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  var inputEmail = document.getElementById("email");
  var inputPass = document.getElementById("pass");

  var inputFName = document.getElementById("fname").value;
  var inputLName = document.getElementById("lname").value;
  var validateEmail = inputEmail.value;
  var validatePass = inputPass.value;
      var barangayID = doc.data().barangayID;
      var brgy = doc.data().barangay;

      if(validatePass == "" || validateEmail == "" || inputFName == "" || inputLName == ""){
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
    secondary.auth().createUserWithEmailAndPassword(validateEmail, validatePass)
    .then(function(data){
      var uidGet = data.user.uid; //unique Id
      var userEmail = data.user.email;
      console.log('uid',data.user.uid); //displays newly created user's unique ID in the console

        db.collection("users").doc(uidGet).set({
        fname: inputFName,
        lname: inputLName,
        email: userEmail,
        role: "2", //1 - resident, 2 - official, 3 - admin;
        uid: uidGet,
        login: -1,
        barangayID: barangayID,
        barangay: brgy
      });

      

  })
  .catch(function(error) {
      bootbox.alert(error);//same email
  });

  }
        
        });

    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

      
      
    } else {
      // User not logged in or has just logged out.
      
    }    
 
});


}

secondary.auth().onAuthStateChanged((user) => {
    if (user) {
        // User logged in already or has just logged in.
        //console.log(user.uid); //logs currently logged in user's UID
        var docRef = db.collection("users").doc(user.uid); //takes uid of current user
        docRef.get().then(function(doc) {
        if (doc.exists) {
          
          $(function () {
            bootbox.alert({
              title: "BarangayAide",
              message: "Account successfully created.",
              callback: function () { location.reload(true); }
            });
          });

          secondary.auth().signOut();
          //window.location.reload();

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
      // User not logged in or has just logged out.
      console.log("No one logged in/No account created");
    }
    
});

/*******************************************************************/