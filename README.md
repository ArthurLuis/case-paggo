# ESCANE.IA - Sistema de Gestão de Documentos com OCR e IA

A aplicação **ESCANE.IA** foi desenvolvida para facilitar o gerenciamento de documentos, combinando tecnologias de OCR e Inteligência Artificial para extrair e interagir com o conteúdo de documentos de forma inteligente.

---

## 🌟 Funcionalidades

### 1. Upload de Imagens e Documentos
Permite que usuários realizem o upload de imagens e documentos de maneira simples, possibilitando o tratamento de diversos formatos com facilidade.

### 2. Extração Automática de Texto via OCR
Utiliza o Tesseract para converter imagens em texto automaticamente, garantindo a extração rápida e precisa dos dados contidos nos documentos.

### 3. Geração Automática de Cards
Após a extração do conteúdo textual, o sistema gera cards com nomes automáticos, baseados no conteúdo dos documentos, para uma organização intuitiva.

### 4. Interação Contextual com Documentos Usando IA
Integra o Google Gemini, permitindo que os usuários interajam com os documentos, obtenham respostas contextuais e aproveitem análises inteligentes, facilitando a compreensão dos conteúdos.

### 5. Histórico de Interações
Registra todas as interações realizadas com cada documento, possibilitando uma visão completa do histórico e melhor gestão das informações.

### 6. Autenticação Segura com JWT
Implementa um robusto sistema de autenticação utilizando tokens JWT para garantir o acesso seguro à aplicação.

### 7. Integração com Banco de Dados PostgreSQL por meio do Prisma
Utiliza PostgreSQL juntamente com o Prisma para uma gestão de dados eficiente, garantindo performance e integridade.

### 8. Deploy e Acesso Online
A aplicação está hospedada na nuvem, facilitando o acesso para testes e utilização:
- **Deploy Online:** [ESCANE.IA](https://escane-ia-iota.vercel.app/)

---

## 🔧 Tecnologias Utilizadas

O projeto foi desenvolvido empregando as seguintes tecnologias:

(div com logos das tecnologias - adicione manualmente os ícones ou remova se preferir um README mais limpo)

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
