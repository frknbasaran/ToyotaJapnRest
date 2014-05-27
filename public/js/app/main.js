define(["update","restaurant","reservation","user","validate","../libs/jquery","../libs/jquery.slimscroll","../libs/jquery-ui","../libs/semantic"],function (update,restaurant,reservation,user,validate,jquery,slimscroll,ui,semantic) {
    
    // calendar regional settings
    $.datepicker.regional['tr'] = {
                closeText: 'kapat',
                prevText: '&#x3c;geri',
                nextText: 'ileri&#x3e',
                currentText: 'bugün',
                monthNames: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
                'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
                monthNamesShort: ['Oca','Şub','Mar','Nis','May','Haz',
                'Tem','Ağu','Eyl','Eki','Kas','Ara'],
                dayNames: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
                dayNamesShort: ['Pz','Pt','Sa','Ça','Pe','Cu','Ct'],
                dayNamesMin: ['Pz','Pt','Sa','Ça','Pe','Cu','Ct'],
                weekHeader: 'Hf',
                dateFormat: 'dd.mm.yy',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: ''};
        $.datepicker.setDefaults($.datepicker.regional['tr']);
    
    // user login 
    $('.loginButton').click(function(){
        if(!validate.isEmpty($('#username').val()) && !validate.isEmpty($('#password').val())){
            user.login($('#username').val(),$('#password').val());
        }else{
            $('.error').css('display','block').html('Tüm alanları doldurun');
        }
    });
    
    // handle enter button to login
    $('#password').keypress(function(e){
        if(e.which == 13){
            if(!validate.isEmpty($('#username').val()) && !validate.isEmpty($('#password').val())){
                user.login($('#username').val(),$('#password').val());
            }else{
                $('.error').css('display','block').html('Tüm alanları doldurun');
            }
        }
    }); 
    
    $('.query-view').slimScroll({
        height : "400px"
    });

  

    
    // add new user
    $('.addNewUser').click(function(){
        if(!validate.isEmpty($('#username').val()) && !validate.isEmpty($('#password').val()) && !validate.isEmpty($('#email').val()) && !validate.isEmpty($('#name').val())){
            if(validate.isEmail($('#email').val())){
                user.addUser($('#username').val(),$('#password').val(),$('#email').val(),$('#name').val(),$('#auth').val());
            }else{
                $('.error').css('display','block').html('Geçersiz e-posta adresi');
            }
        }else{
            $('.error').css('display','block').html('Tüm alanları doldurun');
        }
    });
    
    // edit user routing from editButton
    $('.editUser').click(function(){
        var id = $(this).attr('data-id');
        window.location="../edit-user/"+id;
    });
    
    // user delete dialog and send ajax post request
    $('.deleteUser').click(function(){
        var id = $(this).attr('data-id');
        $('.askModal').modal('show');
        $('.deleteOk').click(function(){
            user.deleteUser(id);    
        });
    });
    
    /* update user informations
    $('.updateUser').click(function(){
        if(!validate.isEmpty($('#username').val()) && !validate.isEmpty($('#password').val()) && !validate.isEmpty($('#email').val()) && !validate.isEmpty($('#name').val())){
            if(validate.isEmail($('#email').val())){
                user.updateUser($('#username').val(),$('#password').val(),$('#email').val(),$('#name').val(),$('#auth').val());
            }else{
                $('.error').css('display','block').html('Geçersiz e-posta adresi');
            }
        }else{
            $('.error').css('display','block').html('Tüm alanları doldurun');
        }
    });
    */
    
    // update password from user panel
    $('.updatePassword').click(function(){
        if(!validate.isEmpty($('#old').val()) && !validate.isEmpty($('#new').val()) && !validate.isEmpty($('#new2').val())){
            if(validate.isEqual($('#new').val(),$('#new2').val())){
                update.updatePass($('#old').val(),$('#new').val());
            }else{
                $('.notify p').html('Parolalar eşleşmiyor');
                $('.notify').css('display','block');
            }
        }else{
                $('.notify p').html('Tüm alanları doldurun');
                $('.notify').css('display','block');
        }
    });
    
    // update email address from user panel
    $('.updateEmail').click(function(){
        if(!validate.isEmpty($('#newMail').val()) && !validate.isEmpty($('#pass1').val()) && !validate.isEmpty($('#pass2').val())){
            if(validate.isEqual($('#pass1').val(),$('#pass2').val())){
                    if(validate.isEmail($('#newEmail').val())){
                        update.updateEmail($('#pass1').val(),$('#newEmail').val());    
                    }else{
                        $('.notify p').html('Geçersiz e-posta adresi');
                        $('.notify').css('display','block');
                    }
            }else{
                $('.notify p').html('Parolalar eşleşmiyor');
                $('.notify').css('display','block');
            }
        }else{
                $('.notify p').html('Tüm alanları doldurun');
                $('.notify').css('display','block');
        }
    });
    
    $('body').on('click','.setRestaurant',function(){
        var date = $(this).attr('data-date');
        var type = $(this).attr('data-type');
        if($(this).attr("checked")) restaurant.set(date,type,1);
        else restaurant.set(date,type,0);
    });
    
    $('body').on('click','.setReservation',function(){
        var date = $(this).attr('data-date');
        var type = $(this).attr('data-type');
        if($(this).attr("checked")) reservation.add(date,type);
        else reservation.del(date,type);
    });
    
    $('body').on('click','.smiley',function(){
        var date = $(this).attr('data-date');
        var type = $(this).attr('data-type');
        reservation.show(date,type);
        
    });
    
    $('.datepicker').datepicker();
    
    
    // autocomplete username input on reservation query window
    
    $('.username').autocomplete({
        source: function (request, response) {
        $.getJSON("http://localhost:5454/userlist/"+$('.username').val(), function (data) {
            response($.map(data, function (value, key) {
                return {
                    label: value.name+' / '+value.username,
                    value: value.username
                };
            }));
        })},
        minLength: 1,
        delay: 100
    });
    
    // query event handler
    
    $('.query').click(function(){
        var user  = $('.username').val();
        if(!validate.isEmpty($('.start').val()) && !validate.isEmpty($('.end').val())){
            var start = validate.convertDate($('.start').val());
            var end   = validate.convertDate($('.end').val());
            if(!validate.isEmpty(user)) reservation.queryByUser(user,start,end);
            else reservation.query(start,end);    
        }else{
            $('.notifyModal').modal('show');
        }
    });
    
    $('.dropdown').dropdown({on:'hover'});
    
    // show upload status
    var showInfo = function(message,status) {
        if(status>0){
            $('div.progress').hide();
            $('.message').removeClass('red').addClass('green').text(message);
            $('.message').show();
        }else{
            $('div.progress').hide();
            $('.message').removeClass('green').addClass('red').text(message);
            $('.message').show();
        }
        
    };
    
    
    $('.reservationQueryButton').click(function(){
        var user  = $('.username').val();
        if(!validate.isEmpty($('.date').val()) && !validate.isEmpty($('.username').val())){
            var date = validate.dateConverter($('.date').val());
            reservation.reservationControl(user,date);
        }else{
            $('.notifyModal').modal('show');
        }
    });
    
    $('.slider').click(function(){
        var type = $(this).children().attr('class');
        var user = $(this).children().attr('data-username');
        var date = $(this).children().attr('data-date');
        var fullName = $(this).children().attr('data-fullname');
        if($(this).children().attr('checked')) reservation.delByUser(date,type,user);
        else reservation.addWithUser(user,fullName,date,type);
    });
    
    // menu file upload button clicked event handler
    $('.uploadMenu').on('click', function(evt) {
        if(document.getElementById('menuFile').files[0]){
            evt.preventDefault();
            $('div.progress').show();

            var formData = new FormData();
            var file = document.getElementById('menuFile').files[0];
            var type = 1;
            
            formData.append('myFile', file);
            formData.append('type',type);

            var xhr = new XMLHttpRequest();

            xhr.open('post', '/upload', true);

            xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    var percentage = (e.loaded / e.total) * 100;
                    $('div.progress div.bar').css('width', percentage + '%');
                }
            };

            xhr.onerror = function(e) {
              showInfo('Yükleme sırasında hata');
            };

            xhr.onload = function() {
                switch(this.statusText){
                    case "Request Entity Too Large":
                        showInfo("Dosya boyutu 2MB'dan fazla olmamalı",0);
                        break;
                    case "OK":
                        showInfo("Menü dosyası başarıyla yüklendi",1);
                        break;
                }
            };

            xhr.send(formData);
        }else showInfo("Menü dosyası seçilmedi",0);
        

      });
    
    // help file upload button clicked event handler
    $('.uploadHelp').on('click', function(evt) {
        if(document.getElementById('helpFile').files[0]){
            evt.preventDefault();
            $('div.progress').show();

            var formData = new FormData();
            var file = document.getElementById('helpFile').files[0];
            var type = 2;
            
            formData.append('myFile', file);
            formData.append('type',type);

            var xhr = new XMLHttpRequest();

            xhr.open('post', '/upload', true);

            xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    var percentage = (e.loaded / e.total) * 100;
                    $('div.progress div.bar').css('width', percentage + '%');
                }
            };

            xhr.onload = function() {
                switch(this.statusText){
                    case "Request Entity Too Large":
                        showInfo("Dosya boyutu 2MB'dan fazla olmamalı",0);
                        break;
                    case "OK":
                        showInfo("Yardım dosyası başarıyla yüklendi",1);
                        break;
                }
            };

            xhr.send(formData);

        }
        else showInfo("Yardım dosyası seçilmedi",0);
      });
    
    $('.ui.checkbox').checkbox();
});