# ESCANE.IA - Sistema de Gestão de Documentos com OCR e IA

A aplicação **ESCANE.IA** foi desenvolvida para facilitar o gerenciamento de documentos, combinando tecnologias de OCR e Inteligência Artificial para extrair e interagir com o conteúdo de documentos de forma inteligente.

---

## 🔧 Tecnologias Utilizadas

O projeto foi desenvolvido empregando as seguintes tecnologias:

<div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
  <img src="https://pbs.twimg.com/profile_images/1785867863191932928/EpOqfO6d_400x400.png" alt="React Logo" width="60"/>
    <img src="https://media2.dev.to/dynamic/image/width=1080,height=1080,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fn95iol17gaecwx2rwm2y.jpeg" alt="Next.js Logo" width="60"/>
  <img src="https://www.datocms-assets.com/48401/1628645197-learn-typescript.png" alt="TypeScript Logo" width="80"/>

  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQGVV8fOc_D2_vxf1_MrxRuPeF3Y1EFAJrxg&s" alt="TailwindCSS Logo" width="120"/>
  <img src="https://www.luisllamas.es/wp-content/uploads/2019/05/axios.png" alt="Axios Logo" width="90"/>
  <img src="https://nestjs.com/img/logo_text.svg" alt="NestJS Logo" width="90"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1200px-Postgresql_elephant.svg.png" alt="PostgreSQL Logo" width="70"/>
  <img src="https://cdn.worldvectorlogo.com/logos/prisma-2.svg" alt="Prisma" width="90"/>
  <img src="https://getlogo.net/wp-content/uploads/2020/11/supabase-logo-vector.png" alt="Supabase" width="90"/>
  <img src="https://www.heise.de/download/media/tesseract-ocr/tesseract-ocr_1-1-30.jpg" alt="Tesseract" width="90"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/2560px-Google_Gemini_logo.svg.png" alt="Gemini" width="90"/>
</div>

---

## 🌟 Funcionalidades

### 1. Upload de Imagens e Documentos
Permite que usuários realizem o upload de imagens e documentos de maneira simples, possibilitando o tratamento de diversos formatos com facilidade.

### 2. Extração Automática de Texto via OCR
Utiliza o Tesseract para converter imagens em texto automaticamente, garantindo a extração rápida e precisa dos dados contidos nos documentos.

### 3. Gestão de documentos e nomeação automatica
Após a extração do conteúdo textual, o sistema gera documentos associados a sua conta com nomes automáticos, baseados no conteúdo dos documentos, para uma organização intuitiva.

### 4. Interação Contextual com Documentos Usando IA
Integra o Google Gemini, permitindo que os usuários interajam com os documentos, obtenham respostas contextuais e aproveitem análises inteligentes, facilitando a compreensão dos conteúdos.

### 5. Histórico de Interações
Registra todas as interações realizadas com cada documento, possibilitando uma visão completa do histórico e melhor gestão das informações, é possivel revisitar um documento escaneado anteriormente e fazer novas perguntas.

### 6. Exportação em PDF com Conteúdo e Interações
Permite gerar e baixar um arquivo PDF a qualquer momento contendo o texto extraído do documento e todo o histórico de interações com a IA, facilitando o arquivamento e o compartilhamento das informações analisadas.

### 7. Autenticação Segura com JWT
Implementa um robusto sistema de autenticação utilizando tokens JWT para garantir o acesso seguro à aplicação.

### 8. Integração com Banco de Dados PostgreSQL por meio do Prisma
Utiliza PostgreSQL juntamente com o Prisma para uma gestão de dados eficiente, garantindo performance e integridade.

### 9. Deploy e Acesso Online
A aplicação está hospedada na nuvem, facilitando o acesso para testes e utilização:
- **Deploy Online:** [ESCANE.IA](https://escane-ia-iota.vercel.app/)

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos

- Node.js 16 ou superior
- Gerenciador de pacotes: NPM, Yarn ou PNPM
- PostgreSQL (local ou via serviço, como Supabase)

---

### 📦 Instalação

1. Clone o repositório:

```
git clone https://github.com/ArthurLuis/case-paggo
cd case-paggo
```

2. Instale as dependências:

**Frontend:**

```
cd frontend
npm install
# ou
yarn install
```

**Backend:**

```
cd ../backend
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:

**Backend (`/backend/.env`):**

```
NEXTAUTH_SECRET=sua_chave_aqui
SECRET_KEY=sua_chave_aqui
DATABASE_URL=postgresql://usuario:senha@host:porta/database
SUPABASE_URL=https://sua-url.supabase.co
SUPABASE_KEY=sua-chave-supabase
GEMINI_API_KEY=sua-chave-gemini
```

**Frontend (`/frontend/.env.local`):**

```
NEXTAUTH_SECRET=
NEXT_PUBLIC_API_URL=
```

4. Rode os servidores de desenvolvimento:

**Frontend:**

```
cd frontend
npm run dev
# ou
yarn dev
```

**Backend:**

```
cd backend
npm run start:dev
# ou
yarn start:dev
```

5. Acesse a aplicação em [http://localhost:3000](http://localhost:3000)

---

## 📌 Melhorias Futuras

- Testes unitários e de integração
- Edição de nomes de documentos
- Implementação de filtros e busca inteligente por documentos
- Suporte para upload de PDFs
- Geração de tags automáticas utilizando IA

---

## 📋 Organização do Projeto

Todo o desenvolvimento foi organizado por meio do Notion, com detalhamento das tarefas diárias, problemas enfrentados e priorização das funcionalidades.

- **Acessar o Notion do Projeto:** [ESCANE.IA no Notion](https://somber-poppyseed-ad6.notion.site/ESCANE-IA-1b42b5a27fc38083827be293dc3c1ac0?pvs=4)

---

_Codado com ❤️ por **Arthur Luis**, apaixonado por resolver problemas com tecnologia._
