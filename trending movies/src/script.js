const checkAuth = () => {
    const user = localStorage.getItem('user');
    console.log(user);
    
    if (!user &&  !window.location.pathname.includes('register.html')) {
      window.location.href = 'register.html'; 
    }
  };
  
  window.addEventListener("load", checkAuth);
