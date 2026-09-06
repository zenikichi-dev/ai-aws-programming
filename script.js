
//const API_GATEWAY_URL = "https://your-api-id.execute-api.ap-northeast-1.amazonaws.com/prod/register";
const API_GATEWAY_URL = "https://rupjg7pkkh.execute-api.us-east-1.amazonaws.com/dev/hello";
const form = document.querySelector("#registration-form");
const submitButton = form.querySelector("button");
const formError = document.querySelector("#form-error")
const overallStatus = document.querySelector("#overall-status");
const resultTitle = document.querySelector("#result-title");
const resultMessage = document.querySelector("#result-message");
const responseBox = document.querySelector("#response-box");
const responseContent = document.querySelector("#response-content");

function setStepState(step, state, label) {
  const card = document.querySelector(`[data-step="${step}"]`);
  if (!card) return;
  card.classList.remove("is-active", "is-success", "is-failure");
  if (state !== "ready") card.classList.add(`is-${state}`);
  card.querySelector(".path-state").textContent = label;
}
function setOverallStatus(state, label) { overallStatus.className = `status-badge status-${state}`; overallStatus.textContent = label; }
function showError(message) { formError.textContent = message; formError.hidden = false; }
function clearError() { formError.textContent = ""; formError.hidden = true; }
function setLoadingState() {
  setOverallStatus("loading", "接続確認中");
  ["pages", "gateway", "lambda", "python"].forEach((step) => setStepState(step, "active", "確認中"));
  resultTitle.textContent = "登録処理をAWS Lambdaに送信しています…";
  resultMessage.textContent = "GitHub PagesからAPI Gatewayを経由して、Lambdaのレスポンスを待っています。";
  responseBox.hidden = true; submitButton.disabled = true; submitButton.textContent = "送信中…";
}
function setSuccessState(response) {
  setOverallStatus("success", "接続成功");
  ["pages", "gateway", "lambda", "python"].forEach((step) => setStepState(step, "success", "接続成功"));
  resultTitle.textContent = "AWS Lambdaとの接続成功！";
  resultMessage.textContent = "GitHub PagesからLambdaまでの通信を確認できました。";
  responseContent.textContent = JSON.stringify(response); responseBox.hidden = false;
}
function setFailureState(message) {
  setOverallStatus("error", "接続失敗"); setStepState("pages", "success", "接続成功");
  ["gateway", "lambda", "python"].forEach((step) => setStepState(step, "failure", "接続失敗"));
  resultTitle.textContent = "AWS Lambdaとの接続に失敗しました"; resultMessage.textContent = message; responseBox.hidden = true;
}
function resetButton() { submitButton.disabled = false; submitButton.innerHTML = '登録する <span aria-hidden="true">→</span>'; }

form.addEventListener("submit", async (event) => {
  event.preventDefault(); clearError();
  const username = document.querySelector("#username").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;
  const confirmation = document.querySelector("#password-confirmation").value;
  if (!form.checkValidity()) { showError("入力内容を確認してください。パスワードは8文字以上で入力します。"); form.reportValidity(); return; }
  if (password !== confirmation) { showError("パスワードとパスワード確認が一致していません。"); return; }
  setLoadingState();
  try {
    if (API_GATEWAY_URL.includes("your-api-id")) throw new Error("API GatewayのURLがまだ設定されていません。script.jsの設定値を変更してください。");
    const gatewayResponse = await fetch(API_GATEWAY_URL);
    const response = await gatewayResponse.json();
    const lambdaBody = typeof response.body === "string" ? response.body : response.body;
    const successMessages = ["Hello from Lambda!", "Hello from AWS Lambda!"];
    if (gatewayResponse.ok && (successMessages.includes(response.message) || response.statusCode === 200 && (successMessages.includes(lambdaBody) || successMessages.includes(lambdaBody?.message)))) setSuccessState(response);
    else throw new Error("Lambdaから想定したレスポンスが返りませんでした。");
  } catch (error) { setFailureState(error.message || "通信中に予期しないエラーが発生しました。"); showError(`エラー内容：${error.message || "通信中に予期しないエラーが発生しました。"}`); }
  finally { resetButton(); }
});