import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ToastContext from '../context/ToastContext';

const Register = () =>{
  const {toast} = useContext(ToastContext);
    const {registerUser} = useContext(AuthContext);
    const [credentials,setCredentials] = useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:"",
    });


    const handleInputChange = (event)=>{
        const {name,value} = event.target;

        setCredentials({...credentials,[name]:value})
    };

    const handleSubmit = (event)=>{
        event.preventDefault();
        if(!credentials.email || 
            !credentials.password || 
            !credentials.confirmPassword){
            toast.error("Please enter all the required fields")
            return;
        }

        if(credentials.password !== credentials.confirmPassword){
            toast.error("Password do not match");
            return;
        }

        const userData = { ...credentials, confirmPassword: undefined };
        registerUser(credentials);
    }
    return <>
   
    <h1>Create your Account</h1>
    <br />
     <Form onSubmit={handleSubmit}>
     <Form.Group className="mb-3" controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control 
        type="text"
         name="name" 
         value={credentials.name} 
         placeholder="Enter name"
         onChange={handleInputChange}
         required
         style={{ 
          borderRadius: '15px',
          boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.1)',
          width: '500px'
        }}
         />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
         type="email"
          name="email"
           placeholder="Enter email"
           value={credentials.email}
           onChange={handleInputChange}
           required
           style={{ 
            borderRadius: '15px',
            boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.1)',
            width: '500px'
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
        placeholder="Password"
        value={credentials.password}
        onChange={handleInputChange}
        required
        style={{ 
          borderRadius: '15px',
          boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.1)',
          width: '500px'
        }}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
         type="password" 
         name="confirmPassword"
          placeholder="Password" 
          value={credentials.confirmPassword}
          onChange={handleInputChange}
          required
          style={{ 
            borderRadius: '15px',
            boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.1)',
            width: '500px'
          }}
          />
      </Form.Group>
      <Button type="submit"
      style={{
        borderRadius: '15px',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.2)'
      }}>
        Register
      </Button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </Form>
    </>
    
}

export default Register;