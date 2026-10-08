document.querySelectorAll('.dropdown-toggle').forEach(botao => {
    botao.addEventListener('click', function(event) {
        event.preventDefault(); 
        event.stopPropagation(); 

        const submenuAtual = this.nextElementSibling;
        if (submenuAtual) {
            document.querySelectorAll('.dropdown-content').forEach(sub => {
                if (sub !== submenuAtual) {
                    sub.classList.remove('mostrar-submenu');
                }
            });
            submenuAtual.classList.toggle('mostrar-submenu');
        }
    });
});

document.addEventListener('click', function() {
    document.querySelectorAll('.dropdown-content').forEach(sub => {
        sub.classList.remove('mostrar-submenu');
    });
});

// VALIDAÇÃO DO INPUT DE CPF (APENAS NÚMEROS E MÁXIMO 11 DÍGITOS)
document.addEventListener('input', function(event) {
    if (event.target && event.target.id === 'cpf') {
        event.target.value = event.target.value.replace(/\D/g, '');
        if (event.target.value.length > 11) {
            event.target.value = event.target.value.slice(0, 11);
        }
    }
});

const formCadastro = document.getElementById('formCadastro');
if (formCadastro) {
    formCadastro.addEventListener('submit', function(event) {
        const cpfInput = document.getElementById('cpf');
        const cpfCadastrado = cpfInput ? cpfInput.value : "";
        
        // Impede o envio se não tiver exatamente 11 números
        if (cpfCadastrado.length !== 11) {
            event.preventDefault();
            alert('O CPF deve conter exatamente 11 números.');
            return;
        }

        event.preventDefault();
        
        const nomeCadastrado = document.getElementById('name').value;
        const enderecoCadastrado = document.getElementById('endereco').value;
        const emailCadastrado = document.getElementById('email').value;
        const senhaCadastrada = document.getElementById('password').value;

        const dadosUsuario = {
            nome: nomeCadastrado, 
            cpf: cpfCadastrado, 
            endereco: enderecoCadastrado, 
            email: emailCadastrado, 
            senha: senhaCadastrada
        };

        localStorage.setItem('usuarioCadastroJSON', JSON.stringify(dadosUsuario));
        
        const nomeArquivoBase = nomeCadastrado.toLowerCase().replace(/\s+/g, '_');

        const conteudoJson = JSON.stringify(dadosUsuario, null, 4);
        fazerDownload(conteudoJson, `cadastro_${nomeArquivoBase}.txt`, 'text/plain;charset=utf-8');

        const conteudoTxt = `--- NOVO CADASTRO - OVERALL BARBER ---\nNome: ${nomeCadastrado}\nCPF: ${cpfCadastrado}\nEndereço: ${enderecoCadastrado}\nE-mail: ${emailCadastrado}\nSenha: ${senhaCadastrada}\n-------------------------------------`;
        fazerDownload(conteudoTxt, `cadastro_${nomeArquivoBase}.txt`, 'text/plain;charset=utf-8');

        alert('Cadastro realizado com sucesso! Dados salvos e arquivos baixados.');

        window.location.href = "login.html";
    });
}

const formLogin = document.getElementById('formLogin');
const inputLoginEmail = document.getElementById('loginEmail');
const inputLoginPassword = document.getElementById('loginPassword');

if (formLogin) {
    const dadosSalvos = localStorage.getItem('usuarioCadastroJSON');
    if (dadosSalvos) {
        const usuario = JSON.parse(dadosSalvos);
        
        if (inputLoginEmail) inputLoginEmail.value = usuario.email;
        if (inputLoginPassword) inputLoginPassword.value = usuario.senha;
    }

    formLogin.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (!inputLoginEmail || !inputLoginPassword) return;

        const emailDigitado = inputLoginEmail.value;
        const senhaDigitada = inputLoginPassword.value;

        const dadosValida = localStorage.getItem('usuarioCadastroJSON');
        if (dadosValida) {
            const usuario = JSON.parse(dadosValida);

            if (emailDigitado === usuario.email && senhaDigitada === usuario.senha) {
                alert(`Bem-vindo de volta, ${usuario.nome}!`);

                localStorage.setItem('usuarioLogado', 'true');

                window.location.href = "siteprincipal.html"; 
            } else {
                alert('E-mail ou senha incorretos.');
            }
        } else {
            alert('Nenhum usuário cadastrado encontrado. Por favor, cadastre-se primeiro.');
        }
    });
}

