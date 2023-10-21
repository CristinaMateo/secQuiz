
const firebaseConfig = {
  apiKey: "AIzaSyDXwc-XRYEeU4XRDcf21IJy9oPdmJ24eWs",
  authDomain: "telequiz-cb0e4.firebaseapp.com",
  projectId: "telequiz-cb0e4",
  storageBucket: "telequiz-cb0e4.appspot.com",
  messagingSenderId: "911800771479",
  appId: "1:911800771479:web:d1bce9392241d007451ad2"

};


firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


const api = 'https://opentdb.com/api.php?amount=10&category=14&difficulty=medium&type=multiple' 

const preguntas = [] 
const correctas =[]
const mezcladas = []
let i = 0;
let score = 0;
let alerta = 0;
let numbers = [0,1,2,3]

function caos(array) {
    array.sort(() => Math.random() - 0.5);
    return array
  }

function pintar(pregunta, mezcladas, i){
    let rnd = caos(numbers)
    let template = document.getElementById("quiz") 
    
     template.innerHTML = 
    `<fieldset class="field hide" id="${[i]}">
        <legend>${pregunta}</legend>
        <div>
            <label for="a${i}">${mezcladas[rnd[0]]}</label>
            <input type="radio" name="n${i}" value="${mezcladas[rnd[0]]}" id= "a${i}"  required>
        </div>
        <div>
            <label for="b${i}">${mezcladas[rnd[1]]}</label>
            <input type="radio" name="n${i}" value="${mezcladas[rnd[1]]}" id= "b${i}"  required>
        </div>
        <div>
            <label for="c${i}">${mezcladas[rnd[2]]}</label>
            <input type="radio" name="n${i}" value="${mezcladas[rnd[2]]}" id= "c${i}"  required>
        </div>
        <div>
            <label for="d${i}">${mezcladas[rnd[3]]}</label>
            <input type="radio" name="n${i}" value="${mezcladas[rnd[3]]}" id= "d${i}"  required>
        </div>
    </fieldset>
    <button id="next">NEXT</button>
    <input type="submit" id="finish" value="Finish quiz"></input>
    ` 
    if(i<9){
        document.getElementById("finish").style.display = "none"
    }
  
    document.querySelector("#next").addEventListener("click", comprobarYPasar);

    document.querySelector("#finish").addEventListener("submit", validar)
}



 //Crear form
async function getQuiz() {

    let response = await fetch(api);
    let data = await response.json();

    for(let i=0; i< data.results.length; i++){     
      
        preguntas.push(data.results[i].question)                         
        correctas.push(data.results[i].correct_answer)
        mezcladas.push(data.results[i].incorrect_answers.concat(data.results[i].correct_answer))    
        
    }

    console.log(correctas);

      pintar(preguntas[i], mezcladas[i], i)  
      
    }
    


//validación

    function comprobarYPasar(event){
        event.preventDefault();
        const respuestaUsuario = document.querySelector(`input[name=n${i}]:checked`).value
        console.log("respuestaUsuario es " + respuestaUsuario)

        if (respuestaUsuario == correctas[i]){
            score++
        } else if (respuestaUsuario != correctas[i]){
            alerta++
        }
        console.log("alerta = "+alerta)
        console.log("score = "+score)
        console.log("index = "+i);

        i++
        
        pintar(preguntas[i], mezcladas[i], i)
        console.log("nuevo index =" + i)

        if(i==9){
            document.querySelector("#next").remove()
        }
}

  function validar(event){
    
  }     


//AUTH

/**************Firebase Auth*****************/


const createUser = (user) => {
  db.collection("users")
    .add(user)
    .then((docRef) => console.log("Document written with ID: ", docRef.id))
    .catch((error) => console.error("Error adding document: ", error));
};

const signUpUser = (email, password) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha registrado ${user.email} ID:${user.uid}`)
      alert(`se ha registrado ${user.email} ID:${user.uid}`)
      // ...
      // Guarda El usuario en Firestore
      createUser({
        id: user.uid,
        email: user.email
      });

    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log("Error en el sistema" + error.message);
    });
};

//"alex@demo.com","123456"

document.getElementById("form1").addEventListener("submit", function (event) {
  event.preventDefault();
  let email = event.target.elements.email.value;
  let pass = event.target.elements.pass.value;
  let pass2 = event.target.elements.pass2.value;

  pass === pass2 ? signUpUser(email, pass) : alert("error password");
})


const signInUser = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      let user = userCredential.user;
      console.log(`se ha logado ${user.email} ID:${user.uid}`)
      alert(`se ha logado ${user.email} ID:${user.uid}`)
      console.log("USER", user);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode)
      console.log(errorMessage)
    });
}

const signOut = () => {
  let user = firebase.auth().currentUser

  firebase.auth().signOut().then(() => {
    console.log("Sale del sistema: " + user.email)
  }).catch((error) => {
    console.log("hubo un error: " + error);
  });
  location.reload();
}


document.getElementById("form2").addEventListener("submit", function (event) {
  event.preventDefault();
  let email = event.target.elements.email2.value;
  let pass = event.target.elements.pass3.value;
  signInUser(email, pass)
  getQuiz();
  document.getElementById("esconder").style.display="none";
  
})

document.getElementById("salir").addEventListener("click", signOut);
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(`Está en el sistema:${user.email} ${user.uid}`);
  } else {
    console.log("no hay usuarios en el sistema");
  }
});







