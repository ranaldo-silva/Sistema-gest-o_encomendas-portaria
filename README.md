# 🏢 Challenge Portaria Ligth

### 👨‍💻 Integrantes do Projeto

- **RM560179 – Lucas da Ressurreição Barbosa**  
- **RM560694 – Fabrício José da Silva**  
- **RM559210 – Ranaldo José da Silva**

---

## 📘 Sobre o Projeto

Aplicação desenvolvida em **React Native com Expo Router** para controle de **moradores e encomendas** em portarias de condomínios.  
O projeto permite **cadastrar, visualizar e gerenciar moradores**, além de **registrar entregas e retiradas de encomendas** de forma prática e moderna.

---

## 🚀 Funcionalidades

- 👥 **Cadastro de moradores**
  - Nome, sobrenome, bloco, apartamento e telefone.
- 📦 **Gerenciamento de encomendas**
  - Registro da origem, data e status de retirada.
- 💾 **Armazenamento local**
  - Todos os dados são salvos com **AsyncStorage** (sem necessidade de backend).
- 🧭 **Navegação estruturada com Expo Router**
  - Organização clara por rotas e componentes reutilizáveis.
- 💻 **Interface moderna**
  - Design limpo e responsivo, compatível com web e dispositivos móveis.

---


---

## ⚙️ Tecnologias Utilizadas

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Expo Router](https://expo.github.io/router/)
- [TypeScript](https://www.typescriptlang.org/)
- [AsyncStorage](https://github.com/react-native-async-storage/async-storage)
- [React Hooks](https://react.dev/reference/react)

---

## 🧠 Conceito do Projeto

A ideia central é permitir que **porteiros ou administradores** façam o controle simples e eficiente de moradores e suas encomendas — **sem depender de conexão com internet ou backend**.  
Tudo é salvo **localmente** no dispositivo, e o sistema pode futuramente ser integrado a uma API real.

---

## 🛠️ Como Rodar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/seuusuario/challenge-postal-portaria.git
cd challenge-postal-portaria

Instalar as dependências
npm install
npm install @react-native-async-storage/async-storage


Iniciar o servidor Expo
npx expo start

Executar no ambiente desejado

Pressione “w” → Executar no navegador (web)

Pressione “a” → Executar no Android (emulador ou dispositivo)

Pressione “i” → Executar no iOS (se estiver no macOS)


Dicas Úteis

Para limpar o cache do Expo (caso algo trave ou não atualize):

npx expo start -c

Os dados salvos via AsyncStorage são persistentes localmente, mesmo após fechar o app.

Se quiser reiniciar os dados, basta limpar o armazenamento do aplicativo.


Próximos Passos

 Adicionar autenticação (login simples de porteiro)

 Sincronização com API remota

 Histórico de retiradas com assinatura digital

 Notificações automáticas por WhatsApp / e-mail


👨‍💻 Autores

Projeto desenvolvido por:
Lucas da Ressurreição Barbosa, Fabrício José da Silva e Ranaldo José da Silva

🌐 Desenvolvido com ❤️ usando Expo + React Native




[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/rlCoNJHL)
