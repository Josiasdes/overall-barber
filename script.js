
document.querySelectorAll('.dropdown-toggle').forEach(botao => {
    botao.addEventListener('click', function(event) {
        event.preventDefault(); 
        event.stopPropagation(); 

        const submenuAtual = this.nextElementSibling;
        document.querySelectorAll('.dropdown-content').forEach(sub => {
            if (sub !== submenuAtual) {
                sub.classList.remove('mostrar-submenu');
            }
        });
        submenuAtual.classList.toggle('mostrar-submenu');
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
        localStorage.setItem('userEmail', emailCadastrado);
        localStorage.setItem('userPassword', senhaCadastrada);
        const conteudoTxt = `--- NOVO CADASTRO - OVERALL BARBER ---\nNome: ${nomeCadastrado}\nCPF: ${cpfCadastrado}\nEndereço: ${enderecoCadastrado}\nE-mail: ${emailCadastrado}\nSenha: ${senhaCadastrada}\n-------------------------------------`;
        
        const blob = new Blob([conteudoTxt], { type: 'text/plain;charset=utf-8' });
        const linkDownload = document.createElement('a');
        linkDownload.href = URL.createObjectURL(blob);
        linkDownload.download = `cadastro_${nomeCadastrado.toLowerCase().replace(/\s+/g, '_')}.txt`;

        document.body.appendChild(linkDownload);
        linkDownload.click();
        document.body.removeChild(linkDownload);

        alert('Cadastro realizado com sucesso! O arquivo .txt foi baixado e os dados salvos em JSON no navegador.');
        window.location.href = "login.html";
    });
}

const formLogin = document.getElementById('formLogin');

if (formLogin) {
    formLogin.addEventListener('submit', function(event) {
        event.preventDefault();

        const emailDigitado = document.getElementById('loginEmail').value;
        const senhaDigitada = document.getElementById('loginSenha').value;

        const jsonSalvo = localStorage.getItem('usuarioCadastroJSON');

        if (!jsonSalvo) {
            alert('Nenhum usuário cadastrado neste navegador! Por favor, faça o cadastro primeiro.');
            return;
        }

        const usuario = JSON.parse(jsonSalvo);

        if (emailDigitado === usuario.email && senhaDigitada === usuario.senha) {
            alert(`Login efetuado com sucesso! Bem-vindo, ${usuario.nome}.`);
            window.location.href = "siteprincipal.html";
        } else {
            alert('E-mail ou senha incorretos! Digite os dados criados no cadastro.');
        }
    });
}

const tabelaCorpo = document.getElementById('tabelaHorariosCorpo');

if (tabelaCorpo) {
    const horarios = ["7:00", "8:00", "9:00", "10:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
    const dias = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado"];
    
    let htmlLinhas = "";
    horarios.forEach(h => {
        htmlLinhas += `<tr><td><strong>${h}</strong></td>`;
        dias.forEach(d => {
            htmlLinhas += `<td><input type="radio" name="agendamento" value="${d}_${h}" required></td>`;
        });
        htmlLinhas += `</tr>`;
    });
    
    tabelaCorpo.innerHTML = htmlLinhas;
}

const formReserva = document.getElementById('formReserva');

if (formReserva) {
    formReserva.addEventListener('submit', function(e) {
        e.preventDefault();
        const radioAgendamento = document.querySelector('input[name="agendamento"]:checked');
        const radioCorte = document.querySelector('input[name="corte"]:checked');
        
        if (radioAgendamento && radioCorte) {
            const selecionado = radioAgendamento.value;
            const tipoCorte = radioCorte.value;
            
            const partes = selecionado.split('_');
            alert(`Agendamento realizado para ${partes[0]} às ${partes[1]}!\nServiço selecionado: ${tipoCorte}`);
        }
    });
}
function atualizarDataHora() {
    const elementoData = document.getElementById('data-atual');
    if (elementoData) {
        const agora = new Date();
        const opcoesData = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
        const dataFormatada = agora.toLocaleDateString('pt-BR', opcoesData);
        const horaFormatada = agora.toLocaleTimeString('pt-BR');

        elementoData.textContent = `${dataFormatada} às ${horaFormatada}`;
    }
}
atualizarDataHora();
setInterval(atualizarDataHora, 1000);
