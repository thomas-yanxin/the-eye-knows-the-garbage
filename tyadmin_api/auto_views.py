
from rest_framework import viewsets
from tyadmin_api.custom import XadminViewSet
from django.contrib.auth.models import Permission, Group
from django.contrib.contenttypes.models import ContentType
from demo.models import TUser, TAnalysis, TCamera, UserProfile

from tyadmin_api.auto_serializers import PermissionListSerializer, GroupListSerializer, ContentTypeListSerializer, TUserListSerializer, TAnalysisListSerializer, TCameraListSerializer, UserProfileListSerializer
from tyadmin_api.auto_serializers import PermissionCreateUpdateSerializer, GroupCreateUpdateSerializer, ContentTypeCreateUpdateSerializer, TUserCreateUpdateSerializer, TAnalysisCreateUpdateSerializer, TCameraCreateUpdateSerializer, UserProfileCreateUpdateSerializer
from tyadmin_api.auto_filters import PermissionFilter, GroupFilter, ContentTypeFilter, TUserFilter, TAnalysisFilter, TCameraFilter, UserProfileFilter

    
class PermissionViewSet(XadminViewSet):
    serializer_class = PermissionListSerializer
    queryset = Permission.objects.all().order_by('-pk')
    filter_class = PermissionFilter
    search_fields = ["name","codename"]

    def get_serializer_class(self):
        if self.action == "list":
            return PermissionListSerializer
        else:
            return PermissionCreateUpdateSerializer

    
class GroupViewSet(XadminViewSet):
    serializer_class = GroupListSerializer
    queryset = Group.objects.all().order_by('-pk')
    filter_class = GroupFilter
    search_fields = ["name"]

    def get_serializer_class(self):
        if self.action == "list":
            return GroupListSerializer
        else:
            return GroupCreateUpdateSerializer

    
class ContentTypeViewSet(XadminViewSet):
    serializer_class = ContentTypeListSerializer
    queryset = ContentType.objects.all().order_by('-pk')
    filter_class = ContentTypeFilter
    search_fields = ["app_label","model"]

    def get_serializer_class(self):
        if self.action == "list":
            return ContentTypeListSerializer
        else:
            return ContentTypeCreateUpdateSerializer

    
class TUserViewSet(XadminViewSet):
    serializer_class = TUserListSerializer
    queryset = TUser.objects.all().order_by('-pk')
    filter_class = TUserFilter
    search_fields = ["openid","name","nickname","field_token"]

    def get_serializer_class(self):
        if self.action == "list":
            return TUserListSerializer
        else:
            return TUserCreateUpdateSerializer

    
class TAnalysisViewSet(XadminViewSet):
    serializer_class = TAnalysisListSerializer
    queryset = TAnalysis.objects.all().order_by('-pk')
    filter_class = TAnalysisFilter
    search_fields = ["openid","nickname","name","machine_answer","precisions","data_time"]

    def get_serializer_class(self):
        if self.action == "list":
            return TAnalysisListSerializer
        else:
            return TAnalysisCreateUpdateSerializer

    
class TCameraViewSet(XadminViewSet):
    serializer_class = TCameraListSerializer
    queryset = TCamera.objects.all().order_by('-pk')
    filter_class = TCameraFilter
    search_fields = ["openid","name","nickname","data_time"]

    def get_serializer_class(self):
        if self.action == "list":
            return TCameraListSerializer
        else:
            return TCameraCreateUpdateSerializer

    
class UserProfileViewSet(XadminViewSet):
    serializer_class = UserProfileListSerializer
    queryset = UserProfile.objects.all().order_by('-pk')
    filter_class = UserProfileFilter
    search_fields = ["password","username","first_name","last_name","email","gender"]

    def get_serializer_class(self):
        if self.action == "list":
            return UserProfileListSerializer
        else:
            return UserProfileCreateUpdateSerializer
