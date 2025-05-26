# Concrete-Crack-Detection-Segmentation

This repository contains the code for crack detection on concrete surfaces. It is a PyTorch implementation of Deep Learning-Based Crack Damage Detection Using Convolutional Neural Networks with DeepCrack

DeepCrack: A Deep Hierarchical Feature Learning Architecture for Crack Segmentation


Resources: [(Paper: https://github.com/yhlleo/DeepCrack/blob/master/paper/DeepCrack-Neurocomputing-2019.pdf)]
Architecture: based on Holistically-Nested Edge Detection, ICCV 2015.


Dependencies required:

PyTorch,
OpenCV,
Dataset -The data set can be downloaded from this link: https://data.mendeley.com/datasets/5y9wdsg2zt/2

Dataset:
The dataset contains concrete images having cracks. The data is collected from various METU Campus Buildings.
The dataset is divided into two as negative and positive crack images for image classification. 
Each class has 20000 images with a total of 40000 images with 227 x 227 pixels with RGB channels. 
The dataset is generated from 458 high-resolution images (4032x3024 pixel) with the method proposed by Zhang et al (2016). 
High-resolution images have variance in terms of surface finish and illumination conditions. 
No data augmentation in terms of random rotation or flipping is applied. 

The dataset file creates the training dataset class to be fed into the Convolutional Neural Network. This class automatically determines the number of classes by the number of folders in 'in_dir' (number of folders=number of classes)

![Capture](https://github.com/yhlleo/DeepCrack/blob/master/figures/architecture.jpg?raw=true)

The first type of result is created using the file: Crack recognition.ipynb and the predictions can be seen here:

![Capture](https://user-images.githubusercontent.com/46296774/103016160-edd0b180-4541-11eb-8cfe-3c7680569eb9.PNG)
![Capture2](https://user-images.githubusercontent.com/46296774/103016173-f4f7bf80-4541-11eb-9bb5-933dcd725d9b.PNG)

The second type of prediction is created using the files: cv2_utils.py and inference_utils.py
inference_utils.py is using the Deepcrack model to predict the mask and afterwards the file cv2_utils.py is using OpenCV to create the parameters.
Subsequently a web app is created with the option to input a number of images with cracks and outputs the length, width, category of the cracks along with a mask for the crack area

![image](https://user-images.githubusercontent.com/46296774/177764562-f7ed470d-22b9-4e13-b5a0-74254b54b841.png)
