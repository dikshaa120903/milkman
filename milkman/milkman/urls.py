"""
URL configuration for milkman project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'staff': reverse('staff-list', request=request, format=format),
        'customer': reverse('customer-list', request=request, format=format),
        'category': reverse('category-list', request=request, format=format),
        'product': reverse('product-list', request=request, format=format),
        'subscription': reverse('subscription-list', request=request, format=format),
    })

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('staff/', include('staff.urls')),
    path('customer/', include('customer.urls')),
    path('category/', include('category.urls')),
    path('product/', include('product.urls')),
    path('subscription/', include('subscription.urls')),
    path('', api_root, name='api-root'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
