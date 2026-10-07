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

const formCadastro = document.getElementById('formCadastro');
if (formCadastro) {
    formCadastro.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const nomeCadastrado = document.getElementById('name').value;
        const cpfCadastrado = document.getElementById('cpf').value;
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

const formReserva = document.getElementById('formReserva');
if (formReserva) {
    formReserva.addEventListener('submit', function(event) {
        event.preventDefault();

        const servicosSelecionados = document.querySelectorAll('input[name="servicos"]:checked');
        const horarioSelecionado = document.querySelector('input[name="horario_selecionado"]:checked');
        const estiloCorteDigitado = inputCorte ? inputCorte.value.trim() : "";

        if (servicosSelecionados.length === 0) {
            alert('Por favor, selecione ao menos um serviço ou adicional nas caixas de seleção!');
            return;
        }
        if (!horarioSelecionado) {
            alert('Por favor, escolha um dia e horário na tabela antes de enviar!');
            return;
        }
        if (estiloCorteDigitado === "") {
            alert('Por favor, digite qual o estilo ou tipo de corte que você deseja!');
            return;
        }

        let valorTotal = 0;
        let nomesServicosTxt = [];

        servicosSelecionados.forEach(servico => {
            const linha = servico.closest('tr');
            if (linha && linha.cells.length > 1) {
                const nomeServicoText = linha.cells[1].textContent.trim();
                nomesServicosTxt.push(nomeServicoText);
            } else {
                nomesServicosTxt.push("Serviço Selecionado");
            }
            
            const precoAttr = servico.getAttribute('data-preco');
            valorTotal += precoAttr ? parseFloat(precoAttr) : 0;
        });

        let nomeCliente = "Cliente";
        const dadosUsuarioSalvos = localStorage.getItem('usuarioCadastroJSON');
        if (dadosUsuarioSalvos) {
            const usuarioObj = JSON.parse(dadosUsuarioSalvos);
            nomeCliente = usuarioObj.nome || "Cliente";
        }

        const conteudoTxt = `--- NOVO AGENDAMENTO - OVERALL BARBER ---
Cliente: ${nomeCliente}
Horário Agendado: ${horarioSelecionado.value}
Modelo/Estilo do Corte: ${estiloCorteDigitado}
Serviços e Adicionais: ${nomesServicosTxt.join(', ')}
-----------------------------------------
VALOR FINAL SOMADO: R$ ${valorTotal.toFixed(2).replace('.', ',')}
-----------------------------------------`;

        const nomeArquivoAgendamento = `agendamento_${nomeCliente.toLowerCase().replace(/\s+/g, '_')}.txt`;
        fazerDownload(conteudoTxt, nomeArquivoAgendamento, 'text/plain;charset=utf-8');

        const agendamentoHistorico = {
            cliente: nomeCliente,
            horario: horarioSelecionado.value,
            estilo: estiloCorteDigitado,
            servicos: nomesServicosTxt,
            total: valorTotal
        };
        localStorage.setItem('ultimoAgendamentoJSON', JSON.stringify(agendamentoHistorico));

        alert('Agendamento concluído com sucesso! Recibo baixado.');
    });
}

function fazerDownload(conteudo, nomeArquivo, tipoConteudo) {
    const blob = new Blob([conteudo], { type: tipoConteudo });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", function() {
    const elementoFooter = document.getElementById('texto-footer');
    
    if (elementoFooter) {
        const dataAtual = new Date();
        const anoAtual = dataAtual.getFullYear();

        const opcoes = { year: 'numeric', month: 'long', day: 'numeric' };
        const dataFormatada = dataAtual.toLocaleDateString('pt-BR', opcoes);

        elementoFooter.innerHTML = `©${anoAtual} Todos os direitos reservados. Josias e Guilherme.O <br> <span style="font-size: 12px; color: #ccc;">Hoje é ${dataFormatada}</span>`;
    }
});
