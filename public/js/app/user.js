define(function () {
 
    return {
            addUser: function(username,password,email,name,auth){
                $.ajax({
                    type: 'POST',
                    url: '/register',
                    data: 'username='+username+'&password='+password+'&email='+email+'&name='+name+'&auth='+auth,
                    success: function(result){
                        switch(result.status){
                            case "error":
                                $('.error').css('display','block').html('Kayıt esnasında hata');
                                break;
                            case "ok":
                                window.location="/users";
                                break;
                        }
                    }
                });
            },
            
            deleteUser: function(id){
                $.ajax({
                    type: 'POST',
                    url:  '/delete-user',
                    data: 'id='+id,
                    success: function(result){
                        switch(result.status){
                            case "ok":
                                $('.notify p').html('Kullanıcı kaydı silindi');
                                $('.notify').css('display','block');
                                $('.'+id).remove();
                                break;
                            case "error":
                                $('.notify p').html('Silme sırasında hata');
                                $('.notify').css('display','block');
                                break;
                        }
                    }
                });
            },
            editUser: function(name,email,username,password,auth,id){
                $.ajax({
                    type: 'POST',
                    url: '/edit-user',
                    data: 'name='+name+'&username='+username+'&email='+email+'&password='+password+'&auth='+auth+'&id='+id,
                    success: function(result){
                        switch(result.status){
                            case "error":
                                $('.error').css('display','block').html('Güncelleme esnasında hata');
                                break;
                            case "ok":
                                window.location="/users";
                                break;
                        }
                    }
                });
            },
            login: function(username,password){
            $.ajax({
                type : 'POST',
                url: '/login',
                data: 'username='+username+'&password='+password,
                success: function(result)
                {
                    switch(result.status){
                        case "error":
                            $('.error').css('display','block').html('Bilgileri kontrol edin');
                            break;
                        case "ok":
                            window.location="/reservation";
                            break;
                    }
                }
            });
        }
    }
});