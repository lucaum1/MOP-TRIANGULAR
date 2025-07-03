// Controle de etapas do funil
let etapaAtual = 1;
let respostasUsuario = {};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    inicializarFunil();
});

function inicializarFunil() {
    // Configurar players de áudio
    configurarPlayersAudio();
    
    // Configurar botões de opções
    configurarBotoesOpcoes();
    
    // Configurar formulário
    configurarFormulario();
}

function configurarPlayersAudio() {
    for (let i = 1; i <= 4; i++) {
        const playBtn = document.getElementById(`play-btn-${i}`);
        const audio = document.getElementById(`audio-${i}`);
        
        if (playBtn && audio) {
            playBtn.addEventListener('click', function() {
                toggleAudio(audio, playBtn);
            });
            
            audio.addEventListener('ended', function() {
                resetPlayButton(playBtn);
            });
            
            audio.addEventListener('error', function() {
                console.error(`Erro ao carregar áudio ${i}`);
                playBtn.innerHTML = '<span class="play-icon">❌</span><span class="play-text">Erro ao carregar áudio</span>';
            });
        }
    }
}

function toggleAudio(audio, button) {
    // Pausar todos os outros áudios
    const todosAudios = document.querySelectorAll('audio');
    const todosBotoes = document.querySelectorAll('.play-button');
    
    todosAudios.forEach((a, index) => {
        if (a !== audio && !a.paused) {
            a.pause();
            a.currentTime = 0;
            resetPlayButton(todosBotoes[index]);
        }
    });
    
    if (audio.paused) {
        audio.play().then(() => {
            button.classList.add('playing');
            button.innerHTML = '<span class="play-icon">⏸️</span><span class="play-text">Pausar áudio</span>';
        }).catch(error => {
            console.error('Erro ao reproduzir áudio:', error);
            button.innerHTML = '<span class="play-icon">❌</span><span class="play-text">Erro ao reproduzir</span>';
        });
    } else {
        audio.pause();
        resetPlayButton(button);
    }
}

function resetPlayButton(button) {
    button.classList.remove('playing');
    button.innerHTML = '<span class="play-icon">▶️</span><span class="play-text">Reproduzir áudio</span>';
}

function configurarBotoesOpcoes() {
    const botoesOpcoes = document.querySelectorAll('.option-btn');
    
    botoesOpcoes.forEach(botao => {
        botao.addEventListener('click', function() {
            const proximaEtapa = this.getAttribute('data-next');
            const resposta = this.getAttribute('data-response');
            
            // Salvar resposta do usuário
            respostasUsuario[`etapa_${etapaAtual}`] = resposta;
            
            // Adicionar feedback visual
            this.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
            this.style.transform = 'scale(0.98)';
            
            // Aguardar um momento e avançar
            setTimeout(() => {
                avancarEtapa(proximaEtapa);
            }, 500);
        });
    });
}

function avancarEtapa(proximaEtapa) {
    // Ocultar etapa atual
    const etapaAtualElement = document.getElementById(`etapa-${etapaAtual}`);
    etapaAtualElement.classList.remove('active');
    
    // Mostrar próxima etapa
    const proximaEtapaElement = document.getElementById(proximaEtapa);
    proximaEtapaElement.classList.add('active');
    
    // Atualizar número da etapa
    etapaAtual = parseInt(proximaEtapa.split('-')[1]);
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Log para acompanhamento
    console.log(`Avançou para ${proximaEtapa}`, respostasUsuario);
}

function configurarFormulario() {
    const form = document.getElementById('pedido-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = new FormData(form);
            const dadosPedido = {
                nome: formData.get('nome'),
                telefone: formData.get('telefone'),
                endereco: formData.get('endereco'),
                respostas: respostasUsuario,
                timestamp: new Date().toISOString()
            };
            
            // Validar campos
            if (!dadosPedido.nome || !dadosPedido.telefone || !dadosPedido.endereco) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Simular envio do pedido
            processarPedido(dadosPedido);
        });
    }
}

function processarPedido(dados) {
    // Mostrar loading no botão
    const botaoSubmit = document.querySelector('.cta-button');
    const textoOriginal = botaoSubmit.innerHTML;
    
    botaoSubmit.innerHTML = '⏳ Processando pedido...';
    botaoSubmit.disabled = true;
    
    // Simular processamento
    setTimeout(() => {
        // Log dos dados (em produção, enviar para servidor)
        console.log('Pedido processado:', dados);
        
        // Salvar no localStorage para demonstração
        localStorage.setItem('ultimoPedido', JSON.stringify(dados));
        
        // Avançar para etapa de confirmação
        avancarEtapa('etapa-5');
        
        // Resetar botão
        botaoSubmit.innerHTML = textoOriginal;
        botaoSubmit.disabled = false;
        
    }, 2000);
}

// Função para analytics (opcional)
function trackEvent(evento, dados) {
    console.log('Analytics:', evento, dados);
    // Aqui você pode integrar com Google Analytics, Facebook Pixel, etc.
}

// Detectar quando o usuário sai da página
window.addEventListener('beforeunload', function() {
    if (etapaAtual > 1 && etapaAtual < 5) {
        trackEvent('abandono_funil', {
            etapa: etapaAtual,
            respostas: respostasUsuario
        });
    }
});

// Função para compartilhar no WhatsApp (opcional)
function compartilharWhatsApp() {
    const texto = encodeURIComponent('Acabei de conhecer o Mop Triangular! Que revolução na limpeza! 🔺✨');
    const url = `https://wa.me/?text=${texto}`;
    window.open(url, '_blank');
}

// Adicionar suporte a gestos touch para mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - scroll para baixo
            window.scrollBy(0, 100);
        } else {
            // Swipe down - scroll para cima
            window.scrollBy(0, -100);
        }
    }
}

