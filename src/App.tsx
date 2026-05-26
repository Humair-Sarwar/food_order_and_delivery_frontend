import { ToastContainer } from "react-toastify"
import AppRoutes from "./routes/AppRoutes"


function App() {

  return (
    <>
      <AppRoutes/>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App
