import { useState, useRef, useEffect, useContext } from 'react';
import { Send, Loader2 } from 'lucide-react';
import axiosInstance from '../api/axios';
import AuthContext from '../context/AuthContext';
import { getStudentAvatar } from '../utils/avatarUtils';

// ============================================================
// ARCHIVO: AIChatPanel.jsx
// FUNCIÓN: Es el componente de interfaz gráfica del chat de IA (Astro).
// Se encarga de mostrar la burbuja de mensajes, conectarse al backend 
// para enviar y recibir datos, y manejar el estado (escribiendo, etc.)
// ============================================================
export default function AIChatPanel({ courseTitle, lessonTitle }) {
  const [messages, setMessages] = useState([]); // Guarda el historial de mensajes
  const [input, setInput] = useState(''); // El texto que el alumno está escribiendo
  const [isLoading, setIsLoading] = useState(false); // Sirve para mostrar la animación de "Pensando..."
  const messagesEndRef = useRef(null);

  // Cargamos los datos del usuario conectado para usar su avatar elegido
  const { user } = useContext(AuthContext);
  const userAvatarImage = getStudentAvatar(user?.selected_avatar || 'buho1');
  const aiAvatarImage = getStudentAvatar('buho10'); // Astro usa el avatar del Genio Universal

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Añadimos lo que escribió el alumno a la pantalla inmediatamente 
    const newMessages = [...messages, { role: 'user', content: input.trim() }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Nos comunicamos por detrás con el backend pasándole el historial de la conversación
      // Además le enviamos en qué curso y lección está el alumno para que funcione el contexto socrático.
      const response = await axiosInstance.post('ai/chat/', {
        messages: newMessages,
        courseTitle: courseTitle,
        lessonTitle: lessonTitle
      });

      if (response.data && response.data.content) {
        setMessages([...newMessages, { role: 'assistant', content: response.data.content }]);
      }
    } catch (error) {
      console.error("Error comunicándose con Astro:", error);
      // Mensaje de error amigable en el chat
      setMessages([
        ...newMessages, 
        { role: 'assistant', content: 'Hmm... parece que hay interferencias en mi antena. ¿Puedes intentar preguntarlo de nuevo?' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-slate-900 border border-pink-500/30 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(236,72,153,0.15)] relative">
      {/* Cabecera del Búho IA */}
      <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-3 border-b border-pink-500/30 flex items-center gap-2">
        <img src={aiAvatarImage} alt="Astro" className="w-6 h-6 object-cover rounded-full" />
        <h4 className="font-bold text-white text-sm">Astro</h4>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2 opacity-60">
            <img src={aiAvatarImage} alt="Búho" className="w-10 h-10 object-cover rounded-full drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
            <p className="text-xs">Soy Astro, tu tutor.<br/>¿En qué te puedo ayudar?</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 border border-pink-500/50 overflow-hidden">
                  <img src={aiAvatarImage} alt="IA" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div 
                className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-cyan-500/20 text-cyan-50 rounded-tr-none border border-cyan-500/30' 
                    : 'bg-slate-800 text-slate-300 rounded-tl-none border border-slate-700'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-500/50 overflow-hidden">
                  <img src={userAvatarImage} alt="Tú" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ))
        )}
        
        {/* Indicador de "Escribiendo..." */}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 border border-pink-500/50 overflow-hidden">
              <img src={aiAvatarImage} alt="IA" className="w-full h-full object-cover" />
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-tl-none p-3 bg-slate-800 border border-slate-700 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-pink-400 animate-spin" />
              <span className="text-xs text-slate-400">Pensando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Chat */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe tu duda..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="btn btn-sm btn-square bg-pink-500 hover:bg-pink-400 text-white border-none rounded-xl disabled:bg-slate-700 disabled:text-slate-500"
          disabled={isLoading || !input.trim()}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
