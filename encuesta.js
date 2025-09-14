
document.addEventListener('DOMContentLoaded', function(){
  const opciones = document.querySelectorAll('.opcion');
  const btnVotar = document.getElementById('btnVotar');
  const resultadosDiv = document.getElementById('resultados');
  const listaResultados = document.getElementById('lista-resultados');
  const stored = JSON.parse(localStorage.getItem('velum_votos')) || {
    Camila:0, Diego:0, "Lucía":0, Mateo:0, "Sofía":0, "Andrés":0, Clara:0, "Julián":0
  };
  let seleccion = null;
  // make options selectable
  opciones.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      opciones.forEach(b=>b.classList.remove('seleccionada'));
      btn.classList.add('seleccionada');
      seleccion = btn.dataset.valor;
    });
  });

  btnVotar.addEventListener('click', ()=>{
    if(!seleccion){ alert('Selecciona un sospechoso antes de votar.'); return; }
    stored[seleccion] = (stored[seleccion]||0) + 1;
    localStorage.setItem('velum_votos', JSON.stringify(stored));
    // show results
    mostrarResultados();
  });

  function mostrarResultados(){
    document.getElementById('opciones-encuesta').style.display = 'none';
    resultadosDiv.style.display = 'block';
    listaResultados.innerHTML = '';
    const total = Object.values(stored).reduce((a,b)=>a+b,0);
    for(const k in stored){
      const pct = total ? ((stored[k]/total)*100).toFixed(1) : 0;
      const li = document.createElement('li');
      li.textContent = `${k}: ${stored[k]} votos (${pct}%)`;
      listaResultados.appendChild(li);
    }
  }

  // if user already voted (simple check could be implemented), but we'll show current state only after vote
});
