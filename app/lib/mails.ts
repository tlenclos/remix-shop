import SendInBlue from "@sendinblue/client";

const emailAPi = new SendInBlue.TransactionalEmailsApi();

emailAPi.setApiKey(
  SendInBlue.TransactionalEmailsApiApiKeys.apiKey,
  process.env.SENDINBLUE_API_KEY
);

export default emailAPi;
