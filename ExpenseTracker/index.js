let form=document.getElementById('formItem'); 
form.addEventListener('submit',function(event){
  event.preventDefault()// prevent the form fromautosubmitting
     const amount=event.target.ExpanseAmount.value;
     const items=event.target.Description.value;
     const catg=event.target.Category.value;
 // const {ExpanseAmount, Description, Category} = event.target.value;
     
    // Storing Objects
        let myObj={
          amount:amount,
          description:items,
          category:catg
        };
        
        const Post = async () => {
        try{  
          const token = localStorage.getItem('token');  
        const response = await axios.post("http://localhost:3000/expense/add-expense",myObj, { headers: {"Authorization" : token}});
        console.log(response);
        showsNewUserOnScreen(response.data.addedExpense);
        } catch(err){
          console.log(err);
        }
        }
        Post();  
})

function showsNewUserOnScreen(user){
document.getElementById('ExpanseAmount').value="";
document.getElementById('Description').value="";

const parentNode=document.getElementById('listOfUsers');
const children=`<li id="${user.description}"> ${user.amount}-${user.description}-${user.category}
                <button onclick=deleteUser('${user.description}','${user.id}')>DeleteExpense</button> 
                <button onclick=editUser('${user.amount}','${user.description}','${user.id}')>EditExpense</button> 
                </li>`;
parentNode.innerHTML=children+parentNode.innerHTML;
}

//deleteUser
function deleteUser(Description,objid){
const token = localStorage.getItem('token');
   removeUserFromScreen(Description);
   const Delete = async () => {
        const response = await axios.delete(`http://localhost:3000/expense/delete-expense/${objid}`, { headers: {"Authorization" : token}});
        console.log(response);
        }
    Delete();
}

//editUser
function editUser(amount,Description,objid){
  document.getElementById('ExpanseAmount').value=amount;
  document.getElementById('Description').value=Description;
  deleteUser(Description,objid);
}

function  removeUserFromScreen(Description){
const parentNode=document.getElementById('listOfUsers');
const childNodeToBeDeleted=document.getElementById(Description);
if(childNodeToBeDeleted){
  parentNode.removeChild(childNodeToBeDeleted);
}
}

window.addEventListener("DOMContentLoaded",()=>{
const token = localStorage.getItem('token');
const Get = async () => {
        const response = await axios.get("http://localhost:3000/expense/get-expense", { headers: {"Authorization" : token}});
        console.log("Nitish this is response\n");
        for(var i=0;i<response.data.AllExpenses.length;i++){
          showsNewUserOnScreen(response.data.AllExpenses[i]);
        }
}
Get();
})

document.getElementById('rzp-button1').onclick = async function(e) {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token}});
    console.log(response);
    var options = {
        "key": response.data.key_id,// enter the key id generated from Dashboard 
        "order_id": response.data.order.id, // for one time payment
        // this handler function will handle the success payment
        "handler": async function(response){
            await axios.post('http://localhost:3000/purchase/updatetransactionstatusSuccess', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: {"Authorization" : token} })

            alert('You are a Premier User Now');
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', async function (response) {
      console.log(response);
      await axios.post('http://localhost:3000/purchase/updatetransactionstatusFail', {
                order_id: options.order_id,
            }, { headers: {"Authorization" : token} })
      alert('Transaction Failed');
    })
}