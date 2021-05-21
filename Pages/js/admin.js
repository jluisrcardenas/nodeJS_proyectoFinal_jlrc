$(document).ready(init);
var headers = {};

function init(){
    if(localStorage.getItem("token")){
        headers = {
            headers:{
                'Authorization' : "bearer " + localStorage.getItem("token")
            }
        }
        $("#addUser").click(verifyUser);
        $("#getUserInfo").click(getUserInfo);
        $("#saveUser").click(saveUser);
        $("#deleteUser").click(deleteUser);
        $("#searchUser").click(searchUser);
        $("#closeSession").click(closeSession);
    }else{
        window.location.href = "index.html";
    }
}

function addUser(){
    var name = $("#nombre").val();
    var lastname = $("#apellidos").val();
    var phone = $("#telefono").val();
    var mail = $("#correo").val();
    var direction = $("#direccion").val();

    axios({
        method: 'post',
        url: url + '/admin/addUser',
        data: {
            nombre: name,
            apellidos: lastname,
            telefono: phone,
            correoElectronico: mail,
            direccion: direction
        },
        headers:{
            'Authorization' : "bearer " + localStorage.getItem("token")
        }
    }).then(function(response){
        console.log(response);
        clearAddUserVals()
        alert("Registro exitoso");
        return;
    }).catch(function(response){
        console.log(response);
        alert("No se pudo crear usuario");
        return;
    });
};

function verifyUser(){
    if (!$("#addUser-form")[0].checkValidity()) {
        alert("Completa correctamente todos los campos");
        return;
    }

    var correoElectronico = $("#correo").val();
    axios.get(url + "/admin/correoElectronico/" + correoElectronico, headers)
    .then(function(res){
        console.log(res);
        alert("Ya existe un usuario con ese correo");
        return;
    }).catch(function(err){
        console.log(err);
        addUser();
        return;
    })
}

function clearAddUserVals(){
    $("#nombre").val("");
    $("#apellidos").val("");
    $("#telefono").val("");
    $("#correo").val("");
    $("#direccion").val("");
}

var getUserInfoToggle = false;
function getUserInfo(){
    if(getUserInfoToggle) return reenableSearch();
    if (!$("#getUserInfo-form")[0].checkValidity()) {
        alert("Completa todos los campos");
        return;
    }
    var correoElectronico =$("#correoEdit").val();
    axios.get(url + "/admin/correoElectronico/" + correoElectronico, headers)
    .then(function(res){
        console.log(res);
        displayInfo(res.data.message);
    }).catch(function(err){
        console.log(err);
        alert("Usuario no encontrado");
    })
}

var idEmpleado
function displayInfo(data){
    console.log(data);
    idEmpleado = data[0].pk_empleado;
    $("#nombreEdit").val(data[0].nombre).removeAttr("disabled");
    $("#apellidosEdit").val(data[0].apellidos).removeAttr("disabled");
    $("#telefonoEdit").val(data[0].telefono).removeAttr("disabled");
    toggleElement("correoEdit");
    $("#direccionEdit").val(data[0].direccion).removeAttr("disabled");
    toggleElement("saveUser");
    getUserInfoToggle = true;
}

function toggleElement(element){
    ($("#"+element).attr("disabled"))?
        $("#"+element).removeAttr("disabled"):
        $("#"+element).attr("disabled","true");
}

function reenableSearch(){
    getUserInfoToggle = false
    toggleElement("nombreEdit");
    toggleElement("apellidosEdit");
    toggleElement("telefonoEdit");
    toggleElement("correoEdit");
    toggleElement("direccionEdit");
    toggleElement("saveUser");
    $("#nombreEdit").val("");
    $("#apellidosEdit").val("");
    $("#telefonoEdit").val("");
    
    $("#direccionEdit").val("");
}

function saveUser(){
    if (!$("#getUserInfo-form")[0].checkValidity()) {
        alert("Completa todos los campos");
        return;
    }

    var name = $("#nombreEdit").val();
    var lastname = $("#apellidosEdit").val();
    var phone = $("#telefonoEdit").val();
    var mail = $("#correoEdit").val();
    var direction = $("#direccionEdit").val();

    axios({
        method: 'put',
        url: url + '/admin/saveUser',
        data: {
            pk_empleado: idEmpleado,
            nombre: name,
            apellidos: lastname,
            telefono: phone,
            correoElectronico: mail,
            direccion: direction
        },
        headers:{
            'Authorization' : "bearer " + localStorage.getItem("token")
        }
    }).then(function(response){
        console.log(response);
        reenableSearch();
        alert("Registro exitoso");
    }).catch(function(response){
        console.log(response);
        alert("Usuario no se pudo actualizar");
    });
};

function deleteUser(){
    if (!$("#deleteUser-form")[0].checkValidity()) {
        alert("Completa todos los campos");
        return;
    }
    var correoElectronico =$("#correoDelete").val();
    axios.get(url + "/admin/correoElectronico/" + correoElectronico, headers)
    .then(function(res){
        console.log(res);
        removeUser(res.data.message);
    }).catch(function(err){
        console.log(err);
        alert("Usuario no encontrado");
    })
}

function removeUser(data){
    idEmpleado = data[0].pk_empleado;
    console.log(idEmpleado);
    axios({
        method: 'delete',
        url: url + '/admin/'+idEmpleado,
        headers:{
            'Authorization' : "bearer " + localStorage.getItem("token")
        }
    }).then(function(response){
        console.log(response);
        $("#correoDelete").val("");
        alert("Registro borrado exitosamente");
    }).catch(function(response){
        console.log(response);
        $("#correoDelete").val("");
        alert("Registro no se pudo borrar");
    });
};

function searchUser(){
    if (!$("#nameSearch-form")[0].checkValidity()) {
        alert("Completa todos los campos");
        return;
    }
    var nombre = $("#nombreSearch").val();
    console.log(nombre);
    axios.get(url + "/admin/nombreSearch/" + nombre, headers)
    .then(function(res){
        console.log(res);
        displayData(res.data.message);
    }).catch(function(err){
        console.log(err);
        alert("Usuario no encontrado");
    })
}

function displayData(data){
    $("#searchedUserBody").empty();
    $("#searchedUserDiv").removeAttr("hidden");
    for(var i=0; i<data.length;i++){
        $("#searchedUserBody").append(`<p>${data[i].nombre} - ${data[i].apellidos} - ${data[i].telefono} - ${data[i].correoElectronico} - ${data[i].direccion}</p>`);
    };
    $("#nombreSearch").val("");
}

function closeSession(){
    localStorage.removeItem("token");
    window.location.href = "index.html";
}