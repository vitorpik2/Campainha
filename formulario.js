const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const contexto = canvas.getContext('2d');
let imagemCapturada = '';

// Iniciar a câmera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(erro => {
        alert('Erro ao acessar a câmera: ' + erro);
    });

// Carregar os modelos da face-api.js
async function carregarModelosFaceAPI() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
}
carregarModelosFaceAPI();

function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('mensagem').value = '';
    canvas.style.display = 'none';
    imagemCapturada = '';
}

// Tirar foto com verificação de rosto
async function tirarFoto() {
    // Detectar rosto no vídeo
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());

    if (detections.length === 0) {
        alert("Nenhum rosto detectado. Posicione-se na frente da câmera.");
        return;
    }

    // Se rosto for detectado, capturar imagem
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

    const popup = document.getElementById('popup');
    const resultadoDiv = document.getElementById('resultado');

    resultadoDiv.innerHTML = `
        <h1>Sua chamada!</h1>
        <img src="${imagemCapturada}" />
        <h3>${nome}</h3>
        <p>${mensagem}</p>
    `;

    popup.classList.remove('hidden');

    localStorage.setItem("campainha", JSON.stringify({
        nome,
        mensagem,
        imagem: imagemCapturada,
        data: Date.now()
    }));

    await enviarMensagem(nome, mensagem, imagemCapturada);
}

function fecharPopup() {
    document.getElementById('popup').classList.add('hidden');
}
