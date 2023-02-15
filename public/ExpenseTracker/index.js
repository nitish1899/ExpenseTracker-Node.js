const token = localStorage.getItem('token'); 
//const pagination = document.getElementById('pagination');
const pagination= document.createElement('div');
document.body.appendChild(pagination);
const ShowItems =  document.getElementById('Item_Per_Page');
ShowItems.onchange = ShowPerPage;
var itemPerPage =2;
const ItemPerPage = localStorage.getItem('ItemPerPage');

function ShowPerPage(){
  itemPerPage = Number(this.value);
  localStorage.setItem('ItemPerPage',itemPerPage);
}

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

function showPagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage,
}) {
 
 
  if(hasPreviousPage){
    const btn2 = document.createElement('button')
    btn2.innerHTML = previousPage
    btn2.addEventListener('click', () => getExpenses(previousPage))
    pagination.appendChild(btn2)
  }

  const btn1 = document.createElement('button')
  btn1.innerHTML = `<h3>${currentPage}</h3>`
  btn1.addEventListener('click', () => getExpenses(currentPage))
  pagination.appendChild(btn1)

 if(hasNextPage) { 
    const btn3 = document.createElement('button')
    btn3.innerHTML = nextPage
    btn3.addEventListener('click', () => getExpenses(nextPage))
    pagination.appendChild(btn3)
 }
}

function getExpenses(page){
   console.log('ItemPerPage  is : ',`${ItemPerPage}`);
  // &itemPerPage=${ItemPerPage}  http://localhost
       axios
             .get(`http://localhost:3000/expense/get-expense?page=${page}&itemPerPage=${ItemPerPage}`, { headers: {"Authorization" : token}})
             .then((response) => {
              pagination.innerHTML = '';
              showPagination(response.data);
              const parentNode=document.getElementById('listOfExpenses');
              parentNode.innerHTML='';
              if(response.status === 200){
                for(var i=0;i<response.data.AllExpenses.length;i++){
                  addNewExpensetoUI(response.data.AllExpenses[i]);
                }
              } 
             })
             .catch((err) => console.log(err));
}

window.addEventListener("load",()=>{
const Get = async () => {
        const page = 1; // &itemPerPage=${itemPerPage}
        const response = await axios.get(`http://localhost:3000/expense/get-expense?page=${page}&itemPerPage=${ItemPerPage}`, { headers: {"Authorization" : token}});
        console.log("Nitish this is response\n");
        const isPremium = response.data.isPremiumUser == null ? false : true;
        if(isPremium){
          document.getElementById('rzp-button1').style.display="none";
          document.getElementById('premiumUser').innerHTML+="You are a premium user  <button onclick=showPremiumFeatures() >Show Leaderboard</button>";
          document.getElementById('downloadexpense').innerHTML+="<button onclick=download()>Download File</button>";
          document.getElementById('urlTable').innerHTML+="<button onclick=showUrlTable()>Recent Downloads</button>";
        }
        showPagination(response.data);
        if(response.status === 200){
          for(var i=0;i<response.data.AllExpenses.length;i++){
            addNewExpensetoUI(response.data.AllExpenses[i]);
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

function showListOfUrl(url){
  const parentNode=document.getElementById('listOfURL');
  const children=`<li id="${url}"> url : ${url}</li>`;// unique id for li tag is necessary
  parentNode.innerHTML=parentNode.innerHTML+children;
}

function download(){
  axios.get('http://localhost:3000/expense/download',{ headers: {"Authorization" : token} })
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

function showUrlTable(){
  //const page =1;
  //axios.get(`http://localhost:3000/expense/urlTable?page=${page}`,{ headers: {"Authorization" : token} })
  //showPagination(response.data);
  axios.get(`http://localhost:3000/expense/urlTable`,{ headers: {"Authorization" : token} })
  .then((response) => {
    if(response.status === 201) { // UrlList
      document.getElementById('UrlList').innerHTML += 'URL Lists';
      for(var i=0;i<response.data.response.length;i++){
         showListOfUrl(response.data.response[i].fileUrl);
      }
    } else {
      throw new Error(response.data.message)
    }
  })
  .catch((err) => {
    showError(err);
  });
}

async function showPremiumFeatures(){
  // const page = 1;
  // const response = await axios.get(`http://localhost:3000/premium/showLeaderBoard?page=${page}`, { headers: {"Authorization" : token}});
  // showPagination(response.data);
  const response = await axios.get(`http://localhost:3000/premium/showLeaderBoard`, { headers: {"Authorization" : token}});
  document.getElementById('Leaderboard').innerHTML+=`<h1> Leaderboard <h1>`;

  for(var i=0;i<response.data.length;i++){
      console.log(response.data[i].name,response.data[i].amount);
      showLeaderBoard(response.data[i].name,response.data[i].amount);
  }
}

document.getElementById('rzp-button1').onclick = async function(e) {
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
            document.getElementById('downloadexpense').innerHTML+="<button onclick=download()>Download File</button>";
            document.getElementById('urlTable').innerHTML+="<button onclick=showUrlTable()>Recent Downloads</button>";
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