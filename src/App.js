import React, { useState } from 'react';
import ResponseDisplay from './components/ResponseDisplay';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const jsonInput = JSON.parse(input);
      if (!jsonInput.data) {
        throw new Error('Invalid JSON input');
      }

      const res = await fetch('https://bajaj-backend-ejvk.onrender.com/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonInput)
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await res.json();
      setResponse(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOptions(
      selectedOptions.includes(value)
        ? selectedOptions.filter(option => option !== value)
        : [...selectedOptions, value]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <header className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-4 text-center">BFHL API Client</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Enter JSON input, e.g., { "data": ["A", "C", "z"] }'
            rows="4"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {response && (
          <div className="mt-6">
            <div className="flex flex-col gap-2 mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="alphabets"
                  checked={selectedOptions.includes('alphabets')}
                  onChange={handleOptionChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Alphabets</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="numbers"
                  checked={selectedOptions.includes('numbers')}
                  onChange={handleOptionChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Numbers</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="highest_alphabet"
                  checked={selectedOptions.includes('highest_alphabet')}
                  onChange={handleOptionChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Highest Alphabet</span>
              </label>
            </div>
            <ResponseDisplay response={response} selectedOptions={selectedOptions} />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
