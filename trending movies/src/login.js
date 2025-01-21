
let registerForm=document.querySelector("#registerForm");
let loginForm=document.querySelector("#login-form");

let goToRegisterBtn=document.querySelector("#goToRegister")
let goToLoginBtn=document.querySelector("#goToLogin")

let loginDiv=document.querySelector("#login");
let registerDiv=document.querySelector("#register");

let loader=document.getElementById("loader");
let authSection=document.getElementById("auth-section");

let LoginEmailValidationSpan=document.querySelector(".LoginEmailValidationSpan");
let LoginPasswordValidationSpan=document.querySelector(".LoginPasswordValidationSpan")

let RegisterEmailValidationSpan=document.querySelector(".registerEmailValidationSpan");
let RegisterPasswordValidationSpan=document.querySelector(".registerPasswordValidationSpan")

let LoginFailSpan=document.querySelector("#loginFail")




goToRegisterBtn.addEventListener("click",()=>{

loginDiv.classList.remove("animate__fadeInDown")
    loginDiv.classList.add("animate__fadeOutLeft");
    registerDiv.classList.remove("animate__fadeOutRight")
    
    loginDiv.addEventListener("animationend", () => {
       
        loginDiv.classList.add("hidden");
    
        registerDiv.classList.replace("hidden", "animate__fadeInRight");
      }, { once: true }); 
    
    });
    
goToLoginBtn.addEventListener("click",()=>{

    registerDiv.classList.add("animate__fadeOutRight");
    loginDiv.classList.remove("animate__fadeOutLeft")
    registerDiv.addEventListener("animationend",()=>{
        registerDiv.classList.add("hidden");
        loginDiv.classList.replace("hidden","animate__fadeInLeft")
    },{once:true})
})



const checkAuth = () => {
    const user = localStorage.getItem('user');
    console.log(user);
    
    if (!user &&  !window.location.pathname.includes('register.html')) {
      window.location.href = 'register.html'; 
    }
  };
  
  window.addEventListener("load", checkAuth);



  function register(user,callback){

    let xhr=new XMLHttpRequest();
    xhr.open('POST','http://localhost:3001/users', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange=()=>{
        if(xhr.readyState==4)
            if(xhr.status==200)
            {
                callback(null,JSON.parse(xhr.response));

            }else{
                callback(xhr.statusText);
            }
    }
    xhr.send(JSON.stringify(user));
  }


  registerForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    let registerUser=document.querySelector("#regEmail").value;
        let password=document.querySelector("#register-password").value;
        if(validateEmail(registerUser)&&validatePassword(password))
        {

            let user = {
                email: registerUser,
                password: password
            };
    
           register(user,(error,newUser)=>{
            if(error){
                console.log(error);
                
            }else{
                // e3ml 7tet el dblock w d-none w el animation
                console.log(newUser);
                registerForm.reset();
                
            }
           }) 

        }else
        {
            if (!validateEmail(registerUser)) {
                RegisterEmailValidationSpan.classList.remove("hidden");
              }
              if (!validatePassword(password)) {
                RegisterPasswordValidationSpan.classList.remove("hidden");
              }
        }
       
    
  })


  function login(email,password,callback){
let xhr=new XMLHttpRequest();
xhr.open('GET', `http://localhost:3001/users?email=${email}&password=${password}`, true);

xhr.onreadystatechange=()=>{
    if(xhr.readyState==4)
    {
        if(xhr.status==200)
        {
            callback(null,JSON.parse(xhr.responseText))
        }else{
            callback(xhr.statusText);
        }
    }
}
xhr.send();
  };



  

loginForm.addEventListener("submit",(e)=>{
e.preventDefault();
let email=document.querySelector("#login-email").value;
    let password=document.querySelector("#login-password").value;

    if(validateEmail(email)&&validatePassword(password))
    {
        LoginEmailValidationSpan.classList.add("hidden");
        LoginPasswordValidationSpan.classList.add("hidden");
        login(email,password,(error,user)=>{
            if(error){
                alert("Login Failed")
            }else if(user.length>0){

                LoginFailSpan.classList.add("hidden");
                localStorage.setItem('user',JSON.stringify(user));


                // hena hat3ml animation w tn2el 3ala saf7et el index
                setTimeout(()=>{
                  
                    window.location.href='index.html';
                },3000)
                loader.classList.replace("hidden","animate__fadeIn")
                authSection.classList.replace("flex","hidden")
            }else{
                
                LoginFailSpan.classList.remove("hidden");
                console.log("invalid");
                
            }
    
        })

    }else{

        if (!validateEmail(email)) {
            LoginEmailValidationSpan.classList.remove("hidden");
          }
          if (!validatePassword(password)) {
            LoginPasswordValidationSpan.classList.remove("hidden");
          }
    }

    
})




function validateEmail(email){
    const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


function validatePassword(password){
    const regex=/^[A-Za-z0-9]{4,}$/;
    return regex.test(password);
}





















// registerForm.addEventListener("submit", async (e) => { 

//     e.preventDefault();

//     let registerUser=document.querySelector("#regEmail").value;
//     let password=document.querySelector("#register-password").value;
//     let user = {
//         email: registerUser,
//         password: password
//     };

//     let response=await fetch('http://localhost:3001/users', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(user)

// })
// if(response.ok)
// {
//     let newUser=await response.json();
//     console.log("user",newUser);
    
// }else
// {
//     console.log(response.statusText);
    
// }


// })

// loginForm.addEventListener('submit',async (e)=>{
//     e.preventDefault();
//     let email=document.querySelector("#login-email").value;
//     let password=document.querySelector("#login-password").value;


//     let response= await fetch(`http://localhost:3001/users?email=${email}&password=${password}`);
    
//     let user=await response.json();

//     if(user.length>0)
//     {
//         localStorage.setItem('user',JSON.stringify(user[0]));
//         window.location.href='index.html';
//     }else{
//         alert("invalid email or password")
//     }

// })











