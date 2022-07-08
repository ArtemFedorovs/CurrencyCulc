let baseCurrency= "USD";     
let calculatedCurrency= "USD";
let exchangeRate= 0;


  fetch("http://ip-api.com/json/?fields=currency")    //getting currency values for  default settings from really nice free api
    .then(response => response.json())
    .then(result => { 
      if(document.querySelector("#"+result.currency)) // checking if there is a user currency in the list
        switch (result.currency){     // applying User Default Base Currency and getting exchange rate for it
          case document.querySelector('#from').children[0].innerHTML: 
            chooseMainBaseCurrency(document.querySelector('#from').children[0]); 
            break;
          case document.querySelector('#from').children[1].innerHTML: 
            chooseMainBaseCurrency(document.querySelector('#from').children[1]); 
            break;
          case document.querySelector('#from').children[2].innerHTML: 
            chooseMainBaseCurrency(document.querySelector('#from').children[2]); 
            break;
          default:   
            document.querySelector(".js-base").innerHTML=result.currency;  
            chooseMainBaseCurrency(document.querySelector(".js-base"));
        };  
    })
    .then(() =>inputChangeBase(document.querySelector("#leftValueInput"))) // calculating value for User Default Base Currency
    .catch(error => {console.log('error', error); document.querySelector(".loader").style.display = 'none';});




function makeVisibleToogle(obj){   // making openning/closing toogle for dropdawn with extra currency options
  let isOpen=false; //default state
  return function Toogle (){ 
    isOpen?obj.style.display = 'none':obj.style.display = 'block';
    isOpen=!isOpen;
    return isOpen
  };   
}
let dropdawnToogle = makeVisibleToogle(document.querySelector(".calc__currency")) // making closure of function which povide openning/closing toogle for dropdawn with extra currency options



function ApplyBaseCurrency (){   //this 2 functions alloy to change fourth currency option to one from extra list im dropdown
  document.querySelector(".js-base").innerHTML=this.id;  //changing
  chooseMainBaseCurrency(document.querySelector(".js-base"))  //choosing new option
  dropdawnToogle();
}
function ApplyCalculatedCurrency (){
  document.querySelector(".js-culc").innerHTML=this.id;
  chooseMainCalculatedCurrency(document.querySelector(".js-culc"))
  dropdawnToogle(); 
}


function chooseBaseExtraCurrency(){//this 2 functions alloy open dropdawn to choosing extra currency options
  if (dropdawnToogle()) {
  document.querySelector(".calc__currency").childNodes.forEach(elem=>elem.childNodes.forEach(elem=>elem.removeEventListener( "click" , ApplyCalculatedCurrency)));
  document.querySelector(".calc__currency").childNodes.forEach(elem=>elem.childNodes.forEach(elem=>elem.addEventListener( "click" , ApplyBaseCurrency)));
 }
}
function chooseCalculatedExtraCurrency(){
  if (dropdawnToogle()) {
    document.querySelector(".calc__currency").childNodes.forEach(elem=>elem.childNodes.forEach(elem=>elem.removeEventListener( "click" , ApplyBaseCurrency)));
    document.querySelector(".calc__currency").childNodes.forEach(elem=>elem.childNodes.forEach(elem=>elem.addEventListener( "click" , ApplyCalculatedCurrency)));
   }
}


function chooseMainBaseCurrency(elem){  //this 2 functions alloy to make active tile with choosed currency and update ExchangeRate
  [...elem.parentNode.children].forEach(elem=>elem.classList.remove("active"));
  elem.classList.add("active");
  baseCurrency=elem.innerHTML;
  getExchangeRate();
};
function chooseMainCalculatedCurrency(elem){
  [...elem.parentNode.children].forEach(elem=>elem.classList.remove("active") );
  elem.classList.add("active");
  calculatedCurrency=elem.innerHTML;
  getExchangeRate();
};


function getExchangeRate(){  //taking it from  https://apilayer.com/marketplace/exchangerates_data-api

  var myHeaders = new Headers();
  myHeaders.append("apikey", "SNvz7iY2Dga0Ht3eJqflruEzTNVwyoMm");
  document.querySelector(".loader").style.display = 'block';
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  }; 
  fetch("https://api.apilayer.com/exchangerates_data/convert?to="+calculatedCurrency+"&from="+baseCurrency+"&amount=1", requestOptions)
    .then(response => response.json())
    .then(result => {exchangeRate=result.info.rate; document.querySelector(".loader").style.display = 'none';}) 
    .then(() => {inputChangeBase(document.querySelector("#leftValueInput"));})
    .then(() => {document.querySelector("#leftInputLabel")&&(document.querySelector("#leftInputLabel").innerHTML="1 "+ baseCurrency+" = " +round4sings(exchangeRate) +" "+calculatedCurrency);})  // changing labels under inputs
    .then(() => {document.querySelector("#rightInputLabel")&&(document.querySelector("#rightInputLabel").innerHTML="1 "+ calculatedCurrency+" = " +round4sings(1/exchangeRate) +" "+baseCurrency);}) 
    .catch(error => {console.log('error', error); document.querySelector(".loader").style.display = 'none';});

}



function inputChangeBase(target){   //function for racalculating values
  let calculatedValue=0;
  if(target.id=="leftValueInput"){
    calculatedValue=Number(target.value.split(' ').join(''));
    isNaN(calculatedValue)?(calculatedValue="Введите число"):(calculatedValue=round2sings(calculatedValue*exchangeRate));
    document.querySelector("#rightValueInput").value=calculatedValue;
  }
  else{
    calculatedValue=Number(target.value.split(' ').join(''));
    isNaN(calculatedValue)?(calculatedValue="Введите число"):(calculatedValue=round2sings(calculatedValue/exchangeRate));
    document.querySelector("#leftValueInput").value=calculatedValue; 
  }
}


function round2sings(number){    //math roud 2 signs after comma
return Math.round(number*100)/100
}

function round4sings(number){    //math roud 2 signs after comma
  return Math.round(number*10000)/10000
  }
