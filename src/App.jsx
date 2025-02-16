import { BrowserRouter, Route, Routes } from "react-router"
import NotFound from "./NotFound"
import Dashboard from "./Dashboard"
import { Auth } from "./Auth"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
