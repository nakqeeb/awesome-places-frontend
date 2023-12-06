import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import axios from "axios";
import { Modal, Spin } from "antd";
import useHttpClient from "../../shared/hooks/http-hook";

const Users = () => {
  const [users, setUsers] = useState();
  const {isLoading, error, get, clearError} = useHttpClient();

  useEffect(() => {
    const getUsers = async () => {
      try {
        let action = {
          path: "/users",
        };
        const response = await get(action);
        console.log("From users component", response.data.users);
        setUsers(response.data.users);
      } catch (err) { // already handle the error in useHttpClient hook
      }
    };

    getUsers();
  }, [get]);

  return (
    <>
      <Spin spinning={isLoading} size="large" delay={100}>
        {!isLoading && users && <UsersList items={users} />}
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

export default Users;
