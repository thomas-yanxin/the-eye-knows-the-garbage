# -*- coding: utf-8 -*-
from urllib.request import urlopen
from urllib.request import Request
from urllib.error import URLError
from urllib.parse import urlencode
from urllib.parse import quote_plus
import json,requests
import os
import random
import sys
import time
import datetime
import cv2
import numpy as np
import paddlex as pdx
import pymysql
from playsound import playsound

from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5.QtWidgets import QApplication, QMainWindow, QMessageBox, QWidget
from PyQt5.QtGui import QIcon

from inference import AnalysisModel
from postprocess import post_det
from preprocess import pre_det, pre_val

import time
import urllib3

urllib3.disable_warnings()
model_det = AnalysisModel('C:\\the_eye_knows_the_trash\\face_recognition\\face_detection\\__model__',
                                  'C:\\the_eye_knows_the_trash\\face_recognition\\face_detection\\__params__',
                                  True,
                                  False)

model_val = AnalysisModel('C:\\the_eye_knows_the_trash\\face_recognition\\face_verification\\__model__',
                        'C:\\the_eye_knows_the_trash\\face_recognition\\face_verification\\__params__',
                                  False,
                                  True)

predictor = pdx.deploy.Predictor('C:\\the_eye_knows_the_trash\\garbage_model')


tmp = None
 
class Ui_MainWindow(QtWidgets.QWidget):

    def __init__(self,parent=None):
        super().__init__(parent) #父类的构造函数

        self.timer_camera = QtCore.QTimer()  # 定时器
        self.cap = cv2.VideoCapture()       #视频流
        self.CAM_NUM = 0                    #为0时表示视频流来自笔记本内置摄像头
        
        self.set_ui()                       #初始化程序界面
        self.slot_init()                    #初始化槽函数
        self.message = " No face_recognition"


    '''程序界面布局'''
    def set_ui(self):
        self.__layout_main = QtWidgets.QHBoxLayout()    #总布局
        self.__layout_fun_button = QtWidgets.QVBoxLayout()    #按键布局
        self.__layout_data_show = QtWidgets.QVBoxLayout()    #数据(视频)显示布局
        self.button_open_camera = QtWidgets.QPushButton('打开摄像头')   #建立用于人脸识别的按键
        self.button_recognition = QtWidgets.QPushButton('人脸识别')   #建立用于垃圾识别的按键
        self.button_close = QtWidgets.QPushButton('退出')   #建立用于退出程序的按键
        self.button_open_camera.setMinimumHeight(50)    #设置按键大小
        self.button_recognition .setMinimumHeight(50)
        self.button_close.setMinimumHeight(50)
        self.setWindowTitle('慧眼识垃圾')
        self.move(200,200)
        self.button_recognition.move(10,50)
        self.button_close.move(10,100)                      #移动按键
        self.setWindowIcon(QIcon('C:\\the_eye_knows_the_trash\\end_side\\garbage_icon.png'))
        '''信息显示'''
        self.label_show_camera = QtWidgets.QLabel()   #定义显示视频的Label
        self.label_show_camera.setFixedSize(641,481)    #给显示视频的Label设置大小为641x481
        '''把按键加入到按键布局中'''
        self.__layout_fun_button.addWidget(self.button_open_camera) #把打开摄像头的按键放到按键布局中
        self.__layout_fun_button.addWidget(self.button_recognition)
        self.__layout_fun_button.addWidget(self.button_close)       #把退出程序的按键放到按键布局中
        '''把某些控件加入到总布局中'''
        self.__layout_main.addLayout(self.__layout_fun_button)      #把按键布局加入到总布局中
        self.__layout_main.addWidget(self.label_show_camera)        #把用于显示视频的Label加入到总布局中
        '''总布局布置好后就可以把总布局作为参数传入下面函数'''
        self.setLayout(self.__layout_main) #到这步才会显示所有控件

    def face(self, name):
        '''播放人脸匹配结果'''

        content = "请确认您的姓名为" + name
        # result  = client.synthesis(content, 'zh', 1, {'vol': 10,})
        wav_path ='C:\\the_eye_knows_the_trash\\voice\\name\\name.wav'          #存储姓名wav的临时地址
        self.voice(content,wav_path)
        # p = playsound()
        # p.play(wav_path)
        # p.close()
        playsound(wav_path)
        os.remove(wav_path)

        '''显示对话框返回值'''
        reply = QMessageBox.information(self, "结果",   "识别成功,匹配到的人是：{}".format(name), QMessageBox.Yes | QMessageBox.No)
        
        if reply == QMessageBox.Yes:
            self.lable_close()
            self.button_open_camera_click()
        else:
            self.lable_close()
            self.button_open_camera.setText('打开摄像头')

    def face_2(self):
        
        content = "识别失败，请重新开始人脸识别"
        # result  = client.synthesis(content, 'zh', 1, {'vol': 10,})

        wav_path ='C:\\the_eye_knows_the_trash\\voice\\name\\name.wav'          #存储人脸wav的临时地址
        self.voice(content,wav_path)
        # p = playsound()
        # p.play(wav_path)
        # p.close()
        playsound(wav_path)
        os.remove(wav_path)

        '''显示对话框返回值'''
        QMessageBox.information(self, "结果",   "识别失败，请重新开始人脸识别", QMessageBox.Yes | QMessageBox.No)         
        self.lable_close()
        self.button_open_camera_click()

    def face_3(self):
        '''显示对话框返回值'''
        QMessageBox.information(self, "error", "未进行人脸识别，请重新开始人脸识别", QMessageBox.Yes | QMessageBox.No)

    def lable_close(self):
        if self.timer_camera.isActive():
            self.timer_camera.stop()
        if self.cap.isOpened():
            self.cap.release()
        self.label_show_camera.clear()


    def key(self):
        #获取token秘钥
        body = {
            "grant_type"    : "client_credentials",
            "client_id"     : "o1GFtAOjYjRXUDW1P8vh8ScB",
            "client_secret" : "RPY6EMH6mT3uw6UrxZ10OTHYBtWHTc3q"
        }
        url  = "https://aip.baidubce.com/oauth/2.0/token?"
        r = requests.post(url,data=body,verify=True,timeout=2)
        respond = json.loads(r.text)
        return  respond["access_token"]
    
    def voice(self,enobj,wav_path):
        try:
            tex = quote_plus(enobj)  # 此处re_text需要两次urlencode          
            params = {'tok': self.key(), 'tex': tex, 'per': 4, 'spd': 5,
                    'pit': 5, 'vol': 5, 'aue': 6, 'cuid': "123456PYTHON",'lan': 'zh', 'ctp': 1}  # lan ctp 固定参数  
            data = urlencode(params)
            req = Request("http://tsn.baidu.com/text2audio", data.encode('utf-8','ignore'))
            try:
                f = urlopen(req,timeout=4)
                result_str = f.read()
                with open(wav_path, 'wb') as of:
                    of.write(result_str)
            except Exception as bug:
                return {'state': False,'data':'','msg':'可能是网络超时。'}
        except:
            return {'state': False,'data':'','msg':'可能是网络超时。'}


    def garbage(self, value, percentage):
        '''显示对话框返回值'''
        QMessageBox.information(self, "结果",   "{},置信度为：{}".format(value, percentage), QMessageBox.Yes | QMessageBox.No)
        self.lable_close()
        self.message = " No face_recognition"
        self.button_open_camera.setText('打开摄像头')


    def pymysql_face(self):
        Connection = pymysql.connect(host='localhost', user='root', passwd='010516', db='trush_bin')
        cursor = Connection.cursor()
        cursor.execute("SELECT * FROM t_user")
        self.result = cursor.fetchall()
        Connection.commit()
        Connection.close()



    def number_count_1(self):
        Connection = pymysql.connect(host='localhost', user='root', passwd='010516', db='trush_bin')
        cursor = Connection.cursor()
        sql=sql_insert="SELECT number FROM t_camera"
        cursor.execute(sql)
        result = cursor.fetchall()
        # print(result)
        if result == ():
            number = 1
        else:
            for row in reversed(result):
                number = row[0] + 1 
                break
        Connection.commit()
        Connection.close()
        return number

    def number_count_2(self):
        Connection = pymysql.connect(host='localhost', user='root', passwd='010516', db='trush_bin')
        cursor = Connection.cursor()
        sql=sql_insert="SELECT number FROM t_analysis"
        cursor.execute(sql)
        result = cursor.fetchall()
        # print(result)
        if result == ():
            number = 1
        else:
            for row in reversed(result):
                number = row[0] + 1
                break
        Connection.commit()
        Connection.close()
        return number


    def sql(self):
        db = pymysql.connect(host="localhost", user="root", passwd="010516", db="trush_bin")
        cur = db.cursor()

        dt = datetime.datetime.now()

        sqlQuery = " INSERT INTO t_camera (openid,name,nickname,face,picture_face,picture_trush,data_time,number) VALUE (%s,%s,%s,%s,%s,%s,%s,%s); "
        value = (self.s_openid, self.s_name, self.s_nickname, self.mysql_face, self.camera_face, self.picture_trash, dt, self.number_1)
        cur.execute(sqlQuery, value)

        db.commit()
        cur.close()
        db.close()


    def sql_2(self, recognition, score):
        db = pymysql.connect(host="localhost", user="root", passwd="010516", db="trush_bin")
        cur = db.cursor()

        dt = datetime.datetime.now()

        sqlQuery = " INSERT INTO t_analysis (openid,nickname,name,machine_answer,precisions,data_time,number,picture_trush) VALUE (%s,%s,%s,%s,%s,%s,%s,%s); "
        value = (self.s_openid, self.s_nickname, self.s_name, recognition, score, dt, self.number_2, self.picture_trash)
        cur.execute(sqlQuery, value)

        n_integral = self.temp_integral+1

        print(n_integral)

        sql = "UPDATE t_user SET integral= %s WHERE openid=%s;"
        values = (n_integral, self.s_openid)
        cur.execute(sql, values)

        db.commit()
        cur.close()
        db.close()


    '''初始化所有槽函数'''
    def slot_init(self):
        self.button_open_camera.clicked.connect(self.button_open_camera_click) #调用face_recognition()
        self.timer_camera.timeout.connect(self.show_camera)
        self.button_recognition.clicked.connect(self.face_recognition)#调用garbage_recognition()
        self.button_close.clicked.connect(self.close)#若该按键被点击，则调用close()，注意这个close是父类QtWidgets.QWidget自带的，会关闭程序

    '''槽函数之一'''

    def button_open_camera_click(self):
        if self.timer_camera.isActive() == False:
            flag = self.cap.open(self.CAM_NUM)
            if flag == False:
                msg = QtWidgets.QMessageBox.warning(
                    self, u"Warning", u"请检测相机与电脑是否连接正确",
                    buttons=QtWidgets.QMessageBox.Ok,
                    defaultButton=QtWidgets.QMessageBox.Ok)
            else:
                self.timer_camera.start(30)
                self.button_open_camera.setText('垃圾识别')
        else:
            self.button_open_camera.setText('打开摄像头')
            self.garbage_recognition()

    def show_camera(self):
        flag, self.image = self.cap.read()
        image = cv2.flip(self.image, 1) # 左右翻转
        show = cv2.cvtColor(self.image, cv2.COLOR_BGR2RGB)
        show = cv2.resize(self.image, (640, 480))     #把读到的帧的大小重新设置为 640x480
        img_det = pre_det(show, 0.3)
        result_det = model_det.predict_det(img_det)
        img, self.crops, bboxes = post_det(show, result_det)   
        img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)   #视频色彩转换回RGB，这样才是现实的颜色    
        img = cv2.flip(img,1)                       #视频镜像翻转
        showImage = QtGui.QImage(img.data, img.shape[1], img.shape[0], QtGui.QImage.Format_RGB888)
        self.label_show_camera.setPixmap(QtGui.QPixmap.fromImage(showImage))
        self.label_show_camera.setScaledContents(True)

    def face_recognition(self):     
        if (len(self.crops) > 0):
            number = self.number_count_1()
            tmp = self.crops[0]
            crop = self.crops[0]  #垃圾桶拍摄的人力照片
            picture_file= 'C:\\the_eye_knows_the_trash\\image\\face_from_end\\image'+str(number)+'.jpg'   #拍摄人脸照片地址
            cv2.imwrite(picture_file, crop)
            self.timer_camera.stop()
            temp = 0 
            self.pymysql_face()
            if not bool(self.result):
                self.face_2()
            else:
                for row in self.result:
                    openid = row[0]
                    name = row[1]  # 数据库内数据
                    nickname = row[2]
                    img = row[3]  # 数据库照片地址
                    integral = row[5]
                    face_path = 'C:\\the_eye_knows_the_trash\\media\\'+str(img)   #数据库人脸照片地址
                    img1 = cv2.imread(face_path)                  
                    img_val = pre_val(img1, crop)
                    result_val = model_val.predict_val(img_val)

                    if np.argmax(result_val[0]) :
                        temp = 0
                        print(temp)
                        self.number_1 = number
                        self.camera_face = 'picture_face/image'+str(number)+'.jpg'  #拍摄照片地址
                        self.s_openid = openid
                        self.mysql_face = img  # 数据库中的人脸
                        self.s_name = name  # 匹配到的姓名
                        self.s_nickname = nickname  # 匹配到的账户
                        self.temp_integral = integral  # 匹配积分
                        self.face(name)
                        self.message = "face_recognition"
                        
                        break
                    else:
                        temp = 1
                    # os.remove(face_path)
                    
                if temp == 1:
                    self.face_2()
                
    def garbage_recognition(self):
        if self.message == "face_recognition":
            number = self.number_count_2() 

            picture_file = 'C:\\the_eye_knows_the_trash\\media\\picture_trush\\trush'+str(number)+'.jpg'   #垃圾照片地址

            cv2.imwrite(picture_file, self.image)
            result = predictor.predict(self.image)

            f_obj = open('C:\\the_eye_knows_the_trash\\garbage_classification.json','r',encoding='UTF-8')       #匹配的json

            content=result[0]['category']

            score=result[0]['score']

            score="%.2f%%"%(score*100)

            recognition=json.load(f_obj)[str(content)]

            txt = "该垃圾为"
            content = txt + str(recognition)
            # result  = client.synthesis(content, 'zh', 1, {'vol': 10,})
            wav_path ='C:\\the_eye_knows_the_trash\\voice\\garbage\\garbage.wav'       #存储垃圾wav的地址
            self.voice(content,wav_path)
            # p = playsound()
            # p.play(wav_path)
            # p.close()
            playsound(wav_path)
            os.remove(wav_path)

            f_obj.close()
            self.number_2 = number
            self.picture_trash = 'C:\\the_eye_knows_the_trash\\media\\picture_trush\\trush'+str(number)+'.jpg'
            self.sql()
            self.sql_2(recognition, score)
            self.garbage(recognition, score)
        else:
            self.face_3()
    

if __name__ =='__main__':
    app = QtWidgets.QApplication(sys.argv)  #固定的，表示程序应用
    ui = Ui_MainWindow()                    #实例化Ui_MainWindow
    ui.show()                               #调用ui的show()以显示。同样show()是源于父类QtWidgets.QWidget的
    # app.exec_()
    sys.exit(app.exec_())

