# Consultando o status de assinatura de um contrato e de cada participante

Cada contrato possui um Proof, onde são armazenados de forma imutável uma série de documentos para comprovações e verificações.

Um contrato pode ter mais de um Proof em caso do usuário cancelar a solicitação de assinatura para realizar uma correção e solicitar novamente, por exemplo.

O status de um Proof pode ser: **pending**, **completed** ou **canceled**.

* **pending**: O contrato está aguardando a assinatura de todos os participantes.
* **completed**: O contrato foi assinado por todos os participantes.
* **canceled**: A solicitação de assinaturas foi cancelada.

Proof Subject é cada participante do contrato, mas **diferente de um Proof ele não tem um status para identificar se o contrato foi assinado por ele ou não**. Para isto, existe a chave **confirmed_at, pois é ela quem vai nos dizer se o participante assinou ou não o contrato**.

**Neste exemplo você vai aprender:**

 - Consultar o status de assinatura de um contrato.
 - Consultar o status de assinatura de um participante (ou mais).

**Com as informações obtidas nesse exemplo, você poderá:**

* Cancelar a solicitação de assinaturas de um contrato, utilizando o endpoint de DELETE /proofs/:id
* Reenviar a solicitação de assinatura por e-mail, utilizando o endpoint de POST /proofs/:id/subjects/:proof_subject_id/remind

Ou, utilizando os exemplos em JavaScript presente nesse repositório:

* examples/resend-signature-request (Reenvio de assinatura)

Na seção **Contract**, **Proof**,  e **ProofSubject** da [nossa documentação](https://developers.contraktor.com.br/) você irá encontrar os endpoints e schemas disponíveis.