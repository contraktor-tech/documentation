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
 * Exemplo de como reenviar uma solicitação de assinatura por e-mail.
 */
async function execute() {
  try {
    console.log('1. Buscando contrato pelo ID..');

    // ID do Contrato
    const contractId = 2188455;

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
     * Para realizar o reenvio de uma solicitação de assinatura por e-mail
     * precisamos de duas informações: ID do Proof e ID do Proof Subject (Participante).
     * 
     * 
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

    console.log('2. Buscando Proof..');
    const proof = contract.current_document.proofs[0];

    /**
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
    console.log('3. Buscando Proof Subjects..')
    const proofSubjects = proof.subjects;

    /**  
     * Neste exemplo vamos filtrar por participantes que ainda não assinaram, no caso: confirmed_at === null.
    */

    // Participantes que ainda não assinaram devem possuir a coluna confirmed_at vazia/nula.
    console.log('4. Buscando participantes que ainda não assinaram..');
    const missingSignatureSubjects = proofSubjects.filter((subject) => !subject.confirmed_at);

    console.log('Proof ID', proof.id);
    console.log('Participantes que ainda não assinaram', missingSignatureSubjects.map((subject) => subject.id + ' - ' + subject.name + ' - ' + subject.email));

    /**
     * Com os participantes que ainda não assinaram em mãos,
     * podemos fazer um loop e realizar as solicitações ou 
     * podemos realizar a solicitação de um só participante.
     * 
     * Neste exemplo vamos mandar apenas para o primeiro participante da lista.
     */

    // Buscando o primeiro da lista.
    console.log('5. Buscando primeiro participante da lista..');
    const firstProofSubject = missingSignatureSubjects[0];

    console.log(`6. Reenviando solicitação de assinatura para o participante ${firstProofSubject.name} - ${firstProofSubject.email}..`);

    // Enviando requisição para endpoint /proofs/:proof_id/subjects/:subject_id/remind
    await contraktorAPI.post(`/proofs/${proof.id}/subjects/${firstProofSubject.id}/remind`)
      .then((res) => console.log('Done. Solicitação de assinatura reenviada com sucesso!'));

  } catch (error) {
    console.log('Ocorreu um erro', error);
  }
}

execute();
