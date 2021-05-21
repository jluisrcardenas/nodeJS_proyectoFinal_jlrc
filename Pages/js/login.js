$(document).ready(init);

function init(){
    if(!localStorage.getItem("token")){
        $("#login").click(login);
    }else{
        window.location.href = "admin.html";
    }
}

function login(){
    if (!$("#login-Form")[0].checkValidity()) {
        alert("Completa correctamente todos los campos");
        return;
    }

    var mail =$("#input-mail").val();
    var pass= $("#input-password").val();

    axios({
        method: 'post',
        url: url + '/user/login',
        data: {
            user_mail: mail,
            user_password: pass
        }
    }).then(function(response){
        console.log(response);
        if(response.data.code === 200){
            localStorage.setItem("token",response.data.message);
            window.location.href = 'admin.html';
        }else{
            alert("Usuario y/o contraseña incorrectos");
        }
    }).catch(function(response){
        console.log(response);
    });
};