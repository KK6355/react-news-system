import "./App.css";
import store from "./redux/store";
import IndexRouter from "./router/IndexRouter";
import { Provider } from "react-redux";
function App() {
  return (
    <Provider store={store}>
      <IndexRouter />
    </Provider>
  );
}

export default App;
