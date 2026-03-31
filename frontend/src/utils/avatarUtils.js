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

// ==========================================
// UTILIDAD: AVATARES DE GAMIFICACIÓN
// ==========================================
// Retorna la imagen del Búho correspondiente al Nivel de RPG del alumno.

export const getStudentAvatar = (level) => {
    // Si no tiene nivel por algún fallo, asumimos que es nivel 1
    const safeLevel = level || 1;
    
    const avatarMap = {
        1: buho1, // Recluta
        2: buho2,
        3: buho3,
        4: buho4,
        5: buho5,
        6: buho6,
        7: buho7,
        8: buho8,
        9: buho9,
        10: buho10,
    };
    
    // Calcula cual es el avatar máximo que tenemos guardado
    const maxUnlockedAvatar = Math.max(...Object.keys(avatarMap));
    
    // Si el alumno es nivel 20 pero solo tenemos 10 búhos, le enseñamos el 10º
    if (safeLevel >= maxUnlockedAvatar) {
        return avatarMap[maxUnlockedAvatar];
    }
    
    return avatarMap[safeLevel] || buho1;
}
