document.addEventListener("DOMContentLoaded", () => {

    const snowModule =
        document.getElementById("snow-module");

    snowModule.innerHTML = `

        <h2>📍 Alerta de Nieve</h2>

        <button id="gpsBtn">

            Detectar Ubicación

        </button>

        <div id="snowResult"></div>

    `;

    const gpsBtn =
        document.getElementById("gpsBtn");

    const result =
        document.getElementById("snowResult");

    gpsBtn.addEventListener("click", () => {

        if(!navigator.geolocation){

            result.innerHTML =
            "GPS no soportado";

            return;

        }

        result.innerHTML =
        "🛰 Buscando posición...";

        navigator.geolocation.getCurrentPosition(

            async(position)=>{

                const station =
                GeoSnowModule.getClosestStation(

                    position.coords.latitude,

                    position.coords.longitude

                );

                result.innerHTML = `

                    <p>
                    🏔 Estación cercana:
                    <strong>
                    ${
                        CONFIG.STATIONS[
                        station.stationKey
                        ].name
                    }
                    </strong>
                    </p>

                    <p>
                    📏 Distancia:
                    ${station.distanceKm} km
                    </p>

                `;

            },

            ()=>{

                result.innerHTML =
                "❌ No se pudo obtener la ubicación";

            }

        );

    });

});
