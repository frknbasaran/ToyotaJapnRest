define(function () {
    return {
        isEmpty: function(val){
            if(val!='') return false;
            else return true;
        },
        isEqual: function(val1,val2){
            if(val1==val2) return true;
            else return false;
        },
        isEmail: function(email){
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        convertDate: function(date){
            var dates = date.split(".");
            for(var i=0;i<dates.length;i++) dates[i] = parseInt(dates[i]);
            if(dates[1]<10) dates[1] = "0" + dates[1];
            if(dates[0]<10) dates[0] = "0" + dates[0];
            return dates[2]+'-'+dates[1]+'-'+dates[0];
        },
        dateConverter: function(date){
            var dates = date.split(".");
            for(var i=0;i<dates.length;i++) dates[i] = parseInt(dates[i]);
            return dates[2]+'-'+dates[1]+'-'+dates[0];
        }
    }
});