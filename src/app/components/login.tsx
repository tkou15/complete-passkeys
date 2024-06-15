'use client';

import { base64url } from '@/utils/base64url';
import { AuthenticationResponseJSON } from '@simplewebauthn/types';

export default function Login() {
  async function authentication() {
    // 条件付きUIがサポートされているかの確認
    if (!(await PublicKeyCredential.isConditionalMediationAvailable())) {
      return;
    }
    const res = await fetch('/api/signin-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const options = await res.json();
    options.challenge = base64url.decode(options.challenge);

    options.allowCredentials = [];
    // パスキーの公開鍵認証情報を取得
    const credential = await navigator.credentials.get({
      publicKey: options,
      mediation: 'conditional',
    });

    const publicKeyCredential = credential as PublicKeyCredential;
    const authenticatorAssertionResponse =
      publicKeyCredential.response as AuthenticatorAssertionResponse;

    // simplewebauthnで用意されている認証用の型に変換
    const responseJSON: AuthenticationResponseJSON = {
      id: publicKeyCredential.id,
      rawId: publicKeyCredential.id,
      type: publicKeyCredential.type as PublicKeyCredentialType,
      response: {
        authenticatorData: base64url.encode(
          authenticatorAssertionResponse.authenticatorData
        ),
        clientDataJSON: base64url.encode(
          publicKeyCredential.response.clientDataJSON
        ),
        signature: base64url.encode(authenticatorAssertionResponse.signature),
        userHandle: base64url.encode(
          authenticatorAssertionResponse.userHandle!
        ),
      },
      clientExtensionResults: publicKeyCredential.getClientExtensionResults(),
    };

    // サーバーにレスポンスボディを送信
    const result = await fetch('/api/signin-response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // サーバーで生成したチャレンジをヘッダーに含める
        Challenge: base64url.encode(options.challenge),
      },
      body: JSON.stringify(responseJSON),
    });

    alert(`認証に${(await result.json()).success ? '成功' : '失敗'}しました`);
  }
  return (
    <div className="m-8 p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-800">
      <div className="flex flex-col items-center">
        <h1 className="mb-16 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl dark:text-white">
          Login
        </h1>
        <button
          type="button"
          className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-m px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          onClick={authentication}
        >
          PassKeyでログイン
        </button>
      </div>
    </div>
  );
}
