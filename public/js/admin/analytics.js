

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

var db = firebase.firestore(); //firestore constant
const auth = firebase.auth(); //auth constant

btnLogout.addEventListener('click', e =>{
  firebase.auth().signOut(); //signs out current user
  window.location.href = "../../index.html";

  
});
var ongoing;
var pending;
var resolved;
var rejected;


firebase.auth().onAuthStateChanged((user) => {
    if (user) {

var docRef = db.collection("users").doc(user.uid);

docRef.get().then((doc) => {
    if (doc.exists) {
        //var brgy = doc.data().barangay
        var brgyID = doc.data().barangayID;
        db.collection("posts").where("accepted","==",true).where("status", "==", "Ongoing").where("barangayID","==",brgyID)
    .get()
    .then((querySnapshot1) => {
        var ongoing_posts = querySnapshot1.size
        ongoing = parseInt(ongoing_posts); 

        db.collection("posts").where("accepted", "==", false).where("barangayID","==",brgyID)
            .get()
            .then((querySnapshot2) => {
                var pending_posts = querySnapshot2.size
                pending = parseInt(pending_posts);     
              

                db.collection("posts").where("accepted", "==", true).where("status","==","Resolved").where("barangayID","==",brgyID)
                    .get()
                    .then((querySnapshot3) => {
                        var resolved_posts = querySnapshot3.size
                        resolved = parseInt(resolved_posts);    
                        
                        db.collection("archive").where("rejected", "==", true).where("barangayID","==",brgyID)
                          .get()
                          .then((querySnapshot4) => {
                              var rejected_posts = querySnapshot4.size
                              rejected = parseInt(rejected_posts);    
                              
                              let analyticsChart = document.getElementById('chart').getContext('2d');

                        let postsChart = new Chart(analyticsChart,{

                            type:'doughnut',
                            data:{
                                labels:['Pending','Ongoing','Resolved','Rejected'],
                                datasets:[{
                                    label:'Posts',
                                    data:[
                                        pending,
                                        ongoing,
                                        resolved,
                                        rejected                                    
                                    ],
                                    backgroundColor:[
                                      'rgba(84, 182, 214, 0.5)',
                                      'rgba(8, 255, 0, 0.5)',
                                      'rgba(255, 254, 0, 0.5)',
                                      'rgba(255, 72, 138,0.5)'
                                    ]
                                }]
                            },
                            options:{},


                        });
                              
                              

                          })
                              
                        

                    })


            })

        
    })


        
    } 

    else {
    }
})



    } 
    else {
    }
})

/*


*/




var vandalism;
var garbage;
var noise;
var drainage;
var pollution;



firebase.auth().onAuthStateChanged((user) => {
  if (user) {

var docRef = db.collection("users").doc(user.uid);

docRef.get().then((doc) => {
  if (doc.exists) {
      //var brgy = doc.data().barangay
      var brgyID = doc.data().barangayID;
      db.collection("posts").where("issue", "==", "Vandalism").where("barangayID","==",brgyID)
  .get()
  .then((querySnapshot5) => {
      var vandalism_posts = querySnapshot5.size
      vandalism = parseInt(vandalism_posts); 

      db.collection("posts").where("issue", "==", "Garbage").where("barangayID","==",brgyID)
          .get()
          .then((querySnapshot6) => {
              var garbage_posts = querySnapshot6.size
              garbage = parseInt(garbage_posts);     
            

              db.collection("posts").where("issue","==","Noise").where("barangayID","==",brgyID)
                  .get()
                  .then((querySnapshot7) => {
                      var noise_posts = querySnapshot7.size
                      noise = parseInt(noise_posts);    
                      
                      db.collection("posts").where("issue","==","Drainage").where("barangayID","==",brgyID)
                          .get()
                          .then((querySnapshot8) => {
                              var drainage_posts = querySnapshot8.size
                              drainage = parseInt(drainage_posts);    
                              
                              db.collection("posts").where("issue","==","Pollution").where("barangayID","==",brgyID)
                                  .get()
                                  .then((querySnapshot9) => {
                                      var pollution_posts = querySnapshot9.size
                                      pollution = parseInt(pollution_posts);    
                                      
                                      let issuesChart = document.getElementById('chartIssues').getContext('2d');

                                        let postsChart = new Chart(issuesChart,{

                                            type:'doughnut',
                                            data:{
                                                labels:['Vandalsim','Garbage','Noise','Drainage',"Pollution"],
                                                datasets:[{
                                                    label:'Posts',
                                                    data:[
                                                        vandalism,
                                                        garbage,
                                                        noise,
                                                        drainage,
                                                        pollution                                     
                                                    ],
                                                    backgroundColor:[
                                                      'rgba(22, 205, 201,0.5)',
                                                      'rgba(0, 196, 69,0.5)',
                                                      'rgba(255, 165, 0,0.5)',
                                                      'rgba(130, 46, 201,0.5)',
                                                      'rgba(255, 162, 255,0.5)'
                                                    ]
                                                }]
                                            },
                                            options:{},


                                        });
                                      

                                  })
                              
                              

                          })
                      
                      

                  })


          })

      
  })


      
  } 

  else {
  }
})



  } 
  else {
  }
})

 

 function pdfComplaints(){
  html2canvas(document.getElementById("complaints")).then(function(canvas) {
    document.body.appendChild(canvas)

    var imgdata = canvas.toDataURL('image/png')
    var doc = new jsPDF();
    doc.addImage(imgdata,'PNG',1,1)
    doc.save("Analytics_Complaints.pdf")
});
 } 

 document.getElementById("complaintsPDF").onclick = function() { pdfComplaints()};



 function pdfIssues(){
  html2canvas(document.getElementById("issues")).then(function(canvas) {
    document.body.appendChild(canvas)

    var imgdata = canvas.toDataURL('image/png')
    var doc = new jsPDF();
    doc.addImage(imgdata,'PNG',1,1)
    doc.save("Analytics_Issues.pdf")
});
 } 

 document.getElementById("issuesPDF").onclick = function() { pdfIssues()};


/*
let analyticsChart = document.getElementById('chart').getContext('2d');

                      let postsChart = new Chart(analyticsChart,{

                          type:'doughnut',
                          data:{
                              labels:['Pending','Ongoing','Resolved'],
                              datasets:[{
                                  label:'Posts',
                                  data:[
                                      pending,
                                      ongoing,
                                      resolved                                      
                                  ],
                                  backgroundColor:[
                                    'rgba(84, 182, 214, 0.5)',
                                    'rgba(8, 255, 0, 0.5)',
                                    'rgba(255, 254, 0, 0.5)'
                                  ]
                              }]
                          },
                          options:{},


                      });
*/










/*


        */