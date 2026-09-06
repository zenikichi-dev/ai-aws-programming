# AWS × GitHub 学習アプリ

GitHub PagesのWeb画面から、API Gateway経由でAWS Lambdaを呼び出す初心者向け学習アプリです。

## ファイル構成

`index.html` は画面とフォーム、`styles.css` はレスポンシブな見た目、`script.js` はフォーム検証・API Gateway呼び出し・接続状態表示を担当します。

## GitHubへの保存方法

1. GitHubでリポジトリを作成します。
2. `index.html`、`styles.css`、`script.js` をリポジトリの一番上に保存します。
3. GitHubで変更をCommit（保存）します。

## GitHub Pagesで公開する方法

1. リポジトリの `Settings` > `Pages` を開きます。
2. `Deploy from a branch`、Branchは `main`、フォルダーは `/ (root)` を選択して保存します。
3. 表示されたURLをブラウザーで開きます。

## API GatewayのURLを設定する場所

`script.js` の先頭にある `API_GATEWAY_URL` を、API GatewayのエンドポイントURLに変更します。AWSアクセスキーや秘密情報はHTMLやJavaScriptに書きません。

## AWS Lambda側で必要な設定

Python Lambdaに `GET /hello` を統合し、CORSでブラウザーからのGETを許可します。最初は次のレスポンスを返してください。

```python
def lambda_handler(event, context):
	return {
		"statusCode": 200,
		"headers": {"Access-Control-Allow-Origin": "*"},
		"body": "Hello from AWS Lambda!"
	}
```

この画面はパスワードをLambdaへ送信せず、保存もしません。本格的な認証は別途Cognitoなどで実装します。

## 動作確認方法

1. `script.js` にAPI Gateway URLを設定します。
2. GitHub Pagesを開いて4項目を入力し、`登録する` を押します。
3. 「接続確認中」から「接続成功」に変わり、レスポンスが表示されれば成功です。
4. 失敗時は画面のエラー内容とブラウザーの開発者ツールのConsoleを確認します。