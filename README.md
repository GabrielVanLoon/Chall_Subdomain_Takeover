
# Ganesh Web Cloud

## Dificuldade: **Hard** 

## Descrição

Um dos membros do grupo surgiu com a ideia de criar um blog para compartilhar experiências de viagens e hobbies com os outros ganeshers. Na primeira versão um dos usuários encontrou um bug de XSS que já foi corrigido e o blog foi migrado para um outro ambiente. 

Você consegue encontrar e reportar novas vulnerabilidades para nosso administrador?

Link do desafio: blog.ganeshicmc.com

*Obs: A base de dados do desafio reinicia a cada 10 minutos!*

## Hints

- Have you DIGed enough into the problem?
- Having a hard time? Relax and get some cookies :)

# Setup

## Configurando os domínios

#### Configurando os Domínios

- **blog.ganeshicmc.com** e **myprofile.ganeshicmc.com** apontando para o IP da máquina
- Subdomínios apontando como CNAMES para **myprofile.ganeshicmc.com**
    - charles.blog.ganeshicmc.com
    - vanloon.blog.ganeshicmc.com
    - guerra.blog.ganeshicmc.com
    - mono.blog.ganeshicmc.com
    - brandt.blog.ganeshicmc.com
    - dorime.blog.ganeshicmc.com
    - lu.blog.ganeshicmc.com

#### Configurando o Container

Para buildar os containers utilize o script abaixo (obs: pode demorar um pouco pois possui algumas dependencias):

```
sudo docker-compose build
```

Para iniciar o desafio rode o seguinte comando (obs: necessário que a porta 80 esteja desocupada):

```
sudo docker-compose up
```