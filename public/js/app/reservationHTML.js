

function check(date,type,day,today,month,thisMonth){
        reservation_types = ['','Kahvalti','Ogle','Aksam'];
        $.ajax({
            type: 'POST',
            url : 'check_reservation',
            data: 'date='+date+'&type='+type,
            success: function(response){
                $.ajax({
                    type: 'POST',
                    url : 'restaurant_check',
                    data: 'date='+date+'&type='+type,
                    success: function(answer){
                        if((answer.result==0) || (thisMonth>month) || (today>day && thisMonth>=month)){
                            if(response.status=="1"){
                                if(response.others=="1"){
                                    $('.'+day).after('<tr class="passive"><td>'+reservation_types[type]+'</td><td></td><td><img class="smiley" data-date="'+date+'" data-type="'+type+'" src="img/Smiley.png"></td><td><input class="setReservation" data-date="'+date+'" data-type="'+type+'" type="checkbox" disabled checked></td></tr>');
                                }else{
                                    $('.'+day).after('<tr class="passive"><td>'+reservation_types[type]+'</td><td></td><td><img class="smiley" data-date="'+date+'" data-type="'+type+'" src="img/Smiley.png"></td><td><input disabled class="setReservation" data-date="'+date+'" data-type="'+type+'" type="checkbox" checked></td></tr>');
                                }
                            }else{
                                if(response.others=="1"){
                                    $('.'+day).after('<tr class="passive"><td>'+reservation_types[type]+'</td><td></td><td><img class="smiley" data-date="'+date+'" data-type="'+type+'" src="img/Smiley.png"></td><td><input class="setReservation" data-date="'+date+'" data-type="'+type+'" disabled type="checkbox"></td></tr>');
                                }else{
                                    $('.'+day).after('<tr class="passive"><td>'+reservation_types[type]+'</td><td></td><td><img class="smiley" data-date="'+date+'" data-type="'+type+'" src="img/Smiley.png" style="opacity:0"></td><td><input class="setReservation" data-date="'+date+'" data-type="'+type+'" type="checkbox" disabled></td></tr>');
                                }
                            }
                        }else{
                            if(response.status=="1"){
                                if(response.others=="1"){
                                    $('.'+day).after('<tr><td>'+reservation_types[type]+'</td><td></td><td><img class="smiley" data-date="'+date+'" data-type="'+type+'" src="img/Smiley.png"></td><td><input class="setReservation" data-date="'+date+'" data-type="'+type+'" type="checkbox" checked></td></tr>');
                                }else{
                                    $('.'+day).after('<tr><td>'+reservation_types[type]+'</td><td></td><td><img class="smiley" data-date="'+date+'" data-type="'+type+'" src="img/Smiley.png"></td><td><input class="setReservation" data-date="'+date+'" data-type="'+type+'" type="checkbox" checked></td></tr>');
                                }
                            }else{
                                if(response.others=="1"){
                                    $('.'+day).after('<tr><td>'+reservation_types[type]+'</td><td></td><td><img class="smiley" data-date="'+date+'" data-type="'+type+'" src="img/Smiley.png"></td><td><input class="setReservation" data-date="'+date+'" data-type="'+type+'" type="checkbox"></td></tr>');
                                }else{
                                    $('.'+day).after('<tr><td>'+reservation_types[type]+'</td><td></td><td><img class="smiley" data-date="'+date+'" data-type="'+type+'" src="img/Smiley.png" style="opacity:0"></td><td><input class="setReservation" data-date="'+date+'" data-type="'+type+'" type="checkbox"></td></tr>');
                                }
                            }                            
                        }
                    }
                });
            }
        });
}


// these are labels for the days of the week 
cal_days_labels = ['Paz', 'Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt'];
cal_months_labels = ['Ocak', 'Subat', 'Mart', 'Nisan','Mayis', 'Haziran', 'Temmuz', 'Agustos', 'Eylul','Ekim', 'Kasim', 'Aralik'];
cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var cal_current_date = new Date();

