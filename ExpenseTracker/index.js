const token = localStorage.getItem('token'); 

let form=document.getElementById('formItem'); 
form.addEventListener('submit',function(event){
  event.preventDefault()// prevent the form fromautosubmitting
    
        const myObj={
          amount:event.target.ExpanseAmount.value,
          description:event.target.Description.value,
          category:event.target.Category.value
        };
        
        const Post = async () => {
          try{    
          const response = await axios.post("http://localhost:3000/expense/add-expense",myObj, { headers: {"Authorization" : token}});
          console.log(response);
          addNewExpensetoUI(response.data.addedExpense);
          } catch(err){
            console.log(err);
          }
        }
        Post();  
})

function addNewExpensetoUI(expense){
// document.getElementById('ExpanseAmount').value="";
// document.getElementById('Description').value="";
const expenseElemId = `expense-${expense.id}`;

const parentNode=document.getElementById('listOfExpenses');
const children=`<li id=${expenseElemId}>
                   ${expense.amount}-${expense.description}-${expense.category}
                <button onclick=deleteExpense('${expense.id}')>DeleteExpense</button> 
                <button onclick=editExpense('${expense.amount}','${expense.description}','${expense.id}')>EditExpense</button> 
                </li>`;
parentNode.innerHTML=children+parentNode.innerHTML;
}

//deleteUser
function deleteExpense(expenseid){
   const Delete = async () => {
        const response = await axios.delete(`http://localhost:3000/expense/delete-expense/${expenseid}`, { headers: {"Authorization" : token}});
        console.log(response);
        try{
            if(response.status === 200){
              removeExpenseFromUI(expenseid);
            } else {
              throw new Error('Failed to delete');
            }
          } catch(err) { 
            showError(err);
          }
        }
    Delete();
}

function showError(err){
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

//editUser
function editExpense(amount,Description,expenseid){
  document.getElementById('ExpanseAmount').value=amount;
  document.getElementById('Description').value=Description;
  deleteExpense(expenseid);
}

function  removeExpenseFromUI(expenseid){
const parentNode=document.getElementById('listOfExpenses');
const expenseElemId = `expense-${expenseid}`;
document.getElementById(expenseElemId).remove();
}

window.addEventListener("load",()=>{
const Get = async () => {
        const response = await axios.get("http://localhost:3000/expense/get-expense", { headers: {"Authorization" : token}});
        console.log("Nitish this is response\n");
        const isPremium = response.data.isPremiumUser == null ? false : true;
        if(isPremium){
          document.getElementById('rzp-button1').style.display="none";
          document.getElementById('premiumUser').innerHTML+="You are a premium user  <button onclick=showPremiumFeatures() >Show Leaderboard</button>";
        }
        if(response.status === 200){
          for(var i=0;i<response.data.AllExpenses.length;i++){
            showsNewUserOnScreen(response.data.AllExpenses[i]);
          }
        }
}
Get();
})

function showLeaderBoard(name,amount){
    const parentNode=document.getElementById('leaderboardDetails');
    const children=`<li id="${name}"> Name : ${name} , Amount : ${amount} </li>`;// unique id for li tag is necessary
    parentNode.innerHTML=parentNode.innerHTML+children;
}

function download(){
  axios.get('http://localhost:3000/user/download',{ headers: {"Authorization" : token} })
  .then((response) => {
    if(response.status === 201) { 
      // the backend is essentially sending a downloading link
      // which will be open in browser , the file would download
      var a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = 'myexpense.csv';
      a.click();
    } else {
      throw new Error(response.data.message)
    }
  })
  .catch((err) => {
    showError(err);
  });
}

async function showPremiumFeatures(){
  const token = localStorage.getItem('token');
  const response = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: {"Authorization" : token}});
  document.getElementById('Leaderboard').innerHTML+=`<h1> Leaderboard <h1>`;

  for(var i=0;i<response.data.length;i++){
      console.log(response.data[i].name,response.data[i].amount);
      showLeaderBoard(response.data[i].name,response.data[i].amount);
  }
}

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

            document.getElementById('rzp-button1').style.display="none";
            document.getElementById('premiumUser').innerHTML+="You are a premium user  <button onclick=showPremiumFeatures() >Show Leaderboard</button>";
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