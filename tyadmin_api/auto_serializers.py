from rest_framework import serializers
from django.contrib.auth.models import Permission, Group
from django.contrib.contenttypes.models import ContentType
from demo.models import TUser, TAnalysis, TCamera, UserProfile


class ContentTypeListSerializer(serializers.ModelSerializer):
    

    key = serializers.CharField(source="pk")
    ty_options_display_txt = serializers.SerializerMethodField()

    class Meta:
        model = ContentType
        fields = "__all__"

    @staticmethod
    def get_ty_options_display_txt(obj):
        return str(obj)


class ContentTypeCreateUpdateSerializer(serializers.ModelSerializer):
    
    ty_options_display_txt = serializers.SerializerMethodField()

    class Meta:
        model = ContentType
        fields = "__all__"

    @staticmethod
    def get_ty_options_display_txt(obj):
        return str(obj)


class TUserListSerializer(serializers.ModelSerializer):
    

    key = serializers.CharField(source="pk")
    ty_options_display_txt = serializers.SerializerMethodField()

    class Meta:
        model = TUser
        fields = "__all__"

    @staticmethod
    def get_ty_options_display_txt(obj):
        return str(obj)


class TUserCreateUpdateSerializer(serializers.ModelSerializer):
    
    ty_options_display_txt = serializers.SerializerMethodField()

    class Meta:
        model = TUser
        fields = "__all__"

    @staticmethod
    def get_ty_options_display_txt(obj):
        return str(obj)


class TAnalysisListSerializer(serializers.ModelSerializer):
    

    key = serializers.CharField(source="pk")
    ty_options_display_txt = serializers.SerializerMethodField()

    class Meta:
        model = TAnalysis
        fields = "__all__"

    @staticmethod
    def get_ty_options_display_txt(obj):
        return str(obj)


class TAnalysisCreateUpdateSerializer(serializers.ModelSerializer):
    
    ty_options_display_txt = serializers.SerializerMethodField()

    class Meta:
        model = TAnalysis
        fields = "__all__"

    @staticmethod
    def get_ty_options_display_txt(obj):
        return str(obj)


class TCameraListSerializer(serializers.ModelSerializer):
    

    key = serializers.CharField(source="pk")
    ty_options_display_txt = serializers.SerializerMethodField()

    class Meta:
        model = TCamera
        fields = "__all__"

    @staticmethod
    def get_ty_options_display_txt(obj):
        return str(obj)


class TCameraCreateUpdateSerializer(serializers.ModelSerializer):
    
    ty_options_display_txt = serializers.SerializerMethodField()

    class Meta:
        model = TCamera
        fields = "__all__"

    @staticmethod
    def get_ty_options_display_txt(obj):
        return str(obj)


class PermissionListSerializer(serializers.ModelSerializer):
    

    class ContentTypeSerializer(serializers.ModelSerializer):
        ty_options_display_txt = serializers.SerializerMethodField()
        class Meta:
            model = ContentType
            fields = "__all__"
        @staticmethod
        def get_ty_options_display_txt(obj):
            return str(obj)
    content_type = ContentTypeSerializer()
    key = serializers.CharField(source="pk")
    ty_options_display_txt = serializers.SerializerMethodField()

    class Meta:
        model = Permission
        fields = "__all__"

    @staticmethod
    def get_ty_options_display_txt(obj):
        return str(obj)


class PermissionCreateUpdateSerializer(serializers.ModelSerializer):
    
    ty_options_display_txt = serializers.SerializerMethodField()

    class Meta:
        model = Permission
        fields = "__all__"

    @staticmethod
    def get_ty_options_display_txt(obj):
        return str(obj)


class GroupListSerializer(serializers.ModelSerializer):
    

    class PermissionSerializer(serializers.ModelSerializer):
        ty_options_display_txt = serializers.SerializerMethodField()
        class Meta:
            model = Permission
            fields = "__all__"
        @staticmethod
        def get_ty_options_display_txt(obj):
            return str(obj)
    permissions = PermissionSerializer(many=True)
    key = serializers.CharField(source="pk")
    ty_options_display_txt = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = "__all__"

    @staticmethod
    def get_ty_options_display_txt(obj):
        return str(obj)


class GroupCreateUpdateSerializer(serializers.ModelSerializer):
    
    ty_options_display_txt = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = "__all__"

    @staticmethod
    def get_ty_options_display_txt(obj):
        return str(obj)


class UserProfileListSerializer(serializers.ModelSerializer):
    

    class GroupSerializer(serializers.ModelSerializer):
        ty_options_display_txt = serializers.SerializerMethodField()
        class Meta:
            model = Group
            fields = "__all__"
        @staticmethod
        def get_ty_options_display_txt(obj):
            return str(obj)
    groups = GroupSerializer(many=True)
    class PermissionSerializer(serializers.ModelSerializer):
        ty_options_display_txt = serializers.SerializerMethodField()
        class Meta:
            model = Permission
            fields = "__all__"
        @staticmethod
        def get_ty_options_display_txt(obj):
            return str(obj)
    user_permissions = PermissionSerializer(many=True)
    key = serializers.CharField(source="pk")
    ty_options_display_txt = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = "__all__"

    @staticmethod
    def get_ty_options_display_txt(obj):
        return str(obj)


class UserProfileCreateUpdateSerializer(serializers.ModelSerializer):
    
    ty_options_display_txt = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = "__all__"

    @staticmethod
    def get_ty_options_display_txt(obj):
        return str(obj)
