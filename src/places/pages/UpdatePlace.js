import { Button, Card, Form, Input, Modal, Spin } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useHttpClient from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const UpdatePlace = () => {
    const [form] = Form.useForm();
    const placeId = useParams().placeId;
    const { isLoading, error, get, patch, clearError } = useHttpClient();
    const navigate = useNavigate();
    // const loadedPlace = DUMMY_PLACES.find(p => p.id === placeId);
    const [loadedPlace, setLoadedPlace] = useState();
    const auth = useContext(AuthContext);

    useEffect(() => {
      const getUsers = async () => {
        try {
          let action = {
            path: `/places/${placeId}`,
          };
          const response = await get(action);
          console.log("From update place component", response.data);
          setLoadedPlace(response.data.place);
          // form.setFieldsValue(loadedPlace);
          
        } catch (err) { // already handle the error in useHttpClient hook
        }
      };
  
      getUsers();
    }, [form, get, placeId]);

  const updatePlaceSubmitHandler = async (value) => {
    console.log(value); // send this to the backend!
    const patchData = {
      title: value.title,
      description: value.description,
    };
    let action = {
      path: `/places/${placeId}`,
      body: patchData,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      }
    };
    try {
      await patch(action);
      navigate('/' + auth.userId + '/places');
    } catch (err) {} // already handle the error in useHttpClient hook
  };

  if (!isLoading && !loadedPlace && !error ) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

    return <>
    <Spin spinning={isLoading} size="large" delay={100}>
      {!isLoading && loadedPlace && <Form form={form} className="place-form" onFinish={updatePlaceSubmitHandler}>
        <Form.Item
          name="title"
          initialValue={loadedPlace.title}
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
            bordered={false} />
        </Form.Item>
        <Form.Item
          name="description"
          initialValue={loadedPlace.description}
          rules={[
            {
              required: true,
              message: "Please enter a valid description (at least 5 characters).",
            },
          ]}
        >
          <Input.TextArea
            minLength={5}
            autoComplete="off"
            placeholder="Description"
            size="large"
            style={{ background: "#F7F3EA", borderRadius: "0px" }}
            bordered={false} />
        </Form.Item>
        <Button htmlType="submit">Update Place</Button>
      </Form>}
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
};

export default UpdatePlace;