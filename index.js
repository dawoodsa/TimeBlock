var timeController = (function(){
    var item = function(id , title , from , to , color,duration){
        this.id = id;
        this.title = title;
        this.from = from;
        this.to = to;
        this.color = color;
        this.duration = duration;
    }
    var data = {
        allItems:[],
        totalDuration:0,
    }
    return{
        addItem:function(title , from , to , color){
            var newFrom , newTo , x, y,ID,duration,newItem;
            //ID calculations
            if(data.allItems.length >0){
                 ID = data.allItems[data.allItems.length-1].id+1;
            }else{
                 ID = 1;
            }
            
            
            //Duration calculations
            newFrom = from.split(':');
            newTo = to.split(':');
            x = newTo[0] - newFrom[0];
            y = newTo[1] - newFrom[1];
            duration = x*60 + y;
            
            
            //RETURING THE NEW ITEMS
            newItem = new item(ID,title,from,to, color,duration);
            data.allItems.push(newItem);
            return newItem;
        },
        delItem:function(ID){
            data.allItems.forEach(function(cur,index){
            if(cur.id === ID){
                data.allItems.splice(index,1);
                data.totalDuration -= cur.duration;
                }
            })
        },
        totalDuration:function(duration){
            data.totalDuration += duration;
            return  data.totalDuration; 
        },
        test:function(){
            console.log(data);
        }
    }
})();

var UIController = (function(){
    var DomString={
        row:'.row',
        addButton:'#submit',
        delButton:'.col__delete',
        timeFrom: '.form1__input-time--from',
        timeTo: '.form1__input-time--to',
        inputTitle: '.form1__input--title',
        inputColor: '.form1__input--color',
        totalDuration:'.total-duration',
        month:'.month',
        date:'.date',
    };

    var calcWidth = function(duration){
        var width = (duration/60) * 100;
        if(width > 100){
            width = 100;
        }
       return parseInt(width);
    }
    
   
    return{
        Dom:function(){
            return DomString;
        },
        getInputValues:function(){
            return{
            inputTitle:document.querySelector(DomString.inputTitle).value,
            timeFrom:document.querySelector(DomString.timeFrom).value,
            timeTo:document.querySelector(DomString.timeTo).value,
            inputColor:document.querySelector(DomString.inputColor).value,
            }
        },
         calcDuration : function(from , to){
            
            //return the duration
            return duration;
        },

        addItem:function(obj,duration){
            var html , newHtml;
            //THE HTML;
            html = '<div class="col" id="%id%" style="width:%width%"><div class="time-box"><div class="col__time">%from%-%to%</div><div class="col__min">%duration%m</div></div><button class="col__button"><span class="col__delete icon-plus"></span></button><div class="col__name">%title%</div></div>';
            //CALC WIDTH METHOD;
            var width = calcWidth(obj.duration);
            //REPLACE THE PLACEHOLDER;
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%from%',obj.from);
            newHtml = newHtml.replace('%to%', obj.to);
            newHtml = newHtml.replace('%duration%' , obj.duration);
            newHtml = newHtml.replace('%title%', obj.title);
            newHtml = newHtml.replace('%width%',width+'%')
            //FINALLY ADD THE TASK;
            document.querySelector(DomString.row).insertAdjacentHTML('beforeend',newHtml);
            //CHANGE COLOR;
            document.getElementById(obj.id).style.backgroundColor = obj.color;
            return newHtml;
        },
        delItem:function(id){
            var element = document.getElementById(id);
            element.parentNode.removeChild(element);
        },
        displayTotalDuration:function(totalDuration){
            document.querySelector(DomString.totalDuration).textContent = totalDuration + 'min';
            
        },
        initMin:function(inputF,inputT, min){
            var iF,iT,mi,f,t,m;
            iF = inputF.split(':');
            iT = inputT.split(':');
            mi = min.split(':');
            
            f = iF[0] + iF[1];
            t = iT[0] + iT[1];
            m = mi[0] + mi[1];
            
            
            
            if(f > m && t > m){
                return true;
            }else{
                return false;
            }
        },
        setDate:function(){
            var date = new Date();
            var dateDay = date.getDay();
            var days =  ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            document.querySelector(DomString.month).textContent = days[dateDay];
    
        },
        resetInputs:function(){
            document.querySelector(DomString.inputTitle).value = '';
            document.querySelector(DomString.timeFrom).value ='';
            document.querySelector(DomString.timeTo).value = '';
        }
            
    }
    
    
})();

var controller = (function(timeCtrl , UICtrl){
        var DomString = UICtrl.Dom();
        var minTime = '0:00';
    
        var setUpEventListeners = function(){
            document.querySelector(DomString.addButton).addEventListener('click',addTask);
            document.querySelector(DomString.row).addEventListener('click',delTask);
        }
           
         
        function addTask(){
            //1.get input;
            var input = UICtrl.getInputValues();
            if(UICtrl.initMin(input.timeFrom,input.timeTo,minTime) === true && input.timeFrom !== input.timeTo){
            //2.add item the time controller;
            var item = timeCtrl.addItem(input.inputTitle , input.timeFrom, input.timeTo, input.inputColor);
            timeCtrl.test();
            //2.addItem to the UIController;
            var html = UICtrl.addItem(item);
            //3.add the duration
            var totalDuration = timeCtrl.totalDuration(item.duration);
            UICtrl.displayTotalDuration(totalDuration);
            //4.update the minimum time;
            minTime = item.to;
            //clear input fields
            UICtrl.resetInputs();
            }else{
             alert('something is wrong with the input');
            }
        }
        
        function delTask(event){
            //1.get the id ;
                var id = event.target.parentNode.parentNode.id;
                if(id){
                    var input = UICtrl.getInputValues();
                    //delete from the data object;
                    timeCtrl.delItem(parseInt(id));
                    timeCtrl.test();
                    //delete from the UI;
                    UICtrl.delItem(id);
                    //update the duration;
                    var totalDuration = timeCtrl.totalDuration(0);
                    UICtrl.displayTotalDuration(totalDuration);
                    //update the minimum time input;
                    minTime = '0:00';
                    //clear input fields
                    UICtrl.resetInputs();
            }
               
            }
            
    
    return{
        init:function(){
            UICtrl.setDate();
            setUpEventListeners();
        }
    }
})(timeController, UIController);
//initialization function invoked;
controller.init();