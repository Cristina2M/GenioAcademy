import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.test import RequestFactory
from courses.views import CategoryViewSet
from rest_framework.request import Request
from users.models import CustomUser

factory = RequestFactory()
request = factory.get('/api/courses/categories/')
# Mock the DRF request
drf_request = Request(request)
user = CustomUser.objects.first()
drf_request.user = user

view = CategoryViewSet()
view.request = drf_request
view.format_kwarg = None
queryset = view.get_queryset()
serializer = view.get_serializer(queryset, many=True)
try:
    data = serializer.data
    print("Success, first item:", data[0]['name'] if data else "Empty")
except Exception as e:
    import traceback
    traceback.print_exc()
