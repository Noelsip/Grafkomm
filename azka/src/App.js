import './index.css';
import Canvas from './components/Canvas';
import DataTable from './components/DataTable';
import React from 'react';

function App() {
  const [tinggiBenda, setTinggiBenda] = React.useState(100);
  const [jarakBenda, setJarakBenda] = React.useState(100);
  const [titikFokus, setTitikFokus] = React.useState(50);
  const [tinggiBayangan, setTinggiBayangan] = React.useState(0);
  const [jarakBayangan, setJarakBayangan] = React.useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900">
      {/* Judul */}
      <div className="title text-white">SIMULASI CERMIN CEKUNG
        </div>
      {/* Container untuk Canvas dan DataTable */}
      <div className="container flex flex-row w-full justify-center items-start p-5">
        
        {/* Canvas */}
        <div className="canvas-container bg-gray-800 p-5 rounded-lg shadow-lg flex-2 flex justify-center">
          <Canvas 
            tinggiBenda={tinggiBenda} 
            jarakBenda={jarakBenda} 
            titikFokus={titikFokus} 
            setTinggiBayangan={setTinggiBayangan} 
            setJarakBayangan={setJarakBayangan} 
          />
        </div>

        {/* DataTable */}
        <div className="table-container bg-gray-800 p-5 rounded-lg shadow-lg flex-1 flex justify-center">
          <DataTable 
          tinggiBenda={tinggiBenda} setTinggiBenda={setTinggiBenda} 
          jarakBenda={jarakBenda} setJarakBenda={setJarakBenda} 
          titikFokus={titikFokus} setTitikFokus={setTitikFokus} 
          tinggiBayangan={tinggiBayangan} 
          jarakBayangan={jarakBayangan} 
          />

        </div>
      </div>

      {/* Footer */}
      <div className="flex m-5 p-5 items-center justify-center">
        <h1 className="flex text-lg font-semibold text-stone-50">
          <span className="p-1"></span>
        </h1>
      </div>
    </div>
  );
}

export default App;
