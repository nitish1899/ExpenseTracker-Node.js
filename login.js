async function login(event) {
    try{
        event.preventDefault();
        const loginDetails = {
            email : event.target.email.value,
            password : event.target.password.value
        }
        document.getElementById('Email').value="";
        document.getElementById('Password').value="";

        const response = await axios.post('http://localhost:3000/Login/login',loginDetails); 
        console.log(response.data.message)
        alert(response.data.message);
    } catch(err) {
        document.body.innerHTML += `<div style="color:red;">${err} </div>`;
    }
}