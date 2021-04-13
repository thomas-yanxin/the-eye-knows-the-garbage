import datetime

from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
from tyadmin_api_cli.fields import richTextField



class TUser(models.Model):
    openid = models.CharField(primary_key=True, max_length=255,verbose_name="openid")
    name = models.CharField(max_length=255, blank=True, null=True,verbose_name="姓名")
    nickname = models.CharField(max_length=255, blank=True, null=True,verbose_name="昵称")
    face = models.ImageField(blank=True, null=True,verbose_name="人脸",upload_to='face')
    field_token = models.CharField(db_column='token', max_length=255, blank=True, null=True, verbose_name="field_token") 
    integral = models.IntegerField(blank=True, null=True, verbose_name="积分")
    
    class Meta:
        verbose_name = "个人信息"
        verbose_name_plural = verbose_name
        db_table = 't_user'

    def __str__(self):
        return self.openid


class TAnalysis(models.Model):
    number = models.IntegerField(primary_key=True, blank=True,verbose_name="序号")
    openid = models.CharField(max_length=255,blank=True,null=True,verbose_name="openid")
    nickname = models.CharField(max_length=255, blank=True, null=True,verbose_name="昵称")
    name = models.CharField(max_length=255, blank=True, null=True,verbose_name="姓名")
    picture_trush = models.ImageField(blank=True, null=True,verbose_name="垃圾照片",upload_to='picture_trush')
    machine_answer = models.CharField(max_length=255, blank=True, null=True,verbose_name="识别结果")
    precisions = models.CharField(max_length=255, blank=True, null=True,verbose_name="识别精度")
    data_time = models.CharField(max_length=255, blank=True, null=True,verbose_name="时间")
    
    class Meta:
        verbose_name = "判断"
        verbose_name_plural = verbose_name
        db_table = 't_analysis'

    def __str__(self):
        return self.openid


class TCamera(models.Model):  
    number = models.IntegerField(primary_key=True, blank=True, verbose_name="序号")
    openid = models.CharField(max_length=255,blank=True,null=True,verbose_name="openid")
    name = models.CharField(max_length=255, blank=True, null=True,verbose_name="姓名")
    nickname = models.CharField(max_length=255, blank=True, null=True,verbose_name="昵称")
    face = models.ImageField(blank=True, null=True,verbose_name="人脸",upload_to='face')
    picture_face = models.ImageField(blank=True, null=True,verbose_name="人脸照片",upload_to='picture_face')
    picture_trush = models.ImageField(blank=True, null=True,verbose_name="垃圾照片",upload_to='picture_trush')
    data_time = models.CharField(max_length=255, blank=True, null=True,verbose_name="时间")
    
    class Meta:
        verbose_name = "摄像"
        verbose_name_plural = verbose_name
        db_table = 't_camera'

    def __str__(self):
        return self.openid


class UserProfile(AbstractUser):
    GENDER_CHOICES = (
        ("male", "男"),
        ("female", "女")
    )
    gender = models.CharField(max_length=6, verbose_name="性别", choices=GENDER_CHOICES, default="female")
    image = models.ImageField(max_length=100, verbose_name="头像",upload_to='head_portrait')

    class Meta:
        verbose_name = "管理"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.username
