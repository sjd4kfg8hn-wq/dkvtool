const Dashboard = {

    init() {

        this.renderSnowCard();

    },

    renderSnowCard() {

        const card =
            document.getElementById("snow-module");

        if (!card) return;

        card.innerHTML = `

            <h2>📍 Alerta de Nieve</h2>

            <button id="gpsBtn">
                Detectar ubicación
            </button>

            <div id="snowResult"
                 style="margin-top:10px;">
            </div>

        `;

        const gpsBtn =
            document.getElementById("gpsBtn");

        gpsBtn.addEventListener(
            "click",
            this.detectLocation
        );

    },

    detectLocation() {

    const result =
        document.getElementById("snowResult");

    result.innerHTML =
        "🛰 Buscando ubicación...";

    navigator.geolocation.getCurrentPosition(

        (position) => {

    const nearestStation =
        GeoSnowModule.getClosestStation(

            position.coords.latitude,

            position.coords.longitude

        );
            console.log(nearestStation);
            GeoSnowModule.fetchSnowForecast(
    nearestStation.stationKey
)
.then(data => {

    console.log(data);

})
.catch(error => {

    console.error(error);

});

    result.innerHTML = `

        <p>✅ GPS detectado</p>

        <p>
            🏔 Estación cercana:
            <strong>
                ${
                    CONFIG.STATIONS[
                        nearestStation.stationKey
                    ].name
                }
            </strong>
        </p>

        <p>
            📏 Distancia:
            ${nearestStation.distanceKm} km
        </p>

    `;

},
        () => {

            result.innerHTML =
                "❌ No se pudo obtener la ubicación";

        }

    );

}
    };

