// --- IMPORTAÇÕES DO FIREBASE ---
// Adicionei 'deleteDoc' na lista de importações
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0UXt2B5RpivChXi_PcnscJhU76PczBsU",
  authDomain: "mapa-caronas-2bf15.firebaseapp.com",
  projectId: "mapa-caronas-2bf15",
  storageBucket: "mapa-caronas-2bf15.firebasestorage.app",
  messagingSenderId: "1064945650152",
  appId: "1:1064945650152:web:85f83fff321897f111bc5d"
};

// --- SENHA DE ADMINISTRADOR ---
// Defina aqui a senha para cancelar uma carona
const SENHA_ADMIN = "admin123"; 

// Inicializa o Banco
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- MAPA ---
var map = L.map('map', { zoomControl: true, scrollWheelZoom: true }).setView([-23.535, -46.455], 14);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '© OpenStreetMap'
}).addTo(map);

// ÍCONES
var iconPessoa = L.divIcon({
    className: 'custom-icon-pessoa',
    html: '<div style="font-size: 30px;">📍</div>',
    iconSize: [30, 42], iconAnchor: [15, 42]
});

var iconIgreja = L.divIcon({
    className: 'custom-icon-igreja',
    html: '<div style="font-size: 40px;">⛪</div>',
    iconSize: [40, 50], iconAnchor: [20, 50]
});

L.marker([-23.527685, -46.451610], {icon: iconIgreja}).addTo(map)
 .bindPopup('<div class="popup-content"><h3>PIBI Itaquera</h3><p>Destino Final</p></div>');

// --- LISTA DE PESSOAS ---
const locais = [
    { id: 1, nome: "Eunice de Almeida", endereco: "Rua Luiz Antonio Gonçalves, 401", distancia:"Distância da Igreja: 1,6 km",numero: "11 96552-6714", coords: [-23.535960, -46.460323] },
    { id: 2, nome: "Feliciano e Maria", endereco: "Rua Luiz Antonio Gonçalves, 419",  distancia:"Distância da Igreja: 1,6 km",numero: "11 94853-8611", coords: [-23.536038, -46.460204] },
    { id: 3, nome: "José Lúcio", endereco: "Rua Arte do Sol, 19 D",  distancia:"Distância da Igreja: 1,4 km",numero: "11 96217-5991", coords: [-23.527885, -46.460886] },
    { id: 4, nome: "Ester Loula", endereco: "Rua Monte Car, 1563",  distancia:"Distância da Igreja: 2,2 km",numero: "11 96319-4946", coords: [-23.523248, -46.460652] },
    { id: 5, nome: "Cleonice M.", endereco: "Rua Arreio de Prata, 23",  distancia:"Distância da Igreja: 1,8 km",numero: "11 99398-4652", coords: [-23.525007, -46.460159] },
    { id: 6, nome: "Marilene Messias", endereco: "Rua José Vieira Guimarães, 243",  distancia:"Distância da Igreja: 3,5 km",numero: "11 99817-6896", coords: [-23.523105, -46.428089] },
    { id: 7, nome: "Eunice Maria", endereco: "Rua Cananga do Japão, 20",  distancia:"Distância da Igreja: 1,7 km",numero: "11 97018-3780", coords: [-23.538597, -46.459731] },
    { id: 8, nome: "Geralda José", endereco: "Rua José Alves dos Santos, 128",  distancia:"Distância da Igreja: 2,2 km",numero: "11 98104-2630", coords: [-23.538612, -46.461466] },
    { id: 9, nome: "Maria Aurora", endereco: "Rua José Alves dos Santos, 129",  distancia:"Distância da Igreja: 2,2 km",numero: "11 98491-9075", coords: [-23.538600, -46.461698] },
    { id: 10, nome: "Maria do Carmo", endereco: "Rua Paranátama, 175",  distancia:"Distância da Igreja: 2,7 km",numero: "11 93210-9008", coords: [-23.545151, -46.455241] },
    { id: 11, nome: "Marise", endereco: "Rua Inula, 48",  distancia:"Distância da Igreja: 2,4 km",numero: "11 98997-0881", coords: [-23.513252, -46.446264] }
];

// --- FUNÇÃO GLOBAL DE GERENCIAMENTO (Adotar ou Cancelar) ---
// Precisa ser global (window) para o HTML "enxergar"
window.gerenciarCarona = async (id, acao, nome) => {
    
    // 1. AÇÃO DE ADOTAR (DAR CARONA)
    if (acao === 'adotar') {
        if (confirm(`Confirmar carona para ${nome}?`)) {
            try {
                await setDoc(doc(db, "adocoes", String(id)), {
                    adotado: true,
                    nome: nome,
                    data: new Date().toISOString()
                });
                // O onSnapshot atualiza a tela sozinho
            } catch (e) {
                alert("Erro ao salvar: " + e.message);
            }
        }
    } 
    
    // 2. AÇÃO DE CANCELAR (REVERTER)
    else if (acao === 'cancelar') {
        const senha = prompt("🔒 Essa pessoa já foi Adotada!/n\nDigite a senha de administrador para cancelar esta carona:");
        
        if (senha === SENHA_ADMIN) {
            try {
                // Apaga o registro do banco -> Volta a ficar verde
                await deleteDoc(doc(db, "adocoes", String(id)));
                alert("Carona cancelada com sucesso!");
            } catch (e) {
                alert("Erro ao cancelar: " + e.message);
            }
        } else if (senha !== null) {
            alert("Senha incorreta!");
        }
    }
};

// --- RENDERIZAÇÃO DOS MARCADORES ---
locais.forEach(local => {
    if (local.coords[0] !== 0) {
        const marker = L.marker(local.coords, {icon: iconPessoa}).addTo(map);

        // Função que desenha o popup
        const atualizarPopup = (estaAdotado) => {
            let btnHtml = '';

            if (estaAdotado) {
                // Se já adotado, mostra botão vermelho de cancelar
                btnHtml = `<button class="btn-cancelar" onclick="window.gerenciarCarona(${local.id}, 'cancelar', '${local.nome}')">Já adotado!</button>`;
            } else {
                // Se livre, mostra botão verde de adotar
                btnHtml = `<button class="btn-adotar" onclick="window.gerenciarCarona(${local.id}, 'adotar', '${local.nome}')">✋ Dar Carona</button>`;
            }

            const conteudo = `
                <div class="popup-content">
                    <h3>${local.nome}</h3>
                    <p>📱 ${local.numero}</p>
                    <p>🏠 ${local.endereco}</p>
                    <p>🚞 ${local.distancia}</p>
                    ${btnHtml}
                    <br>
                    <br>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(local.endereco)}" target="_blank" style="color:blue;text-decoration: none;">Traçar Rota da Sua Casa</a>
                </div>
            `;
            
            // Atualiza o conteúdo do popup
            marker.bindPopup(conteudo);
        };

        // Estado inicial
        atualizarPopup(false);

        // ESCUTAR O BANCO EM TEMPO REAL
        onSnapshot(doc(db, "adocoes", String(local.id)), (docSnapshot) => {
            if (docSnapshot.exists() && docSnapshot.data().adotado) {
                atualizarPopup(true); // Está adotado
            } else {
                atualizarPopup(false); // Está livre
            }
        });
    }
});
