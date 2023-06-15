# Reenviando solicitação de assinatura por e-mail

Cada contrato possui um Proof, onde são armazenados de forma imutável uma série de documentos para comprovações e verificações.

Um contrato pode ter mais de um Proof em caso do usuário cancelar a solicitação de assinatura para realizar uma correção e solicitar novamente, por exemplo.

Proof Subject é cada participante do contrato, mas **diferente de um Proof ele não tem um status para identificar se o contrato foi assinado por ele ou não**. Para isto, existe a chave **confirmed_at, pois é ela quem vai nos dizer se o participante assinou ou não o contrato**.

**Neste exemplo você vai aprender:**

 - Reenviar uma ou mais solicitações de assinatura por e-mail.

**Com as informações obtidas nesse exemplo, você poderá:**

* Reenviar a solicitação de assinatura por e-mail, utilizando o endpoint de POST /proofs/:id/subjects/:proof_subject_id/remind

Na seção **Contract**, **Proof**,  e **ProofSubject** da [nossa documentação](https://developers.contraktor.com.br/) você irá encontrar os endpoints e schemas disponíveis.