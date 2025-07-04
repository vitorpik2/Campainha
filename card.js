let ultimaMensagem = 0;

function atualizarCard() {
  const dados = localStorage.getItem("campainha");
  if (!dados) return;

  const { nome, mensagem, imagem, data } = JSON.parse(dados);

  if (data > ultimaMensagem) {
    ultimaMensagem = data;

    document.getElementById("notificacao").innerHTML = `
          <div class="card">
          <h1>Esta tocando sua campainha!</h1>
            <img src="${imagem}" class="photo" />
            <h3>${nome}</h3>
            <p>${mensagem}</p>
          </div>
        `;
  }
}

// Verifica a cada 1 segundo
setInterval(atualizarCard, 1000);