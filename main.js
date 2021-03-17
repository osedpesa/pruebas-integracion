const noLogin = document.querySelectorAll('.no-login');
const login = document.querySelectorAll('.login');

const loginCheck = user => {
    if (user) {
        login.forEach(link => link.style.display = 'block');
        noLogin.forEach(link => link.style.display = 'none');
    } else {
        noLogin.forEach(link => link.style.display = 'block');
        login.forEach(link => link.style.display = 'none');
    }
}

// Registro
const signUpForm = document.querySelector('#sign-up-form');

signUpForm.addEventListener('submit', (e) => {
    e.preventDefault(); //Cancela el reinicio del formulario

    const signUpEmail = document.querySelector('#sign-up-email').value;
    const signUpPassword = document.querySelector('#sign-up-password').value;

    auth.createUserWithEmailAndPassword(signUpEmail, signUpPassword)
        .then(userCredential => {
            signUpForm.reset();

            $('#sign-up-modal').modal('hide');
        });

});

//Inicio de sesión

const signInForm = document.querySelector('#sign-in-form');

signInForm.addEventListener('submit', e => {
    e.preventDefault();

    const signInEmail = document.querySelector('#sign-in-email').value;
    const signInPassword = document.querySelector('#sign-in-password').value;
    auth.signInWithEmailAndPassword(signInEmail, signInPassword)
        .then(userCredential => {
            signInForm.reset();

            $('#sign-in-modal').modal('hide');
        });
    //console.log(signInEmail, signInPassword);
    console.log('signIn');
});


//cerrar sesion 
const logOut = document.querySelector('#log-out');

logOut.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('sing out');
    });
});

//Google login

const googleButton = document.querySelector('#loginGoogle');

googleButton.addEventListener('click', e => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            //console.log('google login');
            signInForm.reset();
            $('#sign-in-modal').modal('hide');
        })
        .catch(err => {
            console.log(err);
        });
});

//Login Facebook

const facebookButton = document.querySelector('#loginFacebook');

facebookButton.addEventListener('click', e => {
    e.preventDefault();
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            signInForm.reset();
            $('#sign-in-modal').modal('hide');
        })
        .catch(err => {
            console.log(err);
        });
});


//publicaciones

const postList = document.querySelector('#post');

const setUpPost = data => {
    if (data.length) {
        let html = '';
        data.forEach(doc => {
            const post = doc.data()
            const li = `
                <li class="list-group-item list-group-item-action ">
                    <h5>${post.titulo}</h5>
                    <p>${post.descripcion}</p>
                </li>
            `;
            html += li;
        });
        postList.innerHTML = html;
    } else {
        postList.innerHTML = `<p class="text-center">Inicia sesión para ver las publicaciones</p>`;
    }
};

auth.onAuthStateChanged(user => {
    if (user) {
        fs.collection('publicaciones')
            .get()
            .then((snapshot) => {
                //console.log(snapshot.docs);
                setUpPost(snapshot.docs);
                loginCheck(user);
            });
    } else {
        setUpPost([]);
        loginCheck(user);
    }
});