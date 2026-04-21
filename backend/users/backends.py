from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

class EmailOrUsernameBackend(ModelBackend):
    """
    Backend de autenticación personalizado que permite a los alumnos
    loguearse usando tanto su nombre de usuario como su correo electrónico.
    Útil para mejorar la experiencia de usuario (UX) en el login.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            # Buscamos al usuario que coincida con el nombre de usuario O con el email
            # iexact asegura que no importe si ponen mayúsculas o minúsculas
            user = UserModel.objects.get(Q(username__iexact=username) | Q(email__iexact=username))
        except UserModel.DoesNotExist:
            # Si no existe, devolvemos None para que Django pruebe con el siguiente backend
            return None
        except UserModel.MultipleObjectsReturned:
            # En el caso improbable de que hubiera duplicados (no debería pasar por las constraints)
            # cogemos el primero que devuelva ordenado por ID
            user = UserModel.objects.filter(Q(username__iexact=username) | Q(email__iexact=username)).order_by('id').first()
        
        # Si lo hemos encontrado, verificamos que la contraseña sea correcta
        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
