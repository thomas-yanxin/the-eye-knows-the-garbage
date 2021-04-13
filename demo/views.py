from django.shortcuts import render
from django.conf import settings

# Create your views here.
import base64
import hashlib
import http.client
import json
import os
import threading
import time
import cv2
import memcache
import numpy as np
import paddlex as pdx
import pymysql
import requests
from django.http import JsonResponse
from django.shortcuts import HttpResponse, render
from matplotlib import pyplot as plt
from PIL import Image
from face_recognition import inference
from demo import models

# Create your views here.

#垃圾识别

def Reference(request):
    if request.method == "POST":
        value = request.POST.get('image')

        image_name = base64.b64decode(value)
        image_file = 'C:\\the_eye_knows_the_trash\\image\\garbage_from_wx\\garbage.jpg'         #微信小程序端拍摄的垃圾照片存储地址
        fh = open(image_file, "wb")
        fh.write(image_name)
        fh.close()
        ##      垃圾识别
        predictor = pdx.deploy.Predictor('C:\\the_eye_knows_the_trash\\garbage_model')  # 你自己的模型地址
        result = predictor.predict(image_file)
        f_obj = open('C:\\the_eye_knows_the_trash\\garbage_classification.json', "rb+")

        # number = result[0]['category_id']

        # score = result[0]["score"]

        # score = "%.2f%%" % (score * 100)

        # content = json.load(f_obj)['class_detail']
        
        # for i in content:
        #     if number==i["class_label"]:
        #         recognition = i["class_name"]
        #         recognition = recognition.split("_",1)[1]
        number=result[0]['category']

        score=result[0]['score']

        score="%.2f%%"%(score*100)

        recognition=json.load(f_obj)[str(number)]
        
        recognition = recognition.split('/')

        garbage_classification = recognition[0] #可回收物

        garbage_name = recognition[1]       #易拉罐

        if garbage_classification == "其他垃圾":
            order = 1
        elif garbage_classification == "厨余垃圾":
            order = 2
        elif garbage_classification == "可回收物":
            order = 3
        else :
            order = 4
        

        f_obj.close()
        data = {
            "results":[
                {"garbage_classification":garbage_classification,"garbage_name":garbage_name,"garbage_rate":score,"order":order}
            ]
        }
        json_data = json.dumps(data)
        return HttpResponse(json_data)
    else:
        return HttpResponse("识别失败")


#登录

cache = memcache.Client(["127.0.0.1:11211"], debug=0)
def login_in(request):
    if request.method == "POST":
        code = request.POST.get('code')
        userinfo = request.POST.get('userinfo')

    userinfo = json.loads(userinfo)
    nickname = userinfo['nickName']

    # db = pymysql.connect(host="localhost", user="root", passwd="010516", db="trush_bin")
    # print('数据库连接成功！')
    # cur = db.cursor()
    # sql = "INSERT INTO t_user (account_number,code) VALUES  (%s,%s);"
    # args = (account_number, code)
    # cur.execute(sql, args)
    # db.commit()
    # db.close()

    appid = "wx433732b2940b7d4c"
    secret = "b4e95c5b998cd13ba9d09e077343f2e7"

    code2SessionUrl = "https://api.weixin.qq.com/sns/jscode2session?appid={appid}&secret={secret}&js_code={code}&grant_type=authorization_code".format(
        appid=appid, secret=secret, code=code)
    resp = requests.get(code2SessionUrl)
    respDict = resp.json()

    openid = respDict.get("openid")    #存入
    session_key = respDict.get("session_key")

    token = hashlib.md5(("openid" + "session_key").encode("utf-8")).hexdigest()     #临时数据
    cache.set(token,openid,7*24*60*60)

    old_openid = models.TUser.objects.filter(openid=openid)
    old_openid = old_openid.values()
    if not bool(old_openid):
        user =  models.TUser()
        user.openid = openid
        user.nickname = nickname
        user.field_token = token
        user.integral = 0
        user.save()

        return JsonResponse({"token": token, "openid": openid, "status": "new", "point": "0"})
    else:
        models.TUser.objects.filter(openid=openid).update(field_token=token)  #替换token

        user_infor = models.TUser.objects.values().filter(openid=openid)    #积分查询
        point = user_infor[0]['integral']
        return JsonResponse({"token": token, "openid": openid, "point": point, "status": "old"})


#个人信息录入

