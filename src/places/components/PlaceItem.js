import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
// import Button from '../../shared/components/FormElements/Button';
import Map from "../../shared/components/UIElements/Map";
import "./PlaceItem.css";
import { AuthContext } from "../../shared/context/auth-context";
import { Button, Modal, Spin } from "antd";
import useHttpClient, { IMAGE_URL } from "../../shared/hooks/http-hook";
import { useNavigate } from "react-router-dom";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, remove, clearError } = useHttpClient();
  const navigate = useNavigate();

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    console.log("DELETING...");
    try {
      let action = {
        path: `/places/${props.id}`,
        headers: {
          Authorization: `Bearer ${auth.token}`,
        }
      };
      await remove(action);
      props.onDelete(props.id);
    } catch (err) {
      // already handle the error in useHttpClient hook
    }
  };

  return (
    <React.Fragment>
      <Spin spinning={isLoading} size="large" delay={100}>
        <Modal
          open={showMap}
          onCancel={closeMapHandler}
          cancelText={"Cancel"}
          closable={false}
          okButtonProps={{ style: { display: "none", background: "#CAB272" } }}
        >
          <div className="map-container">
            <Map center={props.coordinates} zoom={16} />
          </div>
        </Modal>

        <Modal
          open={showConfirmModal}
          onOk={confirmDeleteHandler}
          onCancel={cancelDeleteHandler}
          okText={"Yes"}
          cancelText={"Cancel"}
          closable={false}
          okButtonProps={{ style: { background: "#CAB272" } }}
        >
          <div style={{ textAlign: "center" }}>
            <h3 className="modal_dialog_title">Sorry</h3>
            <span className="modal_dialog_paragraph">
              Do you want to proceed and delete this place? Please note that it
              can't be undone thereafter.
            </span>
          </div>
        </Modal>

        <li className="place-item">
          <Card className="place-item__content">
            <div className="place-item__image">
              <img
                src={`${IMAGE_URL}/${props.image}`}
                alt={props.title}
              />
            </div>
            <div className="place-item__info">
              <h2>{props.title}</h2>
              <h3>{props.address}</h3>
              <p>{props.description}</p>
            </div>
            <div className="place-item__actions">
              <Button onClick={openMapHandler}>VIEW ON MAP</Button>
              {auth.userId === props.creatorId && (
                <Button
                  style={{ color: "#0086e7" }}
                  onClick={() => navigate(`/places/${props.id}`)}
                >
                  EDIT
                </Button>
              )}

              {auth.userId === props.creatorId && (
                <Button danger onClick={showDeleteWarningHandler}>
                  DELETE
                </Button>
              )}
            </div>
          </Card>
        </li>

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
      </Spin>
    </React.Fragment>
  );
};

export default PlaceItem;