if (window.location.pathname.includes('siteprincipal.html')) {
    const logado = localStorage.getItem('usuarioLogado');
    if (logado !== 'true') {
        alert('Acesso negado. Por favor, faça login para acessar a página principal.');
        window.location.href = "login.html";
    }
}

const tabelaHorariosCorpo = document.getElementById('tabelaHorariosCorpo');
const inputCorte = document.getElementById('corte');

if (tabelaHorariosCorpo) {
    const listaHorarios = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    const diasSemana = ["seg", "ter", "qua", "qui", "sex", "sab"];

    listaHorarios.forEach(horario => {
        const tr = document.createElement('tr');
        
        const tdHorario = document.createElement('td');
        tdHorario.textContent = horario;
        tr.appendChild(tdHorario);

        diasSemana.forEach(dia => {
            const tdDia = document.createElement('td');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'horario_selecionado'; 
            radio.value = `${dia.toUpperCase()} às ${horario}`;

            tdDia.appendChild(radio);
            tr.appendChild(tdDia);
        });

        tabelaHorariosCorpo.appendChild(tr);
    });
}

// LÓGICA DE TRAVA DOS CHECKBOXES (FILTRADO PELO ID "servicos")
document.addEventListener('change', function(event) {
    const elemento = event.target;
    
    if (elemento && elemento.id === 'servicos' && elemento.type === 'checkbox') {
        const linhaClicada = elemento.closest('tr');
        if (!linhaClicada || linhaClicada.cells.length < 2) return;

        const textoServicoClicado = linhaClicada.cells[1].textContent.trim().toLowerCase();
        const todosCheckboxes = document.querySelectorAll('input[id="servicos"]');

        if (!elemento.checked) return;

        todosCheckboxes.forEach(checkbox => {
            if (checkbox === elemento) return;

            const outraLinha = checkbox.closest('tr');
            if (!outraLinha || outraLinha.cells.length < 2) return;

            const textoOutroServico = outraLinha.cells[1].textContent.trim().toLowerCase();

            if (textoServicoClicado.includes("combo")) {
                if (textoOutroServico.includes("corte") || textoOutroServico.includes("barba")) {
                    checkbox.checked = false;
                }
            }

            if (textoServicoClicado.includes("corte") || textoServicoClicado.includes("barba")) {
                if (textoOutroServico.includes("combo")) {
                    checkbox.checked = false;
                }
            }
        });
    }
});

const formReserva = document.getElementById('formReserva');
if (formReserva) {
    formReserva.addEventListener('submit', function(event) {
        event.preventDefault();

        const servicosSelecionados = document.querySelectorAll('input[id="servicos"]:checked, input[name="servicos"]:checked');
        const horarioSelecionado = document.querySelector('input[name="horario_selecionado"]:checked');
        
        let estiloCorteDigitado = inputCorte ? inputCorte.value.trim() : "";
        if (estiloCorteDigitado === "") {
            estiloCorteDigitado = "Não informado";
        }

        if (servicosSelecionados.length === 0) {
            alert('Por favor, selecione ao menos um serviço ou adicional nas caixas de seleção!');
            return;
        }
        if (!horarioSelecionado) {
            alert('Por favor, escolha um dia e horário na tabela antes de enviar!');
            return;
        }

        let valorTotal = 0;
        let nomesServicosTxt = [];

        servicosSelecionados.forEach(servico => {
            const linha = servico.closest('tr');
            if (linha && linha.cells.length > 1) {
                const nomeServicoText = linha.cells[1].textContent.trim();
                nomesServicosTxt.push(nomeServicoText);
                
                const precoAtributo = parseFloat(servico.getAttribute('data-preco'));
                if (!isNaN(precoAtributo)) {
                    valorTotal += precoAtributo;
                }
            }
        });

        alert(`Agendamento enviado com sucesso!\n\nHorário: ${horarioSelecionado.value}\nServiços: ${nomesServicosTxt.join(', ')}\nCorte: ${estiloCorteDigitado}\nTotal: R$ ${valorTotal.toFixed(2).replace('.', ',')}`);
    });
}
