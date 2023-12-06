import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import useHttpClient from '../../shared/hooks/http-hook';
import { Modal, Spin } from 'antd';

const UserPlaces = () => {
  const userId = useParams().userId;
  const [loadedPlaces, setLoadedPlaces] = useState();
  const {isLoading, error, get, clearError} = useHttpClient();

  useEffect(() => {
    const getUsers = async () => {
      try {
        let action = {
          path: `/places/user/${userId}`,
        };
        const response = await get(action);
        console.log("From user places component", response.data);
        setLoadedPlaces(response.data.places);
      } catch (err) { // already handle the error in useHttpClient hook
      }
    };

    getUsers();
  }, [get, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) => prevPlaces.filter(place => place.id !== deletedPlaceId));
  };
  return <>
    <Spin spinning={isLoading} size="large" delay={100}>
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler}/>}
    </Spin>
    ;
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
  </>;
};

export default UserPlaces;
