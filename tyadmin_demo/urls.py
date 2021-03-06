"""tyadmin_demo URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
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
from demo import views
from django.conf import settings
from django.views.static import serve
from django.urls import path, include, re_path
from tyadmin_api.views import AdminIndexView
urlpatterns = [
        path('login_in/', views.login_in),
        path('intput_identify/', views.identify),
        re_path('media/(?P<path>.*)', serve, {"document_root": settings.MEDIA_ROOT}),
        re_path('^xadmin/.*', AdminIndexView.as_view()),
        path('api/xadmin/v1/', include('tyadmin_api.urls')),
        path('Reference/', views.Reference),
        path('search_user/', views.search_user),
]
