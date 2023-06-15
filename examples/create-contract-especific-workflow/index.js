require('dotenv').config();

const axios = require('axios');

const CONTRAKTOR_API_URL = process.env.CONTRAKTOR_API_URL;
const CONTRAKTOR_API_KEY = process.env.CONTRAKTOR_API_KEY;

const contraktorAPI = axios.create({
  baseURL: CONTRAKTOR_API_URL,
  headers: {
    Authorization: `Bearer ${CONTRAKTOR_API_KEY}`
  }
});

/**
 * Exemplo de como criar um contrato dentro de um grupo especifico.
 */
async function execute() {
  try {
    console.log('1. Listando os grupos disponíveis na organização..');

    const workflows = await contraktorAPI.get('/workflows')
      .then((res) => res.data.data)
      .catch((err) => {
        console.log('Erro ao listar grupos de trabalhos.', err);
      });

    /**
     * Neste exemplo vamos utilizar o grupo cadastrado com nome "Comercial",
     * portanto vou armazenar o ID dele na variável workflow_id.
     */

    const workflow_id = await workflows.find((workflow) => workflow.name === 'Comercial').id;

    console.log('2. Criando um contrato dentro do grupo "Comercial" utilizando o modo de Modelos de Contratos..');

    const contract = await contraktorAPI.post('/contracts', {
      contract: {
        title: 'Contrato Comercial',
        current_document: {
          draft: {
            template_id: 21158
          }
        },
        workflow_id
      }
    })
      .then((res) => res.data.data);

    console.log(`Contrato ID: ${contract.id} criado com sucesso no grupo ${contract.workflow.id} - ${contract.workflow.name}! `)
  } catch (error) {
    console.log('Ocorreu um erro', error);
  }
}

execute();
