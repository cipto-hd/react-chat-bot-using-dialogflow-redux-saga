import { ApiAiClient } from "api-ai-javascript";
import to from "await-to-js";
import types from "../store/action-types";
import { msgChatMessageSuccess, msgChatMessageError } from "../store/actions";
import randomBool from "random-bool";
import { put, takeEvery, select } from "redux-saga/effects";

const client = new ApiAiClient({
  accessToken: "e0358ac042804c7d9eca9e90e5bb22cb"
});

function* asyncSendMessage(text) {
  // async to Dialogflow
  const [err, response] = yield to(client.textRequest(text));
  // console.log(response);
  const { result: { fulfillment: { speech } } } = response;

  return [err, speech];
}

function* processChatMessageRequest(action) {
  const messagesLength = select(state => state.messages.length);
  const { text } = action.payload.message;

  console.log("[chatbot:start async] ");
  console.log("[chatbot:async start] messages length: ", yield messagesLength);
  let [err, speech] = yield asyncSendMessage(text);
  console.log("[chatbot:finish async] ");

  // simulate error
  err = randomBool({ likelihood: 10 }) ? new Error("Error, bro!") : null;

  console.log("[Error Check]: ", err);
  // conditionally send action message based upon error var
  yield put(err ? msgChatMessageError(err) : msgChatMessageSuccess(speech));

  // executed asynchronously after messages has increased
  console.log("[chatbot:async finish] messages length: ", yield messagesLength);
}

export default function* chatbot() {
  yield takeEvery(types["CHAT/MESSAGE_REQUEST"], processChatMessageRequest);
}
