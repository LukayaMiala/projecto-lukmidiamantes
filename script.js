document.addEventListener('DOMContentLoaded', () => {
    const columns = document.querySelectorAll('.column');
    const scoreBtn = document.getElementById('scoreBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const moneyDisplay = document.getElementById('money');
    const saldoUsuarioDisplay = document.getElementById('saldoUsuario');
    const betInput = document.getElementById('betInput');
    const betBtn = document.getElementById('betBtn');
    let score = 0;
    let betAmount = 0;
    let gameInProgress = false;
    let valorRestanteSaque = 0;
    let saldoUsuario = 1000.00;

    function verificarTile(coluna) {
        if (betAmount === 0 || !gameInProgress) {
            alert('Defina um valor de aposta antes de jogar.');
            return;
        }

        if (coluna.classList.contains('diamond')) {
            coluna.textContent = '💎';
            coluna.classList.add('emoji-found');
            const pontos = betAmount * 5;
            score += pontos;
            valorRestanteSaque += pontos;
            atualizarExibicaoPontuacao();
            setTimeout(() => {
                coluna.classList.remove('emoji-found');
            }, 1000);
        } else {
            coluna.textContent = '😖';
            coluna.classList.add('emoji-found');
            // O usuário perde a jogada, e os emojis são revelados
            revelarEmojis();
            // O usuário perde a pontuação
            score = 0;
            valorRestanteSaque = 0;
            atualizarExibicaoPontuacao();
            // O jogo não está mais em andamento até que uma nova aposta seja feita
            gameInProgress = false;
        }

        coluna.onclick = null;
        checkVitoria();

        // Adiciona um temporizador para esconder os emojis após 5 segundos
        setTimeout(() => {
            esconderEmojis();
        }, 5000);
    }

    function esconderEmojis() {
        const columns = document.querySelectorAll('.column');
        columns.forEach(coluna => {
            coluna.textContent = '';
            coluna.classList.add('clickable');
        });
    }

    function revelarEmojis() {
        // Adicione lógica para revelar todos os emojis nos quadrados
        const columns = document.querySelectorAll('.column');
         //columns.forEach(coluna => {
            // if (coluna.classList.contains('diamond')) {
             //    coluna.textContent = '💎';
            // } else {
           //      coluna.textContent = '😖';
            // }
       //  });
    }

    function checkVitoria() {
        const diamantesEncontrados = document.querySelectorAll('.diamond').length;

        if (diamantesEncontrados === 17) {
            const valorConvertido = score;
            moneyDisplay.textContent = valorConvertido.toFixed(2);
            scoreBtn.onclick = retirarDinheiro;
            withdrawBtn.style.display = 'block';
            atualizarExibicaoPontuacao();
        }
    }

    function retirarDinheiro() {
        saldoUsuario += valorRestanteSaque;
        revelarEmojis();
        score = 0;
        valorRestanteSaque = 0;
        atualizarExibicaoSaldo();
        atualizarExibicaoPontuacao();
        // O jogo não está mais em andamento até que uma nova aposta seja feita
        gameInProgress = false;
    }

    function resetarJogo() {
        score = 0;
        moneyDisplay.textContent = '0.00';
        columns.forEach(coluna => {
            coluna.classList.remove('diamond');
            coluna.textContent = '';
            coluna.onclick = () => verificarTile(coluna);
            coluna.classList.add('clickable');
        });

        const colunasComDiamantes = [];
        while (colunasComDiamantes.length < 17) {
            const indiceAleatorio = Math.floor(Math.random() * 20);
            if (!colunasComDiamantes.includes(indiceAleatorio)) {
                colunasComDiamantes.push(indiceAleatorio);
            }
        }

        colunasComDiamantes.forEach(indice => {
            columns[indice].classList.add('diamond');
        });

        VALOR_MINIMO_RETIRADA = 50;
        withdrawBtn.style.display = 'none';
        gameInProgress = true; // Habilitar o jogo novamente após fazer uma nova aposta
        resetarEmojis();
    }
    function moverBotao() {
        alert("Botão Clicado!");
    }
    function resetarEmojis() {
        // Adicione lógica para esconder ou mostrar emojis com base no horário atual
        const horaAtual = new Date().getHours();

        const columns = document.querySelectorAll('.column');
        columns.forEach(coluna => {
            coluna.classList.remove('diamond');
            coluna.textContent = '';
            coluna.onclick = () => verificarTile(coluna);
            coluna.classList.add('clickable');

            if (
                (horaAtual >= 0 && horaAtual < 1) ||
                (horaAtual >= 12 && horaAtual < 13) ||
                (horaAtual >= 20 && horaAtual < 21)
            ) {
                // Mostrar emojis de tristeza apenas nas duas últimas linhas
                if (parseInt(coluna.id.charAt(4)) >= 3) {
                    coluna.classList.add('emoji-found');
                    coluna.textContent = '😖';
                }
            } else {
                // Mostrar emojis de forma aleatória
                const random = Math.random();
                if (random < 0.1) {
                    coluna.classList.add('emoji-found');
                    coluna.textContent = '😖';
                }
            }
        });
    }

    function atualizarExibicaoSaldo() {
        saldoUsuarioDisplay.textContent = saldoUsuario.toFixed(2);
    }

    function atualizarExibicaoPontuacao() {
        scoreBtn.textContent = `RETIRAR: ${score.toFixed(2)} AOA`;
    }

    betBtn.addEventListener('click', () => {
        const betValue = parseFloat(betInput.value.replace(',', '.'));

      
        
        if (!isNaN(betValue) && betValue >= 50 && betValue <= 200) {
            if (saldoUsuario >= betValue) {
                betAmount = betValue;
                saldoUsuario -= betAmount;
                atualizarExibicaoSaldo();
                alert(`Você apostou ${betAmount} AOA. Agora, os diamantes valem ${betAmount * 5} AOA cada.`);
                // Habilitar o jogo novamente após fazer uma nova aposta
                gameInProgress = true;
                resetarJogo();
            } else {
                alert('Você não tem saldo suficiente para fazer essa aposta.');
            }
        } else {
            alert('O valor de aposta deve ser entre 50 AOA e 200 AOA.');
        } 
    });

    resetarJogo();
});