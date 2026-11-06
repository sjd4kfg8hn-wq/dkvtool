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

            <div id="snowResult"></div>

        `;

    }

};
