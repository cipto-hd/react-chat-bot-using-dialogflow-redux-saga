import { createStore, applyMiddleware } from "redux";
import ChatMessageReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import chatbot from "../redux-sagas/chat-bot";

const logger = () => next => action => {
  console.log("[logger]: ", action.type);
  next(action);
};

const sagaMiddleware = createSagaMiddleware();

export default createStore(
  ChatMessageReducer,
  applyMiddleware(logger, sagaMiddleware)
);

sagaMiddleware.run(chatbot);
