import { Account, Client, Databases, Storage } from 'appwrite';

const client = new Client();

export const PROJECT_ID = '6460e8d79457e3593750';

client.setEndpoint('http://localhost/v1').setProject(PROJECT_ID);
const account = new Account(client);

const storage = new Storage(client);

const databases = new Databases(client);

export const appWrite = { account, client, storage, databases };
