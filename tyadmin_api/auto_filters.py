from django_filters import rest_framework as filters
from tyadmin_api.custom import DateFromToRangeFilter
from django.contrib.auth.models import Permission, Group
from django.contrib.contenttypes.models import ContentType
from demo.models import TUser, TAnalysis, TCamera, UserProfile

class PermissionFilter(filters.FilterSet):
    content_type_text = filters.CharFilter(field_name="content_type")

    class Meta:
        model = Permission
        exclude = []

class GroupFilter(filters.FilterSet):

    class Meta:
        model = Group
        exclude = []

class ContentTypeFilter(filters.FilterSet):

    class Meta:
        model = ContentType
        exclude = []

class TUserFilter(filters.FilterSet):

    class Meta:
        model = TUser
        exclude = ["face","face"]

class TAnalysisFilter(filters.FilterSet):

    class Meta:
        model = TAnalysis
        exclude = ["picture_trush","picture_trush"]

class TCameraFilter(filters.FilterSet):

    class Meta:
        model = TCamera
        exclude = ["face","face","picture_face","picture_face","picture_trush","picture_trush"]

class UserProfileFilter(filters.FilterSet):
    last_login = DateFromToRangeFilter(field_name="last_login")
    date_joined = DateFromToRangeFilter(field_name="date_joined")

    class Meta:
        model = UserProfile
        exclude = ["image","image"]