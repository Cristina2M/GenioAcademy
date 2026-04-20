import buho1 from '../assets/img/stikers/buho1.png';
import buho2 from '../assets/img/stikers/buho2.png';
import buho3 from '../assets/img/stikers/buho3.png';
import buho4 from '../assets/img/stikers/buho4.png';
import buho5 from '../assets/img/stikers/buho5.png';
import buho6 from '../assets/img/stikers/buho6.png';
import buho7 from '../assets/img/stikers/buho7.png';
import buho8 from '../assets/img/stikers/buho8.png';
import buho9 from '../assets/img/stikers/buho9.png';
import buho10 from '../assets/img/stikers/buho10.png';

export const avatarDatabase = [
    { id: 'buho1', src: buho1, requiredLevel: 1, name: 'Recluta Espacial', desc: 'Tu primera skin desbloqueada.' },
    { id: 'buho2', src: buho2, requiredLevel: 2, name: 'Búho Explorador', desc: 'Te atreviste a mirar las estrellas.' },
    { id: 'buho3', src: buho3, requiredLevel: 3, name: 'Matemático Nato', desc: 'Una mente en evolución.' },
    { id: 'buho4', src: buho4, requiredLevel: 4, name: 'Astrobúho', desc: 'Tu nivel de conocimiento avanza rápido.' },
    { id: 'buho5', src: buho5, requiredLevel: 5, name: 'Viajero Intergaláctico', desc: 'La medalla al coraje académico.' },
    { id: 'buho6', src: buho6, requiredLevel: 6, name: 'Aventurero Estelar', desc: 'Has dominado mecánicas complejas.' },
    { id: 'buho7', src: buho7, requiredLevel: 7, name: 'Capitán de la Nave', desc: 'Tienes al resto copiando tus apuntes.' },
    { id: 'buho8', src: buho8, requiredLevel: 8, name: 'Búho Cuántico', desc: 'Tus respuestas son siempre perfectas.' },
    { id: 'buho9', src: buho9, requiredLevel: 9, name: 'Guardián Cósmico', desc: 'Un sabio milenario ha nacido.' },
    { id: 'buho10', src: buho10, requiredLevel: 10, name: 'Genio Universal', desc: 'Has completado la experiencia definitiva.' },
];

export const getAllAvatars = () => avatarDatabase;

// Extrae el JPG/PNG enviándole un ID o un nivel fallback para el Navbar
export const getStudentAvatar = (avatarIdOrLevel) => {
    // Si pasamos un level (ej. Navbar fallback por primera vez)
    if (typeof avatarIdOrLevel === 'number') {
        const found = avatarDatabase.find(a => a.requiredLevel === avatarIdOrLevel);
        return found ? found.src : buho1;
    }
    
    // Si pasamos el string del ID de BD
    const found = avatarDatabase.find(a => a.id === avatarIdOrLevel);
    return found ? found.src : buho1;
}
