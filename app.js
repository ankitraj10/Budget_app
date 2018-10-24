
//BUDGET CONTROLLER
var budgetController = ( function(){

var Expense = function(id,description,value){
	this.id=id;
	this.description=description;
	this.value=value;
  this.percentage =-1;
};

Expense.prototype.calcPercentage = function(totalIncome){

   if(totalIncome > 0){
  this.percentage = Math.round((this.value/totalIncome)*100);

   } else{
       
       this.percentage = -1;

   }

};

  Expense.prototype.getPercentage = function(){
   return this.percentage;
  };

var Income = function(id,description,value){
	this.id=id;
	this.description=description;
	this.value=value;
	};

	 var calculateTotal = function(type){
		var sum=0;
		data.allItem[type].forEach(function(cur){
        sum += cur.value;
      });

		data.totals[type] = sum;

		

	};

	var data = {
		allItem : {
			inc: [],
			exp: []
		},
		totals : {
			inc:0,
			exp:0
		},
		budget : 0,
		percentage : 0
	};  

	return {

		addItem: function(type,des,val){
			var newItem,ID;
			ID = 0;
            
            // creating unique id
            if(data.allItem[type].length > 0){
                ID = data.allItem[type][data.allItem[type].length - 1].id + 1;

            } else {
            	ID = 0;
            }
			
              
              //creating data on basis of 'exp' and 'inc'
			if(type === 'inc'){
				newItem = new Income(ID,des,val);
			}  if(type === 'exp'){
				newItem = new Expense(ID,des,val);
			}

			//storing data in data structure
			data.allItem[type].push(newItem);

			//returning stored data
			return newItem;

		
	},

  calculatePercentage : function(){
  data.allItem.exp.forEach(function(cur){

  cur.calcPercentage(data.totals.inc);
  });

  },

  getPercentages:function(){
    var allPer = data.allItem.exp.map(function(cur){
         return cur.getPercentage();

    });
    return allPer;
  },

	calculateBudget:function(){
     calculateTotal('inc');
     calculateTotal('exp');
     data.budget = data.totals.inc - data.totals.exp;
	data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);


	},

  deleteItem : function(type,id){
    
        var id1 = data.allItem.inc;
     var ids = data.allItem[type].map(function(current){
            return current.id;
            });

        var index = ids.indexOf(id);
        
          data.allItem[type].splice(index,1);
         
       },

	getBudget : function(){

    return {
      
      budget   : data.budget,
      totalInc : data.totals.inc,
      totalExp : data.totals.exp,
      totalPer : data.percentage
 

    }
	},

		
		testing: function(){
			console.log(data);
		}
	};





})();









// UI CONTROLLER

