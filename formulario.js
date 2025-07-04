const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const contexto = canvas.getContext('2d');
let imagemCapturada = '';

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(erro => {
        alert('Erro ao acessar a câmera: ' + erro);
    });

function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('mensagem').value = '';
    canvas.style.display = 'none';
    imagemCapturada = '';
}

function tirarFoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
    imagemCapturada = canvas.toDataURL('image/png');
    canvas.style.display = 'none';
    alert('Foto tirada com sucesso!');
}

async function enviarFormulario() {
    const nome = document.getElementById('nome').value;
    const mensagem = document.getElementById('mensagem').value;

    if (!imagemCapturada || !nome || !mensagem) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Atualiza o card local em forma de pop-up
    const popup = document.getElementById('popup');
    const resultadoDiv = document.getElementById('resultado');

    resultadoDiv.innerHTML = `
        <h1>Sua chamada!</h1>
        <img src="${imagemCapturada}" />
        <h3>${nome}</h3>
        <p>${mensagem}</p>
    `;

    popup.classList.remove('hidden');

    // 🔔 Armazena no localStorage
    localStorage.setItem("campainha", JSON.stringify({
        nome,
        mensagem,
        imagem: imagemCapturada,
        data: Date.now()
    }));

    // Envia para o Telegram
    await enviarMensagem(nome, mensagem, imagemCapturada);
}

// fecha o pop-up
function fecharPopup() {
    document.getElementById('popup').classList.add('hidden');
}

localStorage.setItem("campainha", JSON.stringify({
    nome,
    mensagem,
    imagem: imagemCapturada,
    data: Date.now()
}));