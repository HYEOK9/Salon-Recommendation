import cv2
import numpy as np
import torch
import os
import sys
import argparse
import requests
from io import BytesIO
import json
from PIL import Image
import heapq

sys.path.append("../img2vec/img2vec_pytorch")
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from networks import get_network
import torchvision.transforms as std_trnsf

# img2Vec
from img2vec_pytorch import Img2Vec
from sklearn.metrics.pairwise import cosine_similarity


img2VecModel = "efficientnet_b4"

test_image_transforms = std_trnsf.Compose(
    [
        std_trnsf.ToTensor(),
        std_trnsf.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ]
)


def str2bool(s):
    return s.lower() in ("t", "true", 1)


def src_to_file(srcUrl: str):
    response = requests.get(srcUrl)

    if response.status_code == 200:
        img_data = BytesIO(response.content)
        img = Image.open(img_data).convert("RGB")
        return img
    else:
        print("이미지를 다운로드하는 데 문제가 있습니다.")


def crop_hair_from_image(image):
    data = test_image_transforms(image)
    data = torch.unsqueeze(data, dim=0)
    net.eval()
    data = data.to(device)

    logit = net(data)

    # prepare mask
    pred = torch.sigmoid(logit.cpu())[0][0].data.numpy()
    mh, mw = data.size(2), data.size(3)
    mask = pred >= 0.6

    mask_n = np.zeros((mh, mw, 3))
    mask_n[:, :, 0] = 255
    mask_n[:, :, 0] *= mask

    image_n = np.array(image)
    image_n = cv2.cvtColor(image_n, cv2.COLOR_RGB2BGR)
    # discard padded area
    ih, iw, _ = image_n.shape

    delta_h = mh - ih
    delta_w = mw - iw

    top = delta_h // 2
    bottom = mh - (delta_h - top)
    left = delta_w // 2
    right = mw - (delta_w - left)

    mask_n = mask_n[top:bottom, left:right, :]

    # origin code
    # image_n = image_n * 0.5 + mask_n * 0.5

    overlap_mask = mask_n[:, :, 0] == 255

    image_n_cropped = image_n.copy()
    image_n_cropped[~overlap_mask] = 255

    return Image.fromarray(image_n_cropped)


def getCosSim(src_img_vec, key_img_vec):
    similarity = cosine_similarity(
        key_img_vec.reshape((1, -1)), src_img_vec.reshape((1, -1))
    )[0][0]

    return similarity


if __name__ == "__main__":
    try:
        parser = argparse.ArgumentParser()
        parser.add_argument(
            "--ckpt_dir",
            help="path to ckpt file",
            type=str,
            default="./models/pspnet_resnet101_sgd_lr_0.002_epoch_100_test_iou_0.918.pth",
        )
        parser.add_argument(
            "--key_img_dir",
            help="path to key image",
            type=str,
            default="./data/0.jpeg",
        )
        parser.add_argument(
            "--img_src_array", help="array with image url", type=str, default="[]"
        )
        parser.add_argument(
            "--networks",
            help="name of neural network",
            type=str,
            default="pspnet_resnet101",
        )
        parser.add_argument(
            "--save_dir", default="./result", help="path to save overlay images"
        )
        parser.add_argument(
            "--use_gpu",
            type=str2bool,
            default=True,
            help="True if using gpu during inference",
        )

        args = parser.parse_args()

        ckpt_dir = args.ckpt_dir
        key_img_dir = args.key_img_dir
        img_src_array = json.loads(args.img_src_array)
        network = args.networks.lower()
        save_dir = args.save_dir
        device = "cuda" if args.use_gpu else "cpu"
        img2vec = Img2Vec(cuda=True if args.use_gpu else False, model=img2VecModel)

        assert os.path.exists(ckpt_dir)
        assert os.path.exists(os.path.split(save_dir)[0])

        os.makedirs(save_dir, exist_ok=True)

        # prepare network with trained parameters
        net = get_network(network).to(device)
        state = torch.load(ckpt_dir, map_location=device)
        net.load_state_dict(state["weight"])

        with torch.no_grad():
            length = len(img_src_array)
            place_name = img_src_array[0]["fileName"].split("-")[0]

            max_heap = []
            key_img = Image.open(key_img_dir).convert("RGB")
            cropped_key_img = crop_hair_from_image(key_img)
            cropped_key_img_vec = img2vec.get_vec(cropped_key_img)

            for i, img_obj in enumerate(img_src_array):
                file_name, img_src = img_obj["fileName"], img_obj["src"]
                print(
                    "[{:3d}/{:3d}] processing image from {}... ".format(
                        i + 1, length, place_name
                    )
                )
                img = src_to_file(img_src)
                image_n_cropped = crop_hair_from_image(img)
                vec = img2vec.get_vec(image_n_cropped)

                obj = {
                    "fileName": file_name,
                    "similarity": getCosSim(vec, cropped_key_img_vec),
                    "src": img_src,
                }

                heapq.heappush(max_heap, (obj["similarity"], obj["fileName"], obj))

                if len(max_heap) > 3:
                    heapq.heappop(max_heap)

            result = sorted(
                [obj for (_, _, obj) in max_heap],
                key=lambda x: x["similarity"],
                reverse=True,
            )

            for i in result:
                print(i)

    except Exception as e:
        print(e)
