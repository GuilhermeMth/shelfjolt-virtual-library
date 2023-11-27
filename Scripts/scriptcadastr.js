//variaveis
let btn = document.querySelector("#versenha");
let btnconfirm = document.querySelector("#verconfirmsenha");

let nome = document.querySelector("#nome");
let labelnome = document.querySelector("#labelnome");
let validNome = false;

let usuario = document.querySelector("#usuario");
let labelusuario = document.querySelector("#labelusuario");
let validUsuario = false;

let senha = document.querySelector("#senha");
let labelsenha = document.querySelector("#labelsenha");
let validSenha = false;

let confirmsenha = document.querySelector("#confirmsenha");
let labelconfirmsenha = document.querySelector("#labelconfirmsenha");
let validConfirmSenha = false;

let msgError = document.querySelector("#msgError");
let msgSuccess = document.querySelector("#msgSuccess");

nome.addEventListener("keyup", () => {
  if (nome.value.length <= 6) {
    labelnome.setAttribute("style", "color: red");
    labelnome.innerHTML = "Matricula *Insira um numero de matricula valido";
    nome.setAttribute("style", "border-color: red");
    validNome = false;
  } else {
    labelnome.setAttribute("style", "color: green");
    labelnome.innerHTML = "Nome";
    nome.setAttribute("style", "border-color: green");
    validNome = true;
  }
});

usuario.addEventListener("keyup", () => {
  if (usuario.value.length <= 4) {
    labelusuario.setAttribute("style", "color: red");
    labelusuario.innerHTML = "Usuario *Insira no minimo 5 caracteres";
    usuario.setAttribute("style", "border-color: red");
    validUsuario = false;
  } else {
    labelusuario.setAttribute("style", "color: green");
    labelusuario.innerHTML = "Usuário";
    usuario.setAttribute("style", "border-color: green");
    validUsuario = true;
  }
});

senha.addEventListener("keyup", () => {
  if (senha.value.length <= 5) {
    labelsenha.setAttribute("style", "color: red");
    labelsenha.innerHTML = "Senha *Insira no minimo 6 caracteres";
    senha.setAttribute("style", "border-color: red");
    validSenha = false;
  } else {
    labelsenha.setAttribute("style", "color: green");
    labelsenha.innerHTML = "Senha";
    senha.setAttribute("style", "border-color: green");
    validSenha = true;
  }
});

confirmsenha.addEventListener("keyup", () => {
  if (senha.value != confirmsenha.value) {
    labelconfirmsenha.setAttribute("style", "color: red");
    labelconfirmsenha.innerHTML = "Confirmar Senha *As senhas não conferem";
    confirmSenha.setAttribute("style", "border-color: red");
    validConfirmSenha = false;
  } else {
    labelconfirmsenha.setAttribute("style", "color: green");
    labelconfirmsenha.innerHTML = "Confirmar Senha";
    confirmsenha.setAttribute("style", "border-color: green");
    validConfirmSenha = true;
  }
});

function cadastrar() {
  if (validNome && validUsuario && validSenha && validConfirmSenha) {
    let listaUser = JSON.parse(localStorage.getItem("listaUser") || "[]");

    listaUser.push({
      nomeCad: nome.value,
      userCad: usuario.value,
      senhaCad: senha.value,
    });

    localStorage.setItem("listaUser", JSON.stringify(listaUser));

    msgSuccess.setAttribute("style", "display: block");
    msgSuccess.innerHTML = "<strong>Cadastrando usuário...</strong>";
    msgError.setAttribute("style", "display: none");
    msgError.innerHTML = "";

    setTimeout(() => {
      window.location.href = "Login.html";
    }, 3000);
  } else {
    msgError.setAttribute("style", "display: block");
    msgError.innerHTML =
      "<p>Preencha todos <br> os campos corretamente  <br> antes de cadastrar</p>";
    msgSuccess.innerHTML = "";
    msgSuccess.setAttribute("style", "display: none");
  }
}

btn.addEventListener("click", () => {
  let inputsenha = document.querySelector("#senha");

  if (inputsenha.getAttribute("type") == "password") {
    inputsenha.setAttribute("type", "text");
  } else {
    inputsenha.setAttribute("type", "password");
  }
});
btnconfirm.addEventListener("click", () => {
  let inputconfirmsenha = document.querySelector("#confirmsenha");

  if (inputconfirmsenha.getAttribute("type") == "password") {
    inputconfirmsenha.setAttribute("type", "text");
  } else {
    inputconfirmsenha.setAttribute("type", "password");
  }
});
