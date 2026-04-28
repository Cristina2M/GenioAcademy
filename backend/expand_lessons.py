import os
import django
import sys
import re

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from courses.models import Lesson

def expand_lessons():
    lessons = Lesson.objects.all()
    count = 0
    
    for lesson in lessons:
        original_content = lesson.content
        
        # Si la lección ya ha sido expandida con el emoji viejo, lo actualizamos
        if "Desglose Teórico" in original_content:
            if '<span class="text-3xl">🦉</span>' in original_content:
                lesson.content = original_content.replace(
                    '<div class="w-16 h-16 rounded-full bg-slate-900 border-2 border-pink-500/50 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.3)]">\n        <span class="text-3xl">🦉</span>\n    </div>',
                    '<div class="w-16 h-16 rounded-full bg-slate-900 border-2 border-pink-500/50 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.3)] overflow-hidden">\n        <img src="/assets/astro.png" alt="Astro" class="w-full h-full object-cover">\n    </div>'
                )
                lesson.save()
            continue
            
        # Extraer el texto original para reutilizarlo como base
        # El contenido actual suele ser: <h3...>Titulo</h3><p...>Texto</p><div...>Ejemplo</div>
        # Usamos expresiones regulares simples para intentar sacar el texto del párrafo principal
        p_match = re.search(r'<p[^>]*>(.*?)</p>', original_content)
        texto_base = p_match.group(1) if p_match else "Concepto fundamental para el desarrollo de la misión."
        
        # Buscar si había un ejemplo previo en un div
        div_match = re.search(r'<div[^>]*>(.*?)</div>', original_content)
        ejemplo_base = div_match.group(1) if div_match else "Aplica la lógica inversa para despejar la anomalía."
        # Limpiar tags HTML dentro del ejemplo base si los hay
        ejemplo_base = re.sub(r'<[^>]+>', '', ejemplo_base).strip()

        # Generar contenido rico, extenso y visual
        new_content = f"""
<div class="space-y-6">
  <!-- Cabecera de la Lección -->
  <div class="bg-gradient-to-r from-slate-800 to-indigo-900/40 p-6 rounded-2xl border border-indigo-500/30 shadow-lg">
    <h3 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300 mb-3">{lesson.title}</h3>
    <p class="text-slate-300 text-lg leading-relaxed">
        {texto_base} Esta es la base teórica sobre la que se construye nuestro conocimiento. 
        En la Academia Genio, no nos conformamos con saber el "qué", necesitamos comprender profundamente el "por qué". 
        Prepárate para expandir tu mente y aplicar esta teoría en entornos reales de exploración.
    </p>
  </div>

  <!-- Columnas de Teoría y Práctica -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Concepto Clave -->
    <div class="bg-slate-900/60 p-6 rounded-2xl border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
      <h4 class="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
        Desglose Teórico
      </h4>
      <div class="space-y-3 text-slate-300 text-sm leading-relaxed">
        <p>Para dominar este campo de conocimiento, imagina que estás calibrando los sensores principales de tu nave.</p>
        <ul class="list-disc list-inside space-y-2 ml-1 text-slate-400">
            <li><strong>Identificación:</strong> Reconoce el patrón base del problema antes de actuar.</li>
            <li><strong>Desarrollo:</strong> Aplica las fórmulas o reglas estructurales paso a paso sin saltarte ningún protocolo de seguridad.</li>
            <li><strong>Resolución:</strong> Comprueba el resultado final siempre que sea posible. Un comandante experto siempre verifica sus cálculos.</li>
        </ul>
      </div>
    </div>
    
    <!-- Ejemplo en Terminal -->
    <div class="bg-slate-900/80 p-6 rounded-2xl border border-cyan-500/20 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)] flex flex-col">
      <h4 class="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-terminal"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
        Simulador de Ejemplo
      </h4>
      <div class="flex-1 bg-black/60 p-4 rounded-xl border border-white/5 font-mono text-sm text-slate-300 relative overflow-hidden group">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <p class="text-cyan-500 mb-2">GenioOS v2.4.1 -- Protocolo Activado</p>
        <p class="mb-4">> Analizando datos de entrada...</p>
        
        <div class="bg-white/5 p-3 rounded border-l-2 border-cyan-400 mb-4">
            <span class="text-white font-bold">CASO PRÁCTICO:</span><br/>
            <span class="text-amber-300">{ejemplo_base}</span>
        </div>
        
        <p class="text-slate-500 italic">// Resultado procesado con éxito.</p>
        <p class="text-slate-500 italic">// Listo para evaluación del cadete.</p>
      </div>
    </div>
  </div>

  <!-- Consejo del Búho -->
  <div class="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-6 rounded-2xl border border-pink-500/20 flex gap-5 items-center">
    <div class="w-16 h-16 rounded-full bg-slate-900 border-2 border-pink-500/50 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.3)] overflow-hidden">
        <img src="/assets/astro.png" alt="Astro" class="w-full h-full object-cover">
    </div>
    <div>
      <h4 class="text-lg font-bold text-pink-300 mb-1">El Consejo de Astro</h4>
      <p class="text-slate-300 text-sm leading-relaxed">
        Nunca intentes memorizar la teoría en crudo. La memoria se evapora en el vacío del espacio, pero la <strong>lógica y la comprensión</strong> perduran para siempre. Si fallas en el ejercicio de abajo, analiza el porqué, ajusta tus coordenadas y vuelve a intentarlo.
      </p>
    </div>
  </div>
</div>
        """
        
        lesson.content = new_content
        lesson.save()
        count += 1

    print(f"✅ ¡Éxito! Se ha expandido y embellecido el contenido teórico de {count} lecciones.")

if __name__ == '__main__':
    expand_lessons()
