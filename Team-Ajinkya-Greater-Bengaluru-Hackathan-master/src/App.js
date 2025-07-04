



//import PlagiarismChecker from './components/plagorism';

import 'antd/dist/reset.css'; 
//import Draw from './components/drawer';
import './App.css';
import LoginPage from './pages/Loginpage';


function App() {
//   const [text, setText] = useState('');
//     const [plagiarismResult, setPlagiarismResult] = useState(null);
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleCheckPlagiarism = async () => {
//         if (!text) {
//             setError('Please provide text to check.');
//             return;
//         }

//         setLoading(true);
//         setError('');

//         try {
//             // Send the text to the backend
//             const response = await axios.post('http://localhost:5000/check', {
//                 text,
//             });

//             // Set the plagiarism result from the backend response
//             setPlagiarismResult(response.data.plagiarism_result);
//         } catch (err) {
//             setError('An error occurred while checking plagiarism.');
//             console.error(err);
//         } finally {
//             setLoading(false);
   //    }
   // };
  return (
    <div className="App">
        <LoginPage/>

       
        
        
            {/* <h1>Plagiarism Checker</h1>
            <div>
                <textarea
                    placeholder="Enter text to check for plagiarism"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <button onClick={handleCheckPlagiarism} disabled={loading}>
                {loading ? 'Checking...' : 'Check Plagiarism'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {plagiarismResult && (
                <div>
                    <h2>Plagiarism Result</h2>
                    <pre>{JSON.stringify(plagiarismResult, null, 2)}</pre>
                </div>
            )} */}
        </div>
    );
}

export default App;