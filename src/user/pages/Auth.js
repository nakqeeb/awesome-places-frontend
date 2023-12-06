import { message, Button, Card, Form, Input, Modal, Spin, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import "./Auth.css";
import { useContext, useEffect, useState } from "react";
import FormItem from "antd/es/form/FormItem";
import { AuthContext } from "../../shared/context/auth-context";
import useHttpClient from "../../shared/hooks/http-hook";

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

const Auth = () => {
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [btndisabled, setbtndisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [imageFile, setImageFile] = useState();
  const { isLoading, error, post, clearError } = useHttpClient();

  useEffect(() => {
    console.log(imageFile);
  }, [imageFile]);

  const switchModeHandler = () => {
    if (!isLoginMode) {
    } else {
    }

    setIsLoginMode((prevMode) => !prevMode);
  };

  const validatePassword = (rule, value, callback) => {
    if (value && value.length < 6) {
      callback("Password should be at least 6 characters");
    } else {
      callback(); // Validation passed
    }
  };

  const onValuesChange = (changedValues, allValues) => {
    if (
      allValues.email !== undefined &&
      allValues.password !== undefined &&
      allValues.email !== "" &&
      allValues.password !== "" &&
      isLoginMode
    ) {
      setbtndisabled(false);
    } else if (
      allValues.name !== undefined &&
      allValues.email !== undefined &&
      allValues.password !== undefined &&
      imageFile !== undefined &&
      allValues.name !== "" &&
      allValues.email !== "" &&
      allValues.password !== "" &&
      imageFile !== "" &&
      !isLoginMode
    ) {
      setbtndisabled(false);
    } else {
      setbtndisabled(true);
    }
  };

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

  const onFinish = async (values) => {
    if (isLoginMode) {
      const loginData = { email: values.email, password: values.password };
      let action = {
        path: "/users/login",
        body: loginData,
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const responseData = await post(action);
        auth.login(responseData.data.userId, responseData.data.token);
      } catch (err) {
        // already handle the error in useHttpClient hook
      }
    } else {
      let formData = new FormData();
      formData.append("email", values.email);
      formData.append("name", values.name);
      formData.append("password", values.password);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      /* const signUpData = {
          name: values.name,
          email: values.email,
          password: values.password,
          image: imageFile,
        }; */
      let action = {
        path: "/users/signup",
        // body: signUpData,
        body: formData,
      };
      try {
        const responseData = await post(action);
        auth.login(responseData.data.userId, responseData.data.token);
      } catch (err) {
        // already handle the error in useHttpClient hook
      }
    }

    console.log("e", error);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Card className="authentication">
        <Spin spinning={isLoading} size="large" delay={100}>
          <h2>Login Required</h2>
          <hr />
          <Form
            form={form}
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            validateTrigger="onSubmit"
          >
            {!isLoginMode && (
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
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            )}

            {!isLoginMode && (
              <FormItem
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter your name",
                  },
                ]}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    fontWeight: "bold",
                  }}
                >
                  <label style={{ fontSize: 16 }}>Your name</label>
                  <Input placeholder="Your name" />
                </div>
              </FormItem>
            )}

            <FormItem
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Enter a valid email address",
                },
              ]}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontWeight: "bold",
                }}
              >
                <label style={{ fontSize: 16 }}>E-Mail</label>
                <Input placeholder="E-Mail" />
              </div>
            </FormItem>

            <FormItem
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password",
                },
                {
                  validator: validatePassword, // Custom validation function
                },
              ]}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontWeight: "bold",
                }}
              >
                <label style={{ fontSize: 16 }}>Password</label>
                <Input type="password" placeholder="Password" />
              </div>
            </FormItem>
            <Button
              type="primary"
              danger
              htmlType="submit"
              disabled={btndisabled}
            >
              {isLoginMode ? "LOGIN" : "SIGNUP"}
            </Button>
          </Form>
          <Button
            type="primary"
            onClick={switchModeHandler}
            style={{ marginTop: "0.5rem" }}
          >
            SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
          </Button>
        </Spin>
      </Card>
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

export default Auth;
