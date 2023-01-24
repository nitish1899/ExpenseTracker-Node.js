async function login(event) {
    try{
        event.preventDefault();
        const loginDetails = {
            email : event.target.email.value,
            password : event.target.password.value
        }
        document.getElementById('Email').value="";
        document.getElementById('Password').value="";

        const response = await axios.post('http://localhost:3000/user/login',loginDetails); 
        console.log(response.data.message)
        alert(response.data.message);
        // console.log(' ispremiumuser : ', response.data.isPremiumUser);
        // const ans = (response.data.isPremiumUser==null)? false:true;
        // localStorage.setItem('isPremiumUser', ans);
        localStorage.setItem('token', response.data.token);
        window.location.href='../ExpenseTracker/index.html';
    } catch(err) {
        document.body.innerHTML += `<div style="color:red;">${err} </div>`;
    }
}