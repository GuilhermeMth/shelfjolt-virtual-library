let btn = document.querySelector(".fa-eye");

btn.addEventListener("click", () => {
  let inputsenha = document.querySelector("#senha");

  if (inputsenha.getAttribute("type") == "password") {
    inputsenha.setAttribute("type", "text");
  } else {
    inputsenha.setAttribute("type", "password");
  }
});

function entrar() {
  window.location.href = "index.html";
}
