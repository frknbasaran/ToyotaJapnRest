define(function () {
    return {
            add: function(date,type){
                var dates = date.split("-");
                for(var i=0;i<dates.length;i++) dates[i] = parseInt(dates[i]);
                if(dates[1]<10) dates[1] = "0" + dates[1];
                if(dates[0]<10) dates[0] = "0" + dates[0];
                var formattedDate = dates[0]+'-'+dates[1]+'-'+dates[2];
                $.ajax({
                    type: 'POST',
                    url : '/reservation/create',
                    data: 'dateStr='+date+'&type='+type+'&date='+formattedDate
                });
            },
            del: function(date,type){
                $.ajax({
                    type: 'POST',
                    url : '/reservation/delete',
                    data: 'date='+date+'&type='+type
                });
            },
            delByUser: function(date,type,user){
                $.ajax({
                    type: 'POST',
                    url : '/reservation/delete',
                    data: 'date='+date+'&type='+type+'&user='+user
                });
            },
            addWithUser: function(user,fullName,date,type){
                var dates = date.split("-");
                for(var i=0;i<dates.length;i++) dates[i] = parseInt(dates[i]);
                if(dates[1]<10) dates[1] = "0" + dates[1];
                if(dates[0]<10) dates[0] = "0" + dates[0];
                var formattedDate = dates[0]+'-'+dates[1]+'-'+dates[2];
                $.ajax({
                    type: 'POST',
                    url : '/reservation/create',
                    data: 'dateStr='+date+'&type='+type+'&date='+formattedDate+'&user='+user+'&fullName='+fullName
                });
            },
            show: function(date,type){
                $.ajax({
                    type: 'POST',
                    url: '/reservations',
                    data: 'date='+date+'&type='+type,
                    success: function(result){
                        $('.listModal .content tbody').empty();
                        var types = ["","Kahvalti","Ogle","Aksam"];
                        $.each(result.data,function(key,val){
                            $('.listModal .content tbody').append('<tr><td>'+val.user+'</td><td>'+types[val.type]+'</td></tr>');
                        });
                        $('.listModal').modal('show');
                    }
                });
            },
            queryByUser: function(user,start,end){
                var months = [' ','Ocak', 'Subat', 'Mart', 'Nisan','Mayis', 'Haziran', 'Temmuz', 'Agustos', 'Eylul','Ekim', 'Kasim', 'Aralik'];
                var types  = ['','Kahvalti','Ogle','Aksam'];
                $.ajax({
                    type: 'POST',
                    url : 'reservation_query',
                    data: 'user='+user+'&start='+start+'&end='+end,
                    success:function(result){
                        if(result.status=="1"){
                            $('tbody').empty();
                            $('.notify').css('display','none');
                            $.each(result.data,function(k,v){
                                var dates   = v.dateStr.split("-");
                                var dateStr = dates[2]+' '+months[dates[1]]+' '+dates[0];
                                $('tbody').append('<tr class="reservation-result-row"><td>'+dateStr+'</td><td>'+v.user+'</td><td>'+v.username+'</td><td>'+types[v.type]+'</td></tr>');
                            });
                        }else{
                            $('tbody').empty();
                            $('.notify').css('display','block');
                        }
                    }
                });
            },
            query: function(start,end){
                var months = [' ','Ocak', 'Subat', 'Mart', 'Nisan','Mayis', 'Haziran', 'Temmuz', 'Agustos', 'Eylul','Ekim', 'Kasim', 'Aralik'];
                var types  = ['','Kahvalti','Ogle','Aksam'];
                $.ajax({
                    type: 'POST',
                    url : 'reservation_query',
                    data: 'start='+start+'&end='+end,
                    success:function(result){
                        if(result.status=="1"){
                            $('tbody').empty();
                            $('.notify').css('display','none');
                            $.each(result.data,function(k,v){
                                var dates   = v.dateStr.split("-");
                                var dateStr = dates[2]+' '+months[dates[1]]+' '+dates[0];
                                $('tbody').append('<tr class="reservation-result-row"><td>'+dateStr+'</td><td>'+v.user+'</td><td>'+v.username+'</td><td>'+types[v.type]+'</td></tr>');
                            });
                        }else{
                            $('tbody').empty();
                            $('.notify').css('display','block');
                        }
                    }
                });
            },
            reservationControl: function(user,date){
                var months = [' ','Ocak', 'Subat', 'Mart', 'Nisan','Mayis', 'Haziran', 'Temmuz', 'Agustos', 'Eylul','Ekim', 'Kasim', 'Aralik'];
                var types  = ['','Kahvalti','Ogle','Aksam'];
                $.ajax({
                    type: 'POST',
                    data: 'user='+user+'&date='+date,
                    url : 'check_single_reservation',
                    success: function(result){
                        $('.result').css('display','block');
                        if(result.status==1){
                            var dates   = date.split("-");
                            var dateStr = dates[2]+' '+months[dates[1]]+' '+dates[0];
                            $('.res-date').empty().append(dateStr);
                            $.each(result.data,function(k,v){
                                $('.'+v.type).prop('checked','true');
                                $('.'+v.type).attr('data-username',v.username);
                                $('.'+v.type).attr('data-fullname',v.user);
                                $('.'+v.type).attr('data-date',v.dateStr);
                            });
                        }else{
                            var dates   = date.split("-");
                            var dateStr = dates[2]+' '+months[dates[1]]+' '+dates[0];
                            $('.res-date').empty().append(dateStr);
                            for(var i = 1; i<4; i++){
                                $('.'+i).removeAttr('checked');
                                $('.'+i).attr('data-username',user);
                                $('.'+i).attr('data-date',date);
                                $('.'+i).attr('data-fullname',result.fullname);
                            }    
                            
                        }
                    }
                });    
            }
    }
});