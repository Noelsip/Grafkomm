import './index.css';
import Canvas from './components/Canvas';
import Slider from './components/Slider';
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
      <div className="m-5 p-5 text-center">
        <h1 className="text-3xl font-semibold text-stone-50">Concave Simulation App</h1>
      </div>

      {/* Canvas - Dipastikan Berada di Tengah */}
      <div className="flex justify-center items-center w-full min-h-[60vh]">
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg">\
          <Canvas 
            tinggiBenda={tinggiBenda} 
            jarakBenda={jarakBenda} 
            titikFokus={titikFokus} 
            setTinggiBayangan={setTinggiBayangan} 
            setJarakBayangan={setJarakBayangan} 
          />
        </div>
      </div>

      {/* DataTable & Sliders */}
      <div className="flex flex-col items-center justify-center md:flex-row md:gap-10 mt-5">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <DataTable 
            tinggiBenda={tinggiBenda} 
            jarakBenda={jarakBenda} 
            titikFokus={titikFokus} 
            tinggiBayangan={tinggiBayangan} 
            jarakBayangan={jarakBayangan} 
          />
        </div>

        <div className="flex flex-col gap-4 items-center p-5 bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-lg font-semibold text-stone-50">Ukuran Benda</h1>
          <Slider value={tinggiBenda} setValue={setTinggiBenda} minValue={0} maxValue={300} label={'cm'} />

          <h1 className="text-lg font-semibold text-stone-50">Jarak Benda</h1>
          <Slider value={jarakBenda} setValue={setJarakBenda} minValue={0} maxValue={300} label={'cm'} />

          <h1 className="text-lg font-semibold text-stone-50">Titik Fokus Lensa</h1>
          <Slider value={titikFokus} setValue={setTitikFokus} minValue={-100} maxValue={100} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex m-5 p-5 items-center justify-center">
        <h1 className="flex text-lg font-semibold text-stone-50">
          GRAFKOM <span className="p-1"></span> Kelompok 9 ANJAY
        </h1>
      </div>
    </div>
  );
}

export default App;
