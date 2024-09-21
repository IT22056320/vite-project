import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { Row, Col, Image } from 'react-bootstrap';  // Import Row, Col, and Image components
import { AuthContext } from '../context/AuthContext';
import ToastContext from '../context/ToastContext';
import logo from '../assets/login_p.png'; // Adjust the path based on your file structure


const Login = () => {
  const { toast } = useContext(ToastContext);
  const { loginUser } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    toast.success("Logging In the User");

    if (!credentials.email || !credentials.password) {
      toast.error("Please enter all the required fields");
      return;
    }
    loginUser(credentials);
  };

  return (
    <>
      <h1>Login</h1>
      <br />
      <Row>
        {/* Column for the Form */}
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={credentials.email}
                placeholder="Enter email"
                onChange={handleInputChange}
                required
                style={{
                  borderRadius: '15px',
                  boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.1)',
                  width: '100%',
                }}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleInputChange}
                required
                style={{
                  borderRadius: '15px',
                  boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.1)',
                  width: '100%',
                }}
              />
            </Form.Group>

            <Button
              type="submit"
              style={{
                borderRadius: '15px',
                boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
              }}
            >
              Login
            </Button>
            <p>
              Don't have an account? <Link to="/register">Create One</Link>
            </p>
          </Form>
        </Col>

        {/* Column for the Image */}
        <Col md={6} className="d-flex align-items-center justify-content-center">
          <Image
            src={logo}
            alt="Login Illustration"
            fluid
            rounded
            style={{
              borderRadius: '15px',
              marginTop:'-100px',
              marginLeft:'200px',
              width: '100%',
              maxWidth: '500px',
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default Login;
