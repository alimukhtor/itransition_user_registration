import { useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();
  const [emailExist, setEmailExist] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputs = (event) => {
    const value = event.target.value;
    setRegistration({
      ...registration,
      [event.target.name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:3001/users/register", {
      method: "POST",
      body: JSON.stringify(registration),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 409) {
      setEmailExist(true);
    } else if (response.status === 204) {
      setIsRegistered(true)
      setTimeout(()=> {
        navigate("/login");

      }, 1000)
    } 
  };
  return (
    <Container>
      <Row className="main">
        <Col md={6}>
          {emailExist ? (
            <Alert variant="danger" className="rounded-pill mb-5">
              <MdCancel /> User with this email already exist!
            </Alert>
          ) : isRegistered ? (
            <Alert variant="danger" className="rounded-pill mb-5">
              <Spinner animation="grow" variant="success" /> Successfully registered!
              Wait a sec!
            </Alert>
          ) : null
          }
          <Form className="form" onSubmit={handleSubmit}>
            <h3>Register!</h3>
            <Form.Group className="form-group">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                className="rounded-pill input"
                name="name"
                value={registration.name}
                onChange={handleInputs}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                className="rounded-pill input"
                name="email"
                value={registration.email}
                onChange={handleInputs}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                className="rounded-pill input"
                name="password"
                value={registration.password}
                onChange={handleInputs}
              />
            </Form.Group>
            <Button
              variant=""
              type="submit"
              className="btn-submit rounded-pill"
            >
              Sign Up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
export default Register;
