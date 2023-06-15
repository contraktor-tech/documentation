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
 * Exemplo de como verificar o status de assinatura de um contrato e dos seus participantes.
 */
async function execute() {
  try {
    console.log('1. Buscando contrato pelo ID..');

    // ID do Contrato
    const contractId = 123456;

    /**
     * Você pode consultar o Schema de um Contrato através da nossa documentação
     * https://developers.contraktor.com.br
     */
    const contract = await contraktorAPI.get(`/contracts/${contractId}`)
      .then((res) => res.data.data)
      .catch((err) => {
        console.log('Erro ao listar grupos de trabalhos.', err);
      });

    /** 
     * Cada contrato possui um Proof, onde são armazenados de forma imutável
     * uma série de documentos para comprovações e verificações.
     * 
     * Para localizar um Proof vamos acessar a constante contract e buscar pela chave current_document.
     * Dentro da chave current_document será possível acessar o Array de Proofs.
     * 
     * Um contrato pode ter mais de um Proof em caso do usuário cancelar a solicitação de assinatura
     * para realizar uma correção e solicitar novamente, por exemplo. 
     * Logo a primeira posição do Array sempre será o Proof atual.
     * 
     * Como estamos buscando o primeiro Proof, vamos acessar a posição 0 do Array.
     */

    /**
     * Você pode consultar o Schema de um Proof através da nossa documentação
     * https://developers.contraktor.com.br
     */
    const proof = contract.current_document.proofs[0];

    /**
     * Consultando o status de um proof.
     * 
     * O status de um Proof pode ser: pending, completed ou canceled.
     * 
     * pending: O contrato está aguardando a assinatura de todos os participantes.
     * completed: O contrato foi assinado por todos os participantes.
     * canceled: A solicitação de assinaturas foi cancelada.
     */

    const proofStatus = proof.status;

    /**
     * Consultando o status de assinatura dos participantes.
     * 
     * Proof Subject é cada participante do contrato, mas diferente de um Proof
     * ele não tem um status para identificar se o contrato foi assinado por ele ou não.
     * Para isto, precisamos acessar a chave confirmed_at, pois é ela quem vai nos dizer
     * se o participante assinou ou não o contrato.
     * 
     * Para localizar o Array de Proof Subjects vamos acessar a constante proof 
     * e buscar pela chave subjects.
     */


    /**
     * Você pode consultar o Schema de um Proof através da nossa documentação
     * https://developers.contraktor.com.br
     */
    const proofSubjects = proof.subjects;

    /**  
     * Neste exemplo vamos criar duas variáveis para armazenar os participantes que já assinaram e os que não assinaram.
    */

    // Participantes que já assinaram devem possuir a coluna confirmed_at preenchida.
    const signedSubjects = proofSubjects.filter((subject) => subject.confirmed_at);
    // Participantes que ainda não assinaram devem possuir a coluna confirmed_at vazia/nula.
    const missingSignatureSubjects = proofSubjects.filter((subject) => !subject.confirmed_at);

    console.log({
      'Status do Proof': proofStatus,
      'Total de participantes': proofSubjects.length,
      'Participantes que já assinaram': signedSubjects.map((subject) => subject.id + ' - ' + subject.name + ' - ' + subject.email),
      'Participantes que ainda não assinaram': missingSignatureSubjects.map((subject) => subject.id + ' - ' + subject.name + ' - ' + subject.email),
    });

    /**
     * Com essas informações em mãos você poderá:
     * - Cancelar a solicitação de assinaturas de um contrato, utilizando o endpoint de DELETE /proofs/:id
     * - Reenviar a solicitação de assinatura por e-mail, utilizando o endpoint de POST /proofs/:id/subjects/:proof_subject_id/remind
     * 
     * Ambos os endpoints estão disponíveis na nossa documentação
     * https://developers.contraktor.com.br
     * 
     * ou
     * 
     * Nos exemplos em JavaScript presente nesse repositório
     * - examples/cancel-signature-request (Cancelamento de assinatura)
     * - examples/resend-signature-request (Reenvio de assinatura)
     */
  } catch (error) {
    console.log('Ocorreu um erro', error);
  }
}

execute();