function Calendar(month,year){
    this.month = (isNaN(month) || month == null) ? cal_current_date.getMonth() : month;
    this.year = (isNaN(year) || year == null) ? cal_current_date.getFullYear() : year;
}

Calendar.prototype.generateHTML = function(){
    var firstDay = new Date(this.year,this.month,0);
    var startingDay = firstDay.getDay();
    var monthLength = cal_days_in_month[this.month];
    
    if(this.month == 1) {
            if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0){
                monthLength = 29;
            }
    }
    
    var cal_today_date = new Date();
    checkDay = (cal_today_date.getMonth() == this.month && cal_today_date.getFullYear() == this.year) ? true : false;
    var monthName = cal_months_labels[this.month];   
    
    var html = '<table class="calendar-table">';   
    html += '<tr class="calHeader"><th><a href="javascript:cal.prevMonth()">&#171;</a></th><th colspan="5">';   
    html +=  monthName + "&nbsp;" + this.year;   
    html += '</th><th><a href="javascript:cal.nextMonth()">&#187;</a></th></tr>';   
    html += '<tr class="calendar-header">';   
    for(var i = 0; i <= 6; i++ ){     
        html += '<td class="calendar-header-day">';     
        html += cal_days_labels[i];     
        html += '</td>';   
    }   
    html += '</tr><tr>';   
    // fill in the days   
    var day = 1;   
    // this loop is for is weeks (rows)   
    for (var i = 0; i < 9; i++) {     
        // this loop is for weekdays (cells)     
        for (var j = 0; j <= 6; j++) {
            month = this.month + 1;
            
            html += '<td class="calendar-day">';       
            if (day <= monthLength && (i > 0 || j >= startingDay)) {
                ts = this.generateTimestamp(day);         
                var today = cal_today_date.getDate();
                if (checkDay == true && day == cal_today_date.getDate()){
                    html += '<table><tr class="'+day+'"><td><a class="today" href="javascript:void(0)">' + day + '</a></td><td>&nbsp;</td><td>&nbsp;</td></tr>';
                    var tm = cal_today_date.getMonth();
                    ++tm;
                    check(this.year+'-'+month+'-'+day,1,day,today,month,tm);
                    check(this.year+'-'+month+'-'+day,2,day,today,month,tm);
                    check(this.year+'-'+month+'-'+day,3,day,today,month,tm);
                    html += '</table>';
                }
                else{ 
                    html += '<table><tr class="'+day+'"><td><a href="javascript:void(0)">' + day + '</a></td><td>&nbsp;</td></tr>';
                    var tm = cal_today_date.getMonth();
                    ++tm;
                    check(this.year+'-'+month+'-'+day,1,day,today,month,tm);
                    check(this.year+'-'+month+'-'+day,2,day,today,month,tm);
                    check(this.year+'-'+month+'-'+day,3,day,today,month,tm);
                    html += '</table>';
                    }
                day++;       
            }       
            html += '</td>';     
        }     // stop making rows if we've run out of days     
        if (day > monthLength) {       
            break;     
        }else {       
            html += '</tr><tr>';     
        }   
    }   
    // <img src="img/Smiley.png" class="smiley">
    html += '</tr></table>';   
    document.getElementById('calendar-holder').innerHTML = html; 
}

    


Calendar.prototype.generateTimestamp = function(day) {
   month = this.month + 1;   
   return "'" + day + "','" + month + "','" + this.year + "'"; 
} 

Calendar.prototype.prevMonth = function() {
   if (this.month == 0) {
      this.month = 12;     
      this.year = (this.year - 1);   
   }   
   this.month = (this.month - 1);   
   this.generateHTML(); 
}

Calendar.prototype.nextMonth = function() {
   if (this.month == 11) {     
       this.month = -1;     
       this.year = (this.year + 1);   
   }   
   this.month = (this.month + 1);   
   this.generateHTML(); 
} 

