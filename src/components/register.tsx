'use client';

import { base64url } from '@/utils/base64url';
import {
  AuthenticatorTransportFuture,
  RegistrationResponseJSON,
} from '@simplewebauthn/types';

export default function Register() {
  async function registerCredential() {
    // ⓪初回リクエスト
    const res = await fetch('/api/register-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const options = await res.json();

    // base64をデコードしてArrayBufferに変換する必要がある
    options.user.id = base64url.decode(options.user.id);
    options.challenge = base64url.decode(options.challenge);

    // ②認証器を呼び出し、Passkeyを登録する
    try {
      // ユーザーが認証を拒否(キャンセルされたときは、例外がスローされる)
      const credential = await navigator.credentials.create({
        publicKey: options,
      });
      if (!credential) {
        console.error('Credential の作成に失敗しました');
        return;
      }

      // 公開鍵認証情報をサーバーへ送信する
      const publicKeyCredential = credential as PublicKeyCredential;
      const authResponse =
        publicKeyCredential.response as AuthenticatorAttestationResponse;
      // simplewebauthnのRegistrationResponseJSONを作成してサーバーに送信
      const responseJSON: RegistrationResponseJSON = {
        id: publicKeyCredential.id,
        rawId: publicKeyCredential.id,
        type: publicKeyCredential.type as PublicKeyCredentialType,
        clientExtensionResults: publicKeyCredential.getClientExtensionResults(),
        response: {
          // ArrayBuffer型のデータはbase64urlエンコードする
          attestationObject: base64url.encode(authResponse.attestationObject),
          clientDataJSON: base64url.encode(authResponse.clientDataJSON),
          transports:
            authResponse.getTransports() as AuthenticatorTransportFuture[],
        },
      };
      // 認証器のアタッチメントが存在する場合はレスポンスボディに追加
      if (publicKeyCredential.authenticatorAttachment) {
        responseJSON.authenticatorAttachment =
          publicKeyCredential.authenticatorAttachment as AuthenticatorAttachment;
      }

      //　サーバーにレスポンスボディを送信
      await fetch('/api/register-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // サーバーで生成したチャレンジをヘッダーに含める
          Challenge: base64url.encode(options.challenge),
        },
        body: JSON.stringify(responseJSON),
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="m-2 sm:m-4 md:m-8 p-4 sm:p-6 md:p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-800">
      <div className="flex flex-col items-center">
        <h1 className="mb-8 sm:mb-12 md:mb-16 text-lg sm:text-xl md:text-2xl lg:text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white text-center">
          Register
        </h1>
        <button
          type="button"
          className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm sm:text-base px-4 sm:px-5 py-2 sm:py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 w-full sm:w-auto"
          onClick={registerCredential}
        >
          PassKeysを登録
        </button>
      </div>
    </div>
  );
}
