import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { parseISO, format } from "date-fns";
import { GrUnlock } from 'react-icons/gr';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isChecked, setisChecked] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await fetch("https://itransition-be.herokuapp.com/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.log("Error while fetching");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [setisChecked]);

  const handleDeleteUser = async () => {
    const response = await fetch(`https://itransition-be.herokuapp.com/users/deleteUsers`, {
      method: "DELETE",
      body: JSON.stringify(isChecked),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      console.log("FILTERED USERS",users.filter((user) => data.find((row) => row === user._id)));
      setUsers(users.filter((user) => !data.find((row) => row === user._id)));
    }
  };

  const handleBlockedUseStatus = async () => {
    try {
      const response = await fetch(`https://itransition-be.herokuapp.com/users/status`, {
        method: "PUT",
        body: JSON.stringify({isChecked, title: "Blocked" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if(response.ok){
        const data = await response.json()
        if(data.length === users.length){
          navigate("/login")
        }else{
          window.location.reload()

        }
        console.log("DATA",data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleActiveUseStatus = async () => {
    try {
      const response = await fetch(`https://itransition-be.herokuapp.com/users/status`, {
        method: "PUT",
        body: JSON.stringify({isChecked, title: "Active" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if(response.ok){
        window.location.reload()
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlecheckbox = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setisChecked([...isChecked, value]);
    } else {
      setisChecked(isChecked.filter((e) => e !== value));
    }
  };

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setisChecked(users.map((user) => user._id));
    if (isCheckAll) {
      setisChecked([]);
    }
  };

  return (
    <Container>
      <div className="toolbar-btns">
        <Button variant="danger" onClick={handleBlockedUseStatus}>
          Block
        </Button>
        <Button variant="light" onClick={handleActiveUseStatus}>
        <GrUnlock style={{fontSize:"25px"}}/>
        </Button>
        <Button variant="info" onClick={() => handleDeleteUser()}>
         <RiDeleteBin2Fill className="text-danger" style={{fontSize:"30px"}} />
        </Button>
      </div>
      <Row className="mt-5 d-flex justify-content-center">
        <Col md={12} className="d-flex justify-content-center">
          <Table striped bordered hover variant="dark" className="table">
            <thead>
              <tr>
                <th>
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      label="Select all"
                      checked={isCheckAll}
                      onChange={handleSelectAll}
                    />
                  </Form.Group>
                </th>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Last login time</th>
                <th>Registration Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        value={user._id}
                        checked={isCheckAll ? isCheckAll : user.isChecked}
                        onChange={(e) => handlecheckbox(e)}
                      />
                    </Form.Group>
                  </td>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {format(parseISO(user.updatedAt), "EEEE, MMM. do - HH:mm")}
                  </td>
                  <td>
                    {format(parseISO(user.createdAt), "EEEE, MMM. do - HH:mm")}
                  </td>
                  <td>{user.status}</td>
                  {/* <td>{isChecked.includes(user._id) ? currentStatus : "Active"}</td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};
export default Home;
