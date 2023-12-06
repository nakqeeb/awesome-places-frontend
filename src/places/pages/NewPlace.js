import React, { useContext, useState } from "react";
import "./PlaceForm.css";
import { Button, Form, Input, Modal, Spin, Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import useHttpClient from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useNavigate } from "react-router-dom";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const NewPlace = () => {
  const { isLoading, error, post, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [imageFile, setImageFile] = useState();

  const handleImageChange = (info) => {
    // console.log(info.file.originFileObj);
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        // console.log(url);
        setLoading(false);
        setImageUrl(url);
      });
      setImageFile(info.file.originFileObj);
    }
  };

  const placeSubmitHandler = async (value) => {
    let formData = new FormData();
    formData.append("title", value.title);
    formData.append("description", value.description);
    formData.append("address", value.address);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    /* const postData = {
      title: value.title,
      description: value.description,
      address: value.address,
      creator: auth.userId,
    }; */
    let action = {
      path: "/places",
      body: formData,
      headers: {
        Authorization: `Bearer ${auth.token}`,
      }
    };
    try {
      await post(action);
      navigate("/");
    } catch (err) {} // already handle the error in useHttpClient hook
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Spin spinning={isLoading} size="large" delay={100}>
        <Form className="place-form" onFinish={placeSubmitHandler}>
          <div
            style={{
              margin: "auto",
              textAlign: "center",
              width: "300px",
              height: "300px",
              display: "flex",
              flexWrap: "wrap",
              alignContent: "center",
            }}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              beforeUpload={beforeUpload}
              onChange={handleImageChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" width={300} height={300} />
              ) : (
                uploadButton
              )}
            </Upload>
          </div>
          <Form.Item
            name="title"
            rules={[
              {
                required: true,
                message: "Please enter a valid title.",
              },
            ]}
          >
            <Input
              autoComplete="off"
              placeholder="Title"
              size="large"
              style={{ background: "#F7F3EA", borderRadius: "0px" }}
              bordered={false}
            />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[
              {
                required: true,
                message:
                  "Please enter a valid description (at least 5 characters).",
              },
            ]}
          >
            <Input.TextArea
              minLength={5}
              autoComplete="off"
              placeholder="Description"
              size="large"
              style={{ background: "#F7F3EA", borderRadius: "0px" }}
              bordered={false}
            />
          </Form.Item>
          <Form.Item
            name="address"
            rules={[
              {
                required: true,
                message: "Please enter a valid address.",
              },
            ]}
          >
            <Input
              autoComplete="off"
              placeholder="Address"
              size="large"
              style={{ background: "#F7F3EA", borderRadius: "0px" }}
              bordered={false}
            />
          </Form.Item>
          <Button htmlType="submit">Add Place</Button>
        </Form>
      </Spin>
      <Modal
        open={error}
        onOk={clearError}
        onCancel={clearError}
        okText={"OK"}
        closable={false}
        okButtonProps={{ style: { background: "#CAB272" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div style={{ textAlign: "center" }}>
          <h3 className="modal_dialog_title">Sorry</h3>
          <span className="modal_dialog_paragraph">{error}</span>
        </div>
      </Modal>
    </>
  );
};

export default NewPlace;
