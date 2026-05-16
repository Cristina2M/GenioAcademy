import re

DOC_PATH = r"c:\Users\crist\OneDrive\Escritorio\PROYECTO-DESARROLLO-WEB\PROYECTO\GenioAcademy\documentacion.md"

with open(DOC_PATH, "r", encoding="utf-8") as f:
    content = f.read()

cambios_text = """### Cambios y Justificación respecto al Anteproyecto Inicial

A lo largo del desarrollo del proyecto, la realidad técnica me obligó a tomar decisiones y pivotar respecto a la idea original del anteproyecto. Estos cambios no son errores de planificación, sino decisiones de arquitectura justificadas:

1. **De Kubernetes/Docker Swarm a PaaS (Vercel y Render):** En el anteproyecto contemplé usar Kubernetes para orquestar contenedores en la nube. Sin embargo, al llegar a la fase de despliegue, evalué los costes (mantener un clúster de K8s 24/7 es muy caro para un proyecto de estudiante) y la complejidad innecesaria para el tráfico esperado inicial. Decidí pivotar hacia un despliegue **PaaS (Platform as a Service)** utilizando Vercel para el Frontend y Render para el Backend. Sigo usando Docker en local para garantizar la portabilidad, pero el despliegue es mucho más ágil y gratuito.
2. **De Ollama Local a Groq Cloud (Tutor IA):** Inicialmente iba a usar la API de Ollama para correr el modelo localmente. En la práctica, el hardware necesario para correr un modelo en local (incluso uno pequeño) provocaba latencias inaceptables en las respuestas del tutor Astro. Para solucionarlo, migré la integración hacia **Groq**, un proveedor en la nube que ofrece inferencia ultrarrápida (LPU).
3. **Descarte de LDAP y S3 Buckets:** Se valoró LDAP para la gestión de usuarios, pero para el alcance de Genio Academy (enfocado a usuarios finales y no a redes corporativas internas), el sistema de JWT enriquecido resultó mucho más seguro, rápido y estándar. Respecto a S3 para multimedia, actualmente los recursos (como los avatares) se cargan desde el propio bundle de React o bases de datos ligeras para mantener los costes a cero, aunque la base de código está preparada para integrarlo si el proyecto escala.
4. **Sistema de Vidas y RPG más profundo:** En el diseño inicial solo se mencionaba una "API externa de avatares". Decidí ir un paso más allá en la gamificación y desarrollé todo un motor propio de subida de experiencia, niveles (Bloqueos 403 reales en servidor) y el sistema *Roguelike* de regeneración de vidas por tiempo, lo que aporta muchísimo más valor diferencial que solo usar avatares de DiceBear.

---

"""

# Insert right after the hitos table
insert_target = "| **+** | **Despliegue en producción y estabilización final** | ✅ Completado |"
target_idx = content.find(insert_target)

if target_idx != -1:
    end_of_table = target_idx + len(insert_target) + 1
    content = content[:end_of_table] + "\n\n" + cambios_text + content[end_of_table:]
    
    with open(DOC_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    print("Justificación de cambios insertada con éxito.")
else:
    print("No se encontró la tabla de hitos.")
