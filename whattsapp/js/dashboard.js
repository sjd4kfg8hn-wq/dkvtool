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

        if (!navigator.geolocation) {

            result.innerHTML =
                "❌ GPS no soportado";

            return;

        }

        navigator.geolocation.getCurrentPosition(

            (position) => {

                result.innerHTML = `

                    <p>
                    ✅ GPS detectado
                    </p>

                    <p>
                    Lat:
                    ${position.coords.latitude.toFixed(4)}
                    </p>

                    <p>
                    Lon:
                    ${position.coords.longitude.toFixed(4)}
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
