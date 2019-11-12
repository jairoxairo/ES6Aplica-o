import api from './api';

class App {
    constructor() {
        this.repositories = [];
        this.formEl = document.getElementById('repo-form');
        this.inputEl = document.querySelector('input[name=repository]');
        this.listEl = document.getElementById('repo-list');

        this.registerHandlers();
    }

    registerHandlers() {
        this.formEl.onsubmit = event => this.addRepository(event);
    }

    //metodo para mostrar o loading
    setLoading(loading = true) {
        if (loading === true) {
            let loadingEl = document.createElement('span');
            loadingEl.appendChild(document.createTextNode('Carregando..'));
            loadingEl.setAttribute('id', 'loading');

            //adiciona o elemento ao form
            this.formEl.appendChild(loadingEl);
        } else {
            //remove o loading da tela
            document.getElementById('loading').remove();
        }
    }

    async addRepository(event) {
        event.preventDefault();

        const repoInput = this.inputEl.value;
        if (repoInput.length === 0)
            return;

        //chama o metodo set loading antes de buscar as informacoes
        this.setLoading();

        try {

            const response = await api.get(`/repos/${repoInput}`);

            const { name, description, html_url, owner: { avatar_url } } = response.data;


            this.repositories.push({
                name,
                description,
                avatar_url,
                html_url,
            });
            //apagar o que esta escrito no input
            this.inputEl.value = '';
            this.render();
        } catch (err) {
            alert('O repositori não existe!');
        }
        this.setLoading(false);
    }
    render() {
        //apaga a lista que esta na tela para renderizar novamente do zero
        this.listEl.innerHTML = '';
        this.repositories.forEach(repo => {
            //cria o elemento imagem pegando a url do avatar
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);
            //cria um elemento de titulo e add o nome do repositorio
            let titleEl = document.createElement('strong');
            titleEl.appendChild(document.createTextNode(repo.name));
            //cria um elemento de paragrafo pegando a descricao do repositorio
            let descriptionEl = document.createElement('p');
            descriptionEl.appendChild(document.createTextNode(repo.description));
            //cria um elemento link
            let linkEl = document.createElement('a');
            //abre uma pagina em branco
            linkEl.setAttribute('target', '_blank');
            linkEl.setAttribute('href', repo.html_url);
            //add o texto acessar ao link
            descriptionEl.appendChild(document.createTextNode('Acessar'));

            //cria um elemento Li
            let listItemEl = document.createElement('li');
            //adiciona os items criados anteriormente a lista
            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(titleEl);
            listItemEl.appendChild(descriptionEl);
            listItemEl.appendChild(linkEl);

            //adiciona a lista o objeto listItemEl que contem todos os outros elementos
            this.listEl.appendChild(listItemEl);
        })
    }

}

new App();