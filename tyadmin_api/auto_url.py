from tyadmin_api import auto_views
from django.urls import re_path, include, path
from rest_framework.routers import DefaultRouter
    
router = DefaultRouter(trailing_slash=False)
    
router.register('permission', auto_views.PermissionViewSet)
    
router.register('group', auto_views.GroupViewSet)
    
router.register('content_type', auto_views.ContentTypeViewSet)
    
router.register('t_user', auto_views.TUserViewSet)
    
router.register('t_analysis', auto_views.TAnalysisViewSet)
    
router.register('t_camera', auto_views.TCameraViewSet)
    
router.register('user_profile', auto_views.UserProfileViewSet)
    
urlpatterns = [
        re_path('^', include(router.urls)),
    ]
    