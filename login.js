async function login(event) {
    try{
        event.preventDefault();
        document.getElementById('Email').value="";
        document.getElementById('Password').value="";

        const loginDetails = {
            email : event.target.email.value,
            password : event.target.password.value
        }
        
        //console.log(loginDetails);
        const response = await axios.post('http://localhost:3000/user/login',loginDetails);
        if(response.status === 201){ // redirecting the user on successful login
           // console.log(response.data.message)
           alert(response.data.message);
        //window.location.href = '../Login/login.html'
        } else if(response.status === 200){
            alert(response.data.message);
            // console.log(response);
            // document.body.innerHTML += `<div style="color:blue;">${response.data.message} </div>`;
        } else {
        throw new Error('Failed to login')
        }

    } catch(err) {
        document.body.innerHTML += `<div style="color:red;">${err} </div>`;
    }
}