var UIController = ( function() {

	var DOMstring = {
                  inputType : '.add__type',
                  inputDescription : '.add__description',
                  inputValue : '.add__value',
                  inputButton :'.add__btn',
                  incomeList:'.income__list',
                  expenseList:'.expenses__list',
                  budgetLabel:'.budget__value',
                  incomeLabel:'.budget__income--value',
                  expenseLabel:'.budget__expenses--value',
                  percentageLabel:'.budget__expenses--percentage',
                  container:'.container',
                  percentLabel :'.item__percentage',
                  dateLabel : '.budget__title--month'
  	};

      
        var formatNumber=function(num,type){
    num = Math.abs(num);
    num = num.toFixed(2);
    var numSplit = num.split('.');
    var int = numSplit[0];

    if(int.length > 3){
      int = int.substr(0,int.length-3) + ',' + int.substr(int.length-3,3);
    }
    var dec = numSplit[1];

    return (type === 'exp' ? '-':'+') + ' ' +int + '.' + dec;

    };


       


  return {
  	
    	getInput: function(){
       
                         return{
 
                                type : document.querySelector(DOMstring.inputType).value,
                                description: document.querySelector(DOMstring.inputDescription).value,
                                value: parseFloat(document.querySelector(DOMstring.inputValue).value)
                               };
                             },

addListItem: function(obj,type){
              var html,newhtml,element;
			// create some HTML placeholder
			if(type === 'inc'){

				element = DOMstring.incomeList;

				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
  
      } 

           if(type === 'exp'){

          	 element = DOMstring.expenseList;

html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

                           

        
          }

			//replace place holder bwith actual data
            newhtml = html.replace('%id%',obj.id);
            newhtml = newhtml.replace('%description%',obj.description);
            newhtml = newhtml.replace('%value%',formatNumber( obj.value,type));


			//insert HTML into DOM

             document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);

		},
		   clearField:function(){
          var field,fieldArr;

          field = document.querySelectorAll(DOMstring.inputDescription + ',' + DOMstring.inputValue);

          fieldArr = Array.prototype.slice.call(field);

          fieldArr.forEach(function(current,index,array){
          current.value = "";

          });

		   },
        deleteListItem:function(selectId){
  var el = document.getElementById(selectId);
     el.parentNode.removeChild(el);

       },

		   displayBudget: function(obj){
     var type;
     obj.budget > 0 ? type = 'inc': type = 'exp;'
           document.querySelector(DOMstring.budgetLabel).textContent =formatNumber(obj.budget,type);
           document.querySelector(DOMstring.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
           document.querySelector(DOMstring.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
           
           if(obj.totalPer > 0){
          document.querySelector(DOMstring.percentageLabel).textContent = obj.totalPer + '%';


           }
           else
           {
           	document.querySelector(DOMstring.percentageLabel).textContent = '--';

           }
		   },

       displayDate:function(){
  var now,months,year,month;

   now = new Date();
 
  year = now.getFullYear();
  month= now.getMonth();
  months = ['Jan', 'Feb','March','April','May','June','July','August','September','October','November','December'];
  document.querySelector(DOMstring.dateLabel).textContent = months[month] + ' ' + year;

       },

       displayPercentage: function(percentage){

        var fields = document.querySelectorAll(DOMstring.percentLabel);
      var nodeListPercentage = function(list,callback){

       for(var i=0;i < list.length;i++){
        callback(list[i],i);
       }
      };

      nodeListPercentage(fields,function(current,index) {
       if(percentage[index] > 0){

        current.textContent = percentage[index] + '%';
       } else{
        current.textContent = '---';
       }

      });


       },

    

      

       




       
                        

                             getDOMstring : function(){
                             	return DOMstring;
                             }

          };

})();









// GLOBAL APP CONTROLLER 

var controller = ( function(budgetctrl,UIctrl) {
	


	var setupEventListeners = function(){
		var DOM = UIctrl.getDOMstring();

     document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);


      document.addEventListener('keypress' ,function(even){
        if(even.keycode === 13 ||even.which === 13){

	    ctrlAddItem();
  }
  });
      document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);


	};

	var updateBudget = function(){

		// calculate budget
           budgetctrl.calculateBudget();
		// return budget
       var budget = budgetctrl.getBudget();
		// display budget on UI
        UIctrl.displayBudget(budget);

	};

  var ctrlDeleteItem = function(event){
    var itemId= event.target.parentNode.parentNode.parentNode.parentNode.id;
if(itemId){
    var item1 = itemId.split('-');
     var type = item1[0];
     var ID = parseInt(item1[1]);
      //update budget
     
    budgetctrl.deleteItem(type,ID);

    UIctrl.deleteListItem(itemId);
    updateBudget();
}
  };

  var updatePercentages = function(){

    budgetctrl.calculatePercentage();
    var percentages=budgetctrl.getPercentages();
    UIctrl.displayPercentage(percentages);

  };


	var ctrlAddItem = function() {

		var input,newItem;

		// get field input data

		input = UIctrl.getInput();

		if(input.description !== "" && !isNaN(input.value) && input.value > 0){


      // Add iotem to budget controller
         newItem = budgetctrl.addItem(input.type,input.description,input.value);



       // Add item to ui controller
        UIctrl.addListItem(newItem , input.type);

        //clear field
        UIctrl.clearField();


       // calculate budget
       updateBudget();

   updatePercentages();
       // display item to UI controller


		}


       
     };
  return {
      init:function(){
        UIctrl.displayDate();
      	UIctrl.displayBudget({
            
      budget   : 0,
      totalInc : 0,
      totalExp : 0,
      totalPer : -1
 


      	});
        setupEventListeners();
      }

  }


})(budgetController,UIController);


controller.init();


  