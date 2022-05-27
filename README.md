本项目相关项目均已上传百度网盘，若下载过程中存在困难，可使用百度网盘进行下载。  

链接：https://pan.baidu.com/s/1KcGOU4DLFQuSb3YZeGktqA  

提取码：reqq

# 慧眼识垃圾（the eye konws the garbage）


### 设计构思与创意

&emsp;&emsp;本作品以微信小程序为“个人”平台，用户可在微信小程序中录入必要的人脸等个人信息，并且能够以微信小程序为窗口查询自己的垃圾分类详情。为保证微信小程序的丰富性和人性化，用户可在小程序中通过拍照、语音、搜索等查询日常生活中常遇的生活垃圾，积累自己垃圾分类知识。在垃圾桶端，系统在用户授权情况下通过拍摄用户人脸信息匹配用户个人数据库，并记录其垃圾分类信息。此外，垃圾桶在本作品中充当“引导者”角色，用以引导用户将垃圾投掷到正确的垃圾桶中。在管理端，相关部门一方面可在此总览某地区总体的垃圾分类情况，另一方面也可以通过查询接口查询到具体的某个人的垃圾分类详情。相关部门基于此能够更加有效地制定出行之有效、因地制宜的垃圾分类政策和相关政策的高效实施。


### 技术运用与特色
&emsp;&emsp;基于上述方案，本作品以国产深度学习开发框架 **PaddlePaddle** 为基础，融合深度学习的图像分类技术、语音技术、搜索技术等等，以方便易用为原则，开发了 “慧眼识垃圾”的微信小程序。该微信小程序实现垃圾拍照分类、语音输入分类等多项功能，便于用户在日常生活中合理、正确、便捷地进行有关垃圾分类的活动。同时，利用人脸识别检测技术，在用户首次登陆微信小程序时录入人脸信息，并基于此连接个人数据库，同个人进行垃圾分类的行为记录相联系。本作品充分考虑用户体验和使用便捷度，垃圾分类模型预测精度达到90%以上，涵盖日常生活中绝大多数的垃圾类别，确保垃圾分类全过程的高效进行以及用户的良好使用体验。人脸识别检测模型达到96.4%以上，对政府进行个人行为管理与监督提供了有力的保障。


### 软件架构

![系统功能架构图](https://images.gitee.com/uploads/images/2021/0412/225615_f17e0b9e_7522525.png "123.png")


### 关键技术
#### 基于[PaddleX](https://github.com/paddlepaddle/PaddleX)的垃圾分类
&emsp;&emsp;Paddle X作为飞桨(PaddlePaddle)全流程开发套件，以低代码形式支持开发者快速实现项目落地。Paddle X集成飞桨智能视觉领域图像分类、目标检测、语义分割、实例分割任务能力，将深度学习开发全流程从数据准备、模型训练与多端部署端到端打通，并提供统一任务API接口，帮助开发者实践落地。  

&emsp;&emsp;为了提高模型的泛化性和鲁棒性，本作品在训练过程中分别加入了 RandomCrop、RandomVerticalFlip、RandomHorizontalFlip 、RandomDistort和Normalize等多种数据增强方式，分别对数据集中的图像进行随机剪裁、以一定的概率对图像进行随机垂直和水平翻转以及以一定的概率对图像进行随机像素内容变换和对图像进行标准化等操作。  

&emsp;&emsp;从模型在验证集中的结果来看，其精度可达94%以上，具有较好的识别能力，故模型具备作品的可行性和有效性。  

##### 基于[PaddleSlim](https://github.com/paddlepaddle/PaddleSlim)敏感度分析的剪枝策略
&emsp;&emsp;PaddleSlim是一个模型压缩工具库，包括模型裁剪、定点量化、只是蒸馏、超参数搜索和模型结构搜索等一系列模型压缩策略。  

&emsp;&emsp;由于本作品训练得到的模型体积较大，预测速度较为缓慢，不足以满足端测、移动端部署场景下的性能需求，故采用 PaddleSlim 的基于敏感度的通道裁剪算法[7]对模型进行裁剪，即通过不同层对剪枝的敏感度来决定裁剪比例，每层敏感度的计算方法是使用不同裁剪比例对该层进行剪枝，评估剪枝后模型在验证集上的精度损失大小，对于剪枝比例越大，但精度损失越小的层，认为其敏感度越低，可以进行较大比例的裁剪。  

&emsp;&emsp;经模型裁剪后，在不影响模型在本作品中的实际预测精度的前提下，模型体积得到有效降低，裁剪约 46.60%，预测速度较之前有显著提升。 
#### 基于[PaddleHub](https://github.com/paddlepaddle/PaddleHub)的人脸识别检测
&emsp;&emsp;PaddleHub[16]能够帮助开发者便捷地获取PaddlePaddle生态下的预训练模型，完成模型的管理和预测。配合使用Fine-tune API，可以基于大规模预训练模型快速完成迁移学习，让预训练模型能更好地服务于用户特定场景的应用。  
##### PyramidBox-Lite
&emsp;&emsp;PyramidBox-Lite基于2018年百度发表于计算机视觉顶级会议ECCV 2018的论文《PyramidBox: A Context-assisted Single Shot Face Detector》而研发的轻量级模型。  

&emsp;&emsp;PyramidBox主要提出了一种基于语境辅助的单次人脸检测新方法——Pyramid Box。基于语境的重要性，文章从以下三个方面改进语境信息的利用。首先，文章作者设计了一种全新的语境anchor，通过半监督的方法来监督高层级语境特征学习，即PyramidAnchors。其次，文章提出了一种低层次级特征金字塔网络，将充分的高层级语境语义特征和低层级面部特征结合在一起，使PyramidBox能够一次性预测所有尺寸的人脸。再次，我们引入了语境敏感结构，扩大预测网络的容量，以提高最终的输出准确率。此外，文章还采用“数据—anchor—采样”的方法来对不同尺寸的训练样本进行扩充，增加了较小人脸训练数据的多样性。PyramidBox充分利用语境的价值，在两个常用人脸检测基准——FDDB和WIDER FACE上表现非凡。   
 
&emsp;&emsp;PyramidBox-Lite在基于主干网络FaceBoxes，对于光照、口罩遮挡、表情变化、尺度变化等常见问题具有很强的鲁棒性，符合垃圾分类存在极大的不确定环境情况下的使用。此外，该模型是针对于移动端优化过的模型，适合部署于移动端或者边缘检测的设备上，对于本系统具有较大的适应性。  

##### 人脸验证
&emsp;&emsp;人脸验证任务，即验证当前图片中的人脸是否为数据库中已存在的某个人的人脸。此任务一般存在两种实现方式：
&emsp;&emsp;1、直接分类，即分辨是准确的哪个人，继而输出标签；  
&emsp;&emsp;2、转换为二分类问题，即分辨两张人脸照片组成的图片对中是否来自同一个人，继而输出置信度。  
&emsp;&emsp;由于第一种方式存在诸多缺点，例如：当模型训练完成后，无法随时加入新的人，较为死板，动态性较差；数据库中需要采集较为宽泛的人脸储备，实现难度大。故本作品采取第二种方式来实现人脸验证。  
&emsp;&emsp;将人脸验证转换为二分类问题，使用孪生网络(Siamese Network)实现。首先，通过同一个CNN网络将人脸图片进行相同的编码，嵌入一个高维的向量空间。然后，使用softmax loss作为损失函数直接对两个样本嵌入向量的拼接做二分类训练，使模型能够直接输出两个相同样本之间的相似度，当相似度达到一定的阈值后即判断是否为同一个人。  


##### 基于[Tyadmin](https://github.com/mtianyan/django-antd-tyadmin)的管理端开发
&emsp;&emsp;Tyadmin是Django基于Models的管理后台前后端生成工具，其主要由Django Restful Framework和Ant Design Pro V4驱动。  

&emsp;&emsp;Tyadmin在Model设计完备的基础上，能够自动生成前后端管理后台，实现页面接口全自动对接，包括登录验证、修改密码、Dashboard数据统计等多项功能。其支持包括账号、邮箱登录的多种登录方式；内嵌自动dashboard，能够自动注册现有的model count数据；实现全自动的列表展示、增删改查、筛选搜索和导出Excel，方便管理端管理和查询相关数据。  

&emsp;&emsp;基于此，本作品使用Tyadmin实现供政府端监管、查询的管理后台，通过连通数据库，将数据库中的数据清晰明了地展现给政府监管部门，方便有关部门统计相关地区的垃圾分类数据、监管某地区的垃圾分类具体情况，继而指定切实合理的垃圾分类政策。

### 安装教程

1. 下载本系统源代码文件夹放置在Windows系统C盘目录下；
2. 安装python依赖库：pip install -r requestment.txt；
3. 将garbage_model.zip解压到代码文件夹；
4. 打开Cmd进入本作品文件夹下.
5. 执行python manage.py makemigrations;
6. 执行python manage.py migrate;
7. 执行python manage.py createsuperuser # 创建一个可以登入后台的用户
8. 执行python manage.py runserver # 默认运行在8000端口
9. 打开开发者工具，导入系统文件夹下wx_mini_app文件夹并运行，即可运行小程序端；
10. 打开浏览器，输入http://127.0.0.1:8000/xadmin/　输入账号、密码，即可进入后台管理端。


### 效果代表图及[B站展示视频](https://www.bilibili.com/video/BV1xV411e7pm/)
![效果图1](https://images.gitee.com/uploads/images/2021/0412/231844_8aaad9d9_7522525.png "1.png")
![效果图2](https://images.gitee.com/uploads/images/2021/0412/231910_e63e557c_7522525.png "2.png")
![效果图3](https://images.gitee.com/uploads/images/2021/0412/231924_c838625f_7522525.png "3.png")
![效果图4](https://images.gitee.com/uploads/images/2021/0412/231936_995141e0_7522525.png "4.png")
![效果图5](https://images.gitee.com/uploads/images/2021/0412/231948_540a070c_7522525.png "5.png")
![效果图6](https://images.gitee.com/uploads/images/2021/0412/232002_630b0b8b_7522525.png "6.png")
![效果图7](https://images.gitee.com/uploads/images/2021/0412/232021_62e90e72_7522525.png "7.png")

### 合作团队

| 姓名| 职责 |
| :----: | :---- |
| [颜鑫](https://githb.com/thomas-yanxin) | PM  、算法  、 web管理端 |
| [沈晨](https://github.com/Scxw010516) | 小程序前端 |
| [杜旭东](https://github.com/DXD-agumo) | 后端 |

### 相关荣誉
1. 2021年上海市机器人及人工智能二等奖；
2. 2022年上海市计算机应用能力设计大赛二等奖；
3. ……




