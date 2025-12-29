var map = L.map('map', {
    dragging: true,
    zoomControl: true,
    scrollWheelZoom: true,
    doubleClickZoom: false,
    touchZoom: true,
    keyboard: false
}).setView([-23.542, -46.453], 15.4);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);


var iconPessoa = L.divIcon({
    className: 'custom-icon-pessoa',
    html: '<div style="font-size: 30px;">📍</div>',
    iconSize: [30, 42],
    iconAnchor: [15, 42]
});


var iconIgreja = L.icon({
    iconUrl: 'icone-igreja.png',
    iconSize:     [40, 40],
    iconAnchor:   [20, 40],
    popupAnchor:  [0, -40]
});


var igreja = L.marker([-23.527685449930573, -46.451610734483324], {icon: iconIgreja}).addTo(map);

igreja.bindPopup(`
    <div class="popup-content" style="text-align:center;">
        <h3 style="color: #d63384;">PIBI Itaquera</h3>
        <p><strong>Destino Final</strong></p>
        <p>Rua Rancho Queimado, 176</p>
        <a href="https://www.google.com/maps/search/?api=1&query=Rua+Rancho+Queimado,+176+-+Itaquera" target="_blank">Ver no Maps</a>
    </div>
`);

const locais = [
    {
        nome: "Eunice de Almeida Santos",
        endereco: "Rua Luiz Antonio Gonçalves, 401",
        numero: "11 96552-6714",
        coords: [-23.535960377280276, -46.46032369144317]
    },
    {
        nome: "Feliciano e Maria Dória",
        endereco: "Rua Luiz Antonio Gonçalves, 419",
        numero: "11 94853-8611",
        coords: [-23.536038201498194, -46.46020428480048]
    },
    {
        nome: "José Lúcio, Josefa e Valéria",
        endereco: "Rua Arte do Sol, 19 D",
        numero: "11 96217-5991",
        coords: [-23.52788578836052, -46.460886718004815] 
    },
    {
        nome: "Ester Loula Santos",
        endereco: "Rua Monte Car, 1563",
        numero: "11 96319-4946",
        coords: [-23.52324818290377, -46.460652863851216]
    },
    {
        nome: "Cleonice Maximiliano",
        endereco: "Rua Arreio de Prata, 23",
        numero: "11 99398-4652",
        coords: [-23.525007894527647, -46.460159395906]
    },
    {
        nome: "Marilene Messias de Souza",
        endereco: "Rua José Vieira Guimarães, 243",
        numero: "11 99817-6896",
        coords: [-23.52310530248178, -46.428089487011675]
    },
    {
        nome: "Eunice Maria de Souza",
        endereco: "Rua Cananga do Japão, 20",
        numero: "11 97018-3780",
        coords: [-23.53859701152427, -46.459731142243946]
    },
    {
        nome: "Geralda José da Silva",
        endereco: "Rua José Alves dos Santos, 128",
        numero: "11 98104-2630",
        coords: [-23.53861226691447, -46.461466940573494]
    },
    {
        nome: "Maria Aurora",
        endereco: "Rua José Alves dos Santos, 129",
        numero: "11 98491-9075",
        coords: [-23.53860083497892, -46.46169813650688]
    },
    {
        nome: "Maria do Carmo",
        endereco: "Rua Paranátama, 175",
        numero: "11 93210-9008",
        coords: [-23.545151759033814, -46.45524142809184]
    },
    {
        nome: "Marise",
        endereco: "Rua Inula, 48",
        numero: "11 98997-0881",
        coords: [-23.51325235531458, -46.446264738317666]
    }
];

locais.forEach(function(local) {

    if (local.coords[0] !== -23.540) { 
        var marker = L.marker(local.coords, {icon: iconPessoa}).addTo(map);
        
        var conteudoPopup = `
            <div class="popup-content">
                <h3>${local.nome}</h3>
                <p><strong>WhatsApp:</strong> ${local.numero}</p>
                <p><strong>Endereço:</strong> ${local.endereco}</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(local.endereco)}" target="_blank" style="color:blue; text-decoration:underline;">
                   Traçar Rota até aqui
                </a>
            </div>
        `;
        
        marker.bindPopup(conteudoPopup);
    }
});

