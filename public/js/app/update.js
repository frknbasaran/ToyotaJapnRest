define(function () {
 
    return {
        
        updatePass: function(old,newPass){
                $.ajax({
                    type: 'POST',
                    url : '/updatePassword',
                    data: 'old='+old+'&newPass='+newPass,
                    success: function(result){
                        switch(result.status){
                            case "ok":
                                $('.notify p').html('Parola başarıyla güncellendi');
                                $('.notify').css('display','block');
                                break;
                            case "wrong-pass":
                                $('.notify p').html('Geçerli parola hatalı');
                                $('.notify').css('display','block');
                                break;
                            case "error":
                                $('.notify p').html('Parola güncelleme sırasında hata');
                                $('.notify').css('display','block');
                                break;
                        }
                    }
                });
        },
        updateEmail: function(pass,newEmail){
            
                $.ajax({
                    type: 'POST',
                    url : '/updateEmail',
                    data: 'pass='+pass+'&newEmail='+newEmail,
                    success: function(result){
                        switch(result.status){
                            case "ok":
                                $('.notify p').html('E-posta başarıyla güncellendi');
                                $('.notify').css('display','block');
                                break;
                            case "wrong-pass":
                                $('.notify p').html('Parola hatalı');
                                $('.notify').css('display','block');
                                break;
                            case "error":
                                $('.notify p').html('E-posta güncelleme sırasında hata');
                                $('.notify').css('display','block');
                                break;
                            case "email-used":
                                $('.notify p').html('E-posta adresi kullanılıyor');
                                $('.notify').css('display','block');
                                break;
                        }
                    }
                });
            
        }
    
    }
});