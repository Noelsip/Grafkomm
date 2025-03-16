import './index.css';
import Canvas from './components/Canvas'
import Slider from './components/Slider'
import DataTable from './components/DataTable'
import { FcLike } from "react-icons/fc";
import React from 'react';

function App() {
  const [tinggiBenda, setTinggiBenda] = React.useState(100)
  const [jarakBenda, setJarakBenda] = React.useState(100)
  const [titikFokus, setTitikFokus] = React.useState(50)
  const [tinggiBayangan, setTinggiBayangan] = React.useState(0)
  const [jarakBayangan, setJarakBayangan] = React.useState(0)

  return(
    <div>
      <div className="flex m-5 p-5 items-center justify-center">
        <h1 className="text-3xl font-semibold text-stone-50">Concave Simulation App</h1>
      </div>
      <div className="flex md:m-10">
        <Canvas tinggiBenda={tinggiBenda} jarakBenda={jarakBenda} titikFokus={titikFokus} setTinggiBayangan={setTinggiBayangan} setJarakBayangan={setJarakBayangan} />
      </div>
      <div className='flex flex-col m-10 items-center justify-center md:flex-row'>
        <div className='flex'>
          <DataTable tinggiBenda={tinggiBenda} jarakBenda={jarakBenda} titikFokus={titikFokus} tinggiBayangan={tinggiBayangan} jarakBayangan={jarakBayangan} />
        </div>
        <div className="flex flex-col m-5 p-5 gap-2 items-center justify-center">
          <h1 className="text-lg font-semibold text-stone-50">Ukuran Benda</h1>
          <Slider value={tinggiBenda} setValue={setTinggiBenda} minValue={0} maxValue={300} label={'cm'}/>
          <h1 className="text-lg font-semibold text-stone-50">Jarak Benda</h1>
          <Slider value={jarakBenda} setValue={setJarakBenda} minValue={0} maxValue={300} label={'cm'}/>
          <h1 className="text-lg font-semibold text-stone-50">Titik Fokus Lensa</h1>
          <Slider value={titikFokus} setValue={setTitikFokus} minValue={-100} maxValue={100}/>
        </div>
      </div>
      <div className="flex m-5 p-5 items-center justify-center">
        <h1 className="flex text-lg font-semibold text-stone-50">Made with <span className="p-1"><FcLike /></span> Kelompok 4 </h1> 
      </div>
    </div>
  );
}

export default App;
