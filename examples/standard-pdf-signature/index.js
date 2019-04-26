const { createReadStream } = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

/** @global The URL of Contraktor API */
const API_URL = 'http://localhost:4000/api';
/** @global The API_KEY to use in requests (extracted for environment variable) */
const API_KEY = process.env.API_KEY;

async function handleApiResponse(res) {
  const body = await res.json();

  if (!res.ok) { // status code < 200 or >= 400
    throw new Error(`API responded with status code ${res.status} (${res.statusText}):\n${JSON.stringify(body, null, 2)}`)
  }

  return body;
}

/**
 * Uploads a file by its filename to Contraktor
 *
 * @param {string} filename - Path to the file in you filesystem to upload
 *
 * @returns {Promise} Returns a promise that resolves to the created File resource.
 */
function uploadFile(filename) {
  const form = new FormData();
  form.append('file', createReadStream(filename));

  return fetch(`${API_URL}/files`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    },
    body: form
  })
    .then(handleApiResponse)
    .then((res) => res.data);
}

/**
 * Creates a party in Contraktor
 *
 * @param {Object} data - Data of the party to create
 *
 * @returns {Promise} Returns a promise that resolves to the created Party resource.
 */
function createParty(data) {
  return fetch(`${API_URL}/parties`, {
    method: 'POST',
    body: JSON.stringify({
      party: data
    }),
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  })
    .then(handleApiResponse)
    .then((res) => res.data);
}

/**
 * Creates a contract using a uploaded file as base in Contraktor
 *
 * @param {Object} file - File resource to use as base to create the contract
 *
 * @returns {Promise} Returns a promise that resolves to the created Contract resource.
 */
function createContractFromFile(file) {
  return fetch(`${API_URL}/contracts`, {
    method: 'POST',
    body: JSON.stringify({
      contract: {
        document: {
          file_id: file.id
        },
        title: 'New Contract via API',
        classifier: ['API'],
        custom_fields: [
          {
            key: 'Custom',
            value: 'test'
          }
        ]
      }
    }),
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  })
    .then(handleApiResponse)
    .then((res) => res.data);
}

/**
 * Shares a contract with a party in Contraktor
 *
 * @param {Object} contract - Contract resource in wich the sharing will be applied
 * @param {string} qualification - Qualification to use for the Sharing
 * @param {Object} party - The Party object to use for the Sharing (PF)
 * @param {Object} [company] - If the Party represents a company, use this field to specify the Party object containing data for the company (PJ)
 *
 * @returns {Promise} Returns a promise that resolves to the created Sharing resource.
 */
function createContractSharing(contract, qualification, party, company) {
  return fetch(`${API_URL}/contracts/${contract.id}/shares`, {
    method: 'POST',
    body: JSON.stringify({
      sharing: {
        qualification: qualification,
        party_id: party.id,
        company_id: company ? company.id : undefined
      }
    }),
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  })
    .then(handleApiResponse)
    .then((res) => res.data);
}

/**
 * Starts a proof process in Contraktor
 *
 * @param {Object} contract - Contract resource in which the proof will be created
 * @param {string} engine - Name of the engine to use for the proof
 *
 * @returns {Promise} Returns a promise that resolves to the created Proof resource.
 */
function createProof(contract, engine) {
  return fetch(`${API_URL}/proofs`, {
    method: 'POST',
    body: JSON.stringify({
      proof: {
        contract_id: contract.id,
        engine: engine
      }
    }),
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  })
    .then(handleApiResponse)
    .then((res) => res.data);
}

async function main() {
  /*
    First we need to upload the file we want to sign to Contraktor.
    This will create a File record that we can later use to create and sign
    an actual contract.
  */
  const file = await uploadFile(path.resolve(__dirname, 'documento.pdf'));

  /*
    With the file uploaded, we will now create the actual contract,
    using the file as the main document.
  */
  const contract = await createContractFromFile(file);

  /*
    Create two parties of type PF (person) and one of type PJ (company),
    as we will be sending the signature request for them.
  */
  const party1 = await createParty({
    person_type: 'pf',
    name: 'Person One',
    email: 'person.one@email.com'
  });
  const party2 = await createParty({
    person_type: 'pf',
    name: 'Person Two',
    email: 'person.two@email.com'
  });
  const company1 = await createParty({
    person_type: 'pj',
    name: 'Company One',
    email: 'company.one@email.com'
  });

  /*
    Share the contract with those two parties (party1, party2). Note
    that party2 is being set as legal representative for company1.
  */
  await createContractSharing(contract, qualification, party1);
  await createContractSharing(contract, qualification, party2, company1);

  /*
    Begin the signature process by creating a Proof of type 'standard' on
    the contract.
    At this point, both parties will be emailed with the request for
    signature.
  */
  const proof = await createProof(contract, 'standard');

  console.log('Assinatura iniciada:');
  console.log(JSON.stringify(proof, null, 2));
  console.log();
}

main()
  .then(() => console.log('Done.'))
  .catch((error) => console.error(error));
