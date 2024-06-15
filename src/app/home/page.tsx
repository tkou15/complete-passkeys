'use client';

import { base64url } from '@/utils/base64url';
import {
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
  RegistrationResponseJSON,
} from '@simplewebauthn/types';

export default function Home() {
  async function registerCredential() {
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
      // サーバーにレスポンスボディを送信
      await fetch('/api/register-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // サーバーで生成したチャレンジをヘッダーに含める
          Challenge: base64url.encode(options.challenge),
        },
        body: JSON.stringify(responseJSON),
      });
    } catch (e) {
      console.error('Credential の作成に失敗しました');
    }
  }

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Passkeys</h1>
      <button onClick={registerCredential}>PassKeysを登録</button>
      <button onClick={authentication}>PassKeyでログイン</button>
    </main>
  );
}
