// Initialize Firebase
var transposingtales = {
    apiKey: "AIzaSyCoBAzdCizF7QArpX3aypTuPwOBVAoezCs",
    authDomain: "transposingtales.firebaseapp.com",
    databaseURL: "https://transposingtales-default-rtdb.firebaseio.com",
    projectId: "transposingtales",
    storageBucket: "transposingtales.appspot.com",
    messagingSenderId: "879161277893",
    appId: "1:879161277893:web:082500f42be8ab44101fac",
    measurementId: "G-LX9KNC8HBF"
};

firebase.initializeApp(transposingtales);
const database = firebase.database();
const storage = firebase.storage();




document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const name = formData.get("name");
    const phone = formData.get("phone");
    const email = formData.get("email");

    // Check if the account exists in Firebase
    database.ref('users/' + phone).once('value', function(snapshot) {

        localStorage.setItem('nameofuser', name);
        localStorage.setItem('phoneofuser', phone);
        localStorage.setItem('emailofuser', email);


        if (snapshot.exists()) {
            window.location.href = "index.html";
        } else {
            // Account doesn't exist, create it
            database.ref('users/' + phone).set({
                name: name,
                phone: phone,
                email: email
            }).then(function() {
                window.location.href = "index.html";
            }).catch(function(error) {
                console.error("Error creating account: ", error);
            });
        }
    });

});