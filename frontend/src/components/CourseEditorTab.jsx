// ============================================================
// COMPONENTE: CourseEditorTab.jsx
// FUNCIÓN: Pestaña del panel docente para crear, editar y borrar
//          cursos, lecciones y ejercicios de sus materias.
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  BookOpen, Plus, Trash2, ChevronDown, ChevronRight,
  Save, X, Edit2, PlaySquare, HelpCircle, Loader2
} from 'lucide-react';
import axiosInstance from '../api/axios';

// ── Formulario para crear/editar UN CURSO ──
function CursoForm({ niveles, cursoEditando, onGuardar, onCancelar }) {
  const [titulo, setTitulo] = useState(cursoEditando?.title || '');
  const [descripcion, setDescripcion] = useState(cursoEditando?.description || '');
  const [xp, setXp] = useState(cursoEditando?.xp_reward || 100);
  const [nivelId, setNivelId] = useState(cursoEditando?.knowledge_level || (niveles[0]?.id || ''));
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const payload = { title: titulo, description: descripcion, xp_reward: xp, knowledge_level: nivelId };
      if (cursoEditando) {
        await axiosInstance.put(`teachers/mis-cursos/${cursoEditando.id}/`, payload);
      } else {
        await axiosInstance.post('teachers/mis-cursos/', payload);
      }
      onGuardar();
    } catch (err) {
      alert(err.response?.data?.detail || err.response?.data?.error || 'Error al guardar el curso.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/60 border border-indigo-500/30 rounded-2xl p-6 mb-4 space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-indigo-400" />
        {cursoEditando ? 'Editar curso' : 'Nuevo curso'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Título</label>
          <input
            className="input w-full bg-slate-900/60 border-white/10 text-white rounded-xl focus:border-indigo-500 focus:outline-none"
            value={titulo} onChange={e => setTitulo(e.target.value)} required placeholder="Título del curso"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">XP que otorga</label>
          <input
            type="number" min="10" max="1000"
            className="input w-full bg-slate-900/60 border-white/10 text-white rounded-xl focus:border-indigo-500 focus:outline-none"
            value={xp} onChange={e => setXp(Number(e.target.value))} required
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Descripción</label>
        <textarea
          className="textarea w-full bg-slate-900/60 border-white/10 text-white rounded-xl focus:border-indigo-500 focus:outline-none min-h-[80px]"
          value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción del curso"
        />
      </div>

      <div>
        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Nivel (materia)</label>
        <select
          className="select w-full bg-slate-900/60 border-white/10 text-white rounded-xl focus:border-indigo-500 focus:outline-none"
          value={nivelId} onChange={e => setNivelId(Number(e.target.value))} required
        >
          {niveles.map(n => (
            <option key={n.id} value={n.id}>{n.category_name} — {n.name}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={guardando}
          className="btn bg-indigo-600 hover:bg-indigo-500 text-white border-none rounded-xl flex-1">
          {guardando ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Guardar</>}
        </button>
        <button type="button" onClick={onCancelar}
          className="btn btn-ghost text-slate-400 hover:text-white border border-white/10 rounded-xl">
          <X className="w-4 h-4" /> Cancelar
        </button>
      </div>
    </form>
  );
}

// ── Formulario para crear/editar UNA LECCIÓN ──
function LeccionForm({ cursoId, leccionEditando, onGuardar, onCancelar }) {
  const [titulo, setTitulo] = useState(leccionEditando?.title || '');
  const [videoUrl, setVideoUrl] = useState(leccionEditando?.video_url || '');
  const [teoria, setTeoria] = useState(leccionEditando?.theory_content || '');
  const [orden, setOrden] = useState(leccionEditando?.order || 1);
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const payload = { title: titulo, video_url: videoUrl, theory_content: teoria, order: orden, course: cursoId };
      if (leccionEditando) {
        await axiosInstance.put(`teachers/lecciones/${leccionEditando.id}/`, payload);
      } else {
        await axiosInstance.post('teachers/lecciones/', payload);
      }
      onGuardar();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al guardar la lección.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-700/40 border border-cyan-500/20 rounded-xl p-4 my-3 space-y-3">
      <h4 className="text-cyan-300 font-bold text-sm flex items-center gap-2">
        <PlaySquare className="w-4 h-4" /> {leccionEditando ? 'Editar lección' : 'Nueva lección'}
      </h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 md:col-span-1">
          <label className="text-xs text-slate-400 block mb-1">Título de la lección</label>
          <input className="input input-sm w-full bg-slate-900/60 border-white/10 text-white rounded-lg focus:border-cyan-500 focus:outline-none"
            value={titulo} onChange={e => setTitulo(e.target.value)} required placeholder="Ej: Introducción a la suma" />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Orden</label>
          <input type="number" min="1"
            className="input input-sm w-full bg-slate-900/60 border-white/10 text-white rounded-lg focus:border-cyan-500 focus:outline-none"
            value={orden} onChange={e => setOrden(Number(e.target.value))} />
        </div>
      </div>
      <div>
        <label className="text-xs text-slate-400 block mb-1">URL del vídeo (YouTube embed)</label>
        <input className="input input-sm w-full bg-slate-900/60 border-white/10 text-white rounded-lg focus:border-cyan-500 focus:outline-none"
          value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
      </div>
      <div>
        <label className="text-xs text-slate-400 block mb-1">Contenido teórico</label>
        <textarea className="textarea textarea-sm w-full bg-slate-900/60 border-white/10 text-white rounded-lg focus:border-cyan-500 focus:outline-none min-h-[80px]"
          value={teoria} onChange={e => setTeoria(e.target.value)} placeholder="Explicación de la lección..." />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={guardando}
          className="btn btn-sm bg-cyan-600 hover:bg-cyan-500 text-white border-none rounded-lg">
          {guardando ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Save className="w-3 h-3" /> Guardar</>}
        </button>
        <button type="button" onClick={onCancelar}
          className="btn btn-sm btn-ghost text-slate-400 rounded-lg border border-white/10">
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ── Formulario para crear/editar UN EJERCICIO ──
function EjercicioForm({ leccionId, ejercicioEditando, onGuardar, onCancelar }) {
  const [pregunta, setPregunta] = useState(ejercicioEditando?.question || '');
  const [opciones, setOpciones] = useState(
    ejercicioEditando?.options ? JSON.stringify(ejercicioEditando.options) : '["Opción A", "Opción B", "Opción C", "Opción D"]'
  );
  const [respuesta, setRespuesta] = useState(ejercicioEditando?.correct_answer || '');
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let opcionesParsed;
    try {
      opcionesParsed = JSON.parse(opciones);
      if (!Array.isArray(opcionesParsed)) throw new Error();
    } catch {
      alert('Las opciones deben ser un JSON válido: ["Op1","Op2","Op3","Op4"]');
      return;
    }
    setGuardando(true);
    try {
      const payload = { question: pregunta, options: opcionesParsed, correct_answer: respuesta, lesson: leccionId };
      if (ejercicioEditando) {
        await axiosInstance.put(`teachers/ejercicios/${ejercicioEditando.id}/`, payload);
      } else {
        await axiosInstance.post('teachers/ejercicios/', payload);
      }
      onGuardar();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al guardar el ejercicio.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-4 my-2 space-y-3">
      <h5 className="text-purple-300 font-bold text-xs flex items-center gap-1">
        <HelpCircle className="w-3 h-3" /> {ejercicioEditando ? 'Editar ejercicio' : 'Nuevo ejercicio'}
      </h5>
      <div>
        <label className="text-xs text-slate-400 block mb-1">Pregunta</label>
        <input className="input input-sm w-full bg-slate-900/60 border-white/10 text-white rounded-lg focus:border-purple-500 focus:outline-none"
          value={pregunta} onChange={e => setPregunta(e.target.value)} required placeholder="¿Cuánto es 2+2?" />
      </div>
      <div>
        <label className="text-xs text-slate-400 block mb-1">Opciones (JSON: ["Op1","Op2","Op3","Op4"])</label>
        <input className="input input-sm w-full bg-slate-900/60 border-white/10 text-white rounded-lg focus:border-purple-500 focus:outline-none font-mono text-xs"
          value={opciones} onChange={e => setOpciones(e.target.value)} required />
      </div>
      <div>
        <label className="text-xs text-slate-400 block mb-1">Respuesta correcta (texto exacto de una opción)</label>
        <input className="input input-sm w-full bg-slate-900/60 border-white/10 text-white rounded-lg focus:border-purple-500 focus:outline-none"
          value={respuesta} onChange={e => setRespuesta(e.target.value)} required placeholder="Ej: Opción A" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={guardando}
          className="btn btn-sm bg-purple-600 hover:bg-purple-500 text-white border-none rounded-lg">
          {guardando ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Guardar
        </button>
        <button type="button" onClick={onCancelar}
          className="btn btn-sm btn-ghost text-slate-400 rounded-lg border border-white/10">Cancelar</button>
      </div>
    </form>
  );
}

// ── COMPONENTE PRINCIPAL: Pestaña del editor de cursos ──
export default function CourseEditorTab() {
  const [cursos, setCursos] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormCurso, setMostrarFormCurso] = useState(false);
  const [cursoEditando, setCursoEditando] = useState(null);
  const [cursosExpandidos, setCursosExpandidos] = useState({});
  const [leccionFormCursoId, setLeccionFormCursoId] = useState(null);
  const [leccionEditando, setLeccionEditando] = useState(null);
  const [ejercicioFormLeccionId, setEjercicioFormLeccionId] = useState(null);
  const [ejercicioEditando, setEjercicioEditando] = useState(null);

  const cargar = async () => {
    try {
      const [cursosRes, nivelesRes] = await Promise.all([
        axiosInstance.get('teachers/mis-cursos/'),
        axiosInstance.get('teachers/mis-cursos/niveles_disponibles/')
      ]);
      setCursos(cursosRes.data);
      setNiveles(nivelesRes.data);
    } catch (err) {
      console.error('Error cargando editor de cursos:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const toggleCurso = (id) => setCursosExpandidos(prev => ({ ...prev, [id]: !prev[id] }));

  const borrarCurso = async (id) => {
    if (!confirm('¿Eliminar este curso y todo su contenido?')) return;
    await axiosInstance.delete(`teachers/mis-cursos/${id}/`);
    cargar();
  };

  const borrarLeccion = async (id) => {
    if (!confirm('¿Eliminar esta lección y sus ejercicios?')) return;
    await axiosInstance.delete(`teachers/lecciones/${id}/`);
    cargar();
  };

  const borrarEjercicio = async (id) => {
    if (!confirm('¿Eliminar este ejercicio?')) return;
    await axiosInstance.delete(`teachers/ejercicios/${id}/`);
    cargar();
  };

  if (cargando) return (
    <div className="flex justify-center py-20">
      <span className="loading loading-ring loading-lg text-indigo-400" />
    </div>
  );

  return (
    <div className="p-6 md:p-8">
      {/* Cabecera + botón nuevo curso */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" /> Mis Cursos
          <span className="badge badge-sm bg-indigo-500/20 text-indigo-300 border-indigo-500/30 ml-1">{cursos.length}</span>
        </h2>
        <button
          onClick={() => { setMostrarFormCurso(true); setCursoEditando(null); }}
          className="btn btn-sm bg-indigo-600 hover:bg-indigo-500 text-white border-none rounded-xl gap-2"
        >
          <Plus className="w-4 h-4" /> Nuevo curso
        </button>
      </div>

      {/* Formulario de nuevo/editar curso */}
      {(mostrarFormCurso || cursoEditando) && (
        <CursoForm
          niveles={niveles}
          cursoEditando={cursoEditando}
          onGuardar={() => { setMostrarFormCurso(false); setCursoEditando(null); cargar(); }}
          onCancelar={() => { setMostrarFormCurso(false); setCursoEditando(null); }}
        />
      )}

      {/* Lista de cursos */}
      {cursos.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No tienes cursos creados todavía.</p>
          <p className="text-sm">Pulsa "Nuevo curso" para empezar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cursos.map(curso => (
            <div key={curso.id} className="bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden">
              {/* Cabecera del curso */}
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => toggleCurso(curso.id)}>
                <div className="flex items-center gap-3">
                  {cursosExpandidos[curso.id]
                    ? <ChevronDown className="w-5 h-5 text-slate-400" />
                    : <ChevronRight className="w-5 h-5 text-slate-400" />}
                  <div>
                    <p className="text-white font-bold">{curso.title}</p>
                    <p className="text-xs text-slate-500">{curso.knowledge_level_name} · {curso.xp_reward} XP · {(curso.lessons || []).length} lección(es)</p>
                  </div>
                </div>
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setCursoEditando(curso); setMostrarFormCurso(false); }}
                    className="btn btn-xs btn-ghost text-slate-400 hover:text-white rounded-lg">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button onClick={() => borrarCurso(curso.id)}
                    className="btn btn-xs btn-ghost text-red-400 hover:text-red-300 rounded-lg">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Contenido expandible: lecciones */}
              {cursosExpandidos[curso.id] && (
                <div className="px-6 pb-4 border-t border-white/5">
                  <div className="flex justify-between items-center mt-4 mb-2">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Lecciones</p>
                    <button onClick={() => { setLeccionFormCursoId(curso.id); setLeccionEditando(null); }}
                      className="btn btn-xs bg-cyan-600/80 hover:bg-cyan-500 text-white border-none rounded-lg gap-1">
                      <Plus className="w-3 h-3" /> Añadir lección
                    </button>
                  </div>

                  {leccionFormCursoId === curso.id && (
                    <LeccionForm
                      cursoId={curso.id}
                      leccionEditando={leccionEditando}
                      onGuardar={() => { setLeccionFormCursoId(null); setLeccionEditando(null); cargar(); }}
                      onCancelar={() => { setLeccionFormCursoId(null); setLeccionEditando(null); }}
                    />
                  )}

                  {(curso.lessons || []).length === 0 ? (
                    <p className="text-xs text-slate-600 italic py-2">Sin lecciones todavía.</p>
                  ) : (
                    (curso.lessons || []).map(leccion => (
                      <div key={leccion.id} className="bg-slate-700/30 border border-white/5 rounded-xl p-3 mb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <PlaySquare className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                            <span className="text-slate-200 text-sm font-semibold">{leccion.title}</span>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => { setLeccionEditando(leccion); setLeccionFormCursoId(curso.id); }}
                              className="btn btn-xs btn-ghost text-slate-400 hover:text-white rounded-lg">
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button onClick={() => borrarLeccion(leccion.id)}
                              className="btn btn-xs btn-ghost text-red-400 hover:text-red-300 rounded-lg">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Ejercicios de la lección */}
                        <div className="mt-3 ml-6">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                              Ejercicios ({(leccion.exercises || []).length})
                            </p>
                            <button onClick={() => { setEjercicioFormLeccionId(leccion.id); setEjercicioEditando(null); }}
                              className="btn btn-xs bg-purple-700/60 hover:bg-purple-600 text-white border-none rounded-lg gap-1">
                              <Plus className="w-2.5 h-2.5" /> Ejercicio
                            </button>
                          </div>

                          {ejercicioFormLeccionId === leccion.id && (
                            <EjercicioForm
                              leccionId={leccion.id}
                              ejercicioEditando={ejercicioEditando}
                              onGuardar={() => { setEjercicioFormLeccionId(null); setEjercicioEditando(null); cargar(); }}
                              onCancelar={() => { setEjercicioFormLeccionId(null); setEjercicioEditando(null); }}
                            />
                          )}

                          {(leccion.exercises || []).map(ej => (
                            <div key={ej.id} className="flex items-center justify-between text-xs text-slate-400 py-1 border-b border-white/5 last:border-0">
                              <div className="flex items-center gap-2">
                                <HelpCircle className="w-3 h-3 text-purple-400 flex-shrink-0" />
                                <span className="truncate max-w-[200px]">{ej.question}</span>
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => { setEjercicioEditando(ej); setEjercicioFormLeccionId(leccion.id); }}
                                  className="btn btn-xs btn-ghost text-slate-500 hover:text-white p-1 rounded">
                                  <Edit2 className="w-2.5 h-2.5" />
                                </button>
                                <button onClick={() => borrarEjercicio(ej.id)}
                                  className="btn btn-xs btn-ghost text-red-500 hover:text-red-300 p-1 rounded">
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
