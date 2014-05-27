define(function () {
 
    return {
            set: function(date,type,status){
                $.ajax({
                    type: 'POST',
                    url : '/restaurant',
                    data: 'date='+date+'&type='+type+'&status='+status
                });
            }
    }
});