import { CredentialResponse } from '@react-oauth/google';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
          }) => void;
          prompt: () => void;
          cancel: () => void;
        };
      };
    };
  }
}
