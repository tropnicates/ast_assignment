import './App.css'
import Navbar from './components/Navbar/Navbar';
import RuleEditor from './components/RuleEditor/RuleEditor';
import RuleEvaluator from './components/RuleEvaluator/RuleEvaluator';
import RuleForm from './components/RuleForm/RuleForm';
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div className='App'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<RuleForm/>} />
        <Route path='/rule-editor' element={<RuleEditor/>} />
        <Route path='/rule-evaluator' element={<RuleEvaluator/>} />
      </Routes>
    </div>
  )
}

export default App