def identify(request):
    if request.method == "POST":
        token_get = request.POST.get('token')
        openid = request.POST.get('openid')
        name = request.POST.get('name')
        face_base64 = request.POST.get('img')   
        img_face = base64.b64decode(face_base64)
        
    old_token= models.TUser.objects.filter(field_token=token_get)
    old_token = old_token.values()
    # 判断字典为空
    if not bool(old_token):
        return JsonResponse({"return": "操作失败"})
    #判断字典不为空
    else:
        pic_name = openid + ".jpg"
        img_path = '%s/face/%s'%(settings.MEDIA_ROOT, pic_name)
        
        f = open(img_path, 'wb')
        f.write(img_face)
        f.close()

        model_det = inference.AnalysisModel('C:\\the_eye_knows_the_trash\\face_recognition\\face_detection\\__model__',
                                  'C:\\the_eye_knows_the_trash\\face_recognition\\face_detection\\__params__',
                                  True,
                                  False)

        model_val = inference.AnalysisModel('C:\\the_eye_knows_the_trash\\face_recognition\\face_verification\\__model__',
                                  'C:\\the_eye_knows_the_trash\\face_recognition\\face_verification\\__params__',
                                  False,
                                  True)

        tmp = None
        font = cv2.FONT_HERSHEY_SIMPLEX
        while True:
            img = cv2.imread(img_path)
            img_det = pre_det(img, 0.3)
            result_det = model_det.predict_det(img_det)
            img, crops, bboxes = post_det(img, result_det)
            if type(tmp) is np.ndarray:
                for crop, bbox in zip(crops, bboxes):
                    img_val = pre_val(tmp, crop)
                    x1, y1 = bbox[:2]
                    result_val = model_val.predict_val(img_val)
                    if np.argmax(result_val[0]):
                        img = cv2.putText(img, 'Success', (x1, y1 - 4), font, 0.6, (0, 255, 0), 2)
                    else:
                        img = cv2.putText(img, 'Faild', (x1, y1 - 4), font, 0.6, (0, 0, 255), 2)
            if (len(crops) > 0):
                tmp = crops[0]
                crop = crops[0]
                crop = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
                cv2.imwrite(img_path, crop)
                break

        
        models.TUser.objects.filter(openid=openid).update(name=name)
        models.TUser.objects.filter(openid=openid).update(face='face/%s'%pic_name)
        return JsonResponse({"return": "get daze！！"})


#用户信息查询

def search_user(request):
    if request.method == "POST":
        token_get = request.POST.get('token')
        openid_get = request.POST.get('openid')

    old_token = models.TUser.objects.filter(field_token=token_get)
    old_token = old_token.values()
    # 判断字典为空
    if not bool(old_token):
        return JsonResponse({"return": "操作失败"})
    #判断字典不为空
    else:
        person = models.TAnalysis.objects.values().filter(openid=openid_get)
        person = list(person)
        return JsonResponse(person, safe=False)




#--------------裁剪函数--------------------#

def concatenate(true_img, crop):
    # my = cv2.imread('my.jpg')
    # resize

    new = np.concatenate([true_img, crop], 1)
    # cv2.imwrite('test.jpg', new)
    # cv2.imwrite('crop.jpg', crop)
    new = cv2.cvtColor(new, cv2.COLOR_BGR2RGB)
    return new


def pre_val(true_img, crop):
    img = concatenate(true_img, crop)
    img = Image.fromarray(img)
    image = img.resize((224, 224), Image.LANCZOS)

    # HWC to CHW
    mean = np.array([0.485, 0.456, 0.406]).reshape(3, 1, 1)
    std = np.array([0.229, 0.224, 0.225]).reshape(3, 1, 1)
    image = np.array(image).astype('float32')
    if len(image.shape) == 3:
        image = np.swapaxes(image, 1, 2)
        image = np.swapaxes(image, 1, 0)

    # standardization
    image /= 255
    image -= mean
    image /= std
    image = image[[0, 1, 2], :, :]
    image = np.expand_dims(image, axis=0).astype('float32')
    return image


def pre_det(org_im, shrink):
    image = org_im.copy()
    image_height, image_width, image_channel = image.shape
    if shrink != 1:
        image_height, image_width = int(image_height * shrink), int(
            image_width * shrink)
        image = cv2.resize(image, (image_width, image_height),
                           cv2.INTER_NEAREST)
    # HWC to CHW
    if len(image.shape) == 3:
        image = np.swapaxes(image, 1, 2)
        image = np.swapaxes(image, 1, 0)
    # 归一化
    # mean, std
    mean = [104., 117., 123.]
    scale = 0.007843
    image = image.astype('float32')
    image -= np.array(mean)[:, np.newaxis, np.newaxis].astype('float32')
    image = image * scale
    image = np.expand_dims(image, axis=0).astype('float32')
    return image


def post_det(img, output_datas):
    img_h, img_w = img.shape[:2]
    new_img = img.copy()
    crops = []
    bboxes = []
    for data in output_datas:
        label, score, x1, y1, x2, y2 = data
        if score > 0.9:
            x1, y1, x2, y2 = [int(_) for _ in [x1 * img_w, y1 * img_h, x2 * img_w, y2 * img_h]]
            crop = img[max(0, y1 - 50):min(y2 + 50, img_h), max(0, x1 - 50):min(x2 + 50, img_w), :]
            h, w = crop.shape[:2]
            crop = cv2.resize(crop, (200, int(h / w * 200))) if w > h else cv2.resize(crop, (int(w / h * 200), 200))
            row_nums = 200 - crop.shape[0]
            line_nums = 200 - crop.shape[1]
            if row_nums % 2 == 0:
                crop = np.pad(crop, ((row_nums // 2, row_nums // 2), (0, 0), (0, 0)), 'constant')
            else:
                crop = np.pad(crop, ((row_nums // 2, row_nums // 2 + 1), (0, 0), (0, 0)), 'constant')
            if line_nums % 2 == 0:
                crop = np.pad(crop, ((0, 0), (line_nums // 2, line_nums // 2), (0, 0)), 'constant')
            else:
                crop = np.pad(crop, ((0, 0), (line_nums // 2, line_nums // 2 + 1), (0, 0)), 'constant')
            crops.append(crop)
            bboxes.append([x1, y1, x2, y2])
            cv2.rectangle(new_img, (x1, y1), (x2, y2), (255, 0, 0), 2)
    return new_img, crops, bboxes
