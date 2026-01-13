import { RouterProvider } from "react-router-dom";
import router from "./router";
import Providers from "./providers";

const App = () => {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
};

export default App;
