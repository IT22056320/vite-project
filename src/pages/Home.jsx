import React, { useState, useEffect, useRef, useContext } from 'react';
import { Button, Form, Modal, Card, Container, Row, Col, ListGroup, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import ToastContext from '../context/ToastContext.jsx';
import '../App.css';
import '../components/Navbar.jsx';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);

  const [newAnalyze, setNewAnalyze] = useState({
    fileName: "",
    code: "",
  });
  const renderTooltip = (props, content) => (
    <Tooltip id="button-tooltip" {...props}>
      {content}
    </Tooltip>
  );
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);
  const [updateMode, setUpdateMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [error1, setError1] = useState("");
  const [editingFile, setEditingFile] = useState(null);

  useEffect(() => {
    const checkAuthentication = () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) {
        navigate('/', { replace: true });
      }
    };

    checkAuthentication();
  }, [user, navigate]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/home`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setHistory(data.data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, []);

  const handleFileClick = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/home/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const result = await res.json();
      if (result.success) {
        setSelectedCode(result.data);
        setUpdateMode(false);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching file data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/home/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        setHistory(history.filter((item) => item._id !== id));
        setSelectedCode(null);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const isFilenameUnique = (fileName) => {
    return !history.some((item) => item.fileName === fileName);
  };

  const handleAddCode = async (event) => {
    event.preventDefault();
    setError(""); // Reset error state

  // Validation checks
  if (!newAnalyze.fileName ) {
    setError("Filename is required.");
    return;
  } else if (!newAnalyze.fileName || !newAnalyze.code) {
    setError("Both Filename and code are required.");
    return;
  }

  if (!newAnalyze.code) {
    setError1("Code is required.");
    return;
    }

    if (!newAnalyze.fileName.endsWith('.js')) {
      setError("Filename must end with '.js'.");
      return;
    }

    if (!editingFile && !isFilenameUnique(newAnalyze.fileName)) {
      setError("Filename already exists. Please choose a different name.");
      return;
    }

    if (editingFile) {
      // Update existing entry
      const updatedHistory = history.map((item) =>
        item.fileName === editingFile.fileName ? newAnalyze : item
      );
    }

    try {
      const res = await fetch(`http://localhost:4000/api/home`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newAnalyze),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      setAnalysisResult(result);
      toast.success(`Analyzation Completed`);
    } catch (error) {
      console.error("Error submitting code:", error);
      setError("An error occurred while submitting the code.");
    }
  };

  const handleUpdateCode = async (event) => {
    event.preventDefault();
    setError("");

    if (!newAnalyze.code) {
      setError("Code is required.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:4000/api/home/${selectedCode._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ code: newAnalyze.code }),
      });
      if (!res.ok) {
        const errorData = await res.json(); // Parse the error response
        setError(errorData.error || "Unknown error occurred"); // Set the error message
        return;
      }
      const result = await res.json();
      setAnalysisResult(result);
      toast.success(`Code Updated Successfully`);
      setUpdateMode(false);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating code:", error);
      setError("An error occurred while updating the code.");
    }
  };

  const handleUpdateClick = () => {
    setNewAnalyze({
      fileName: selectedCode.fileName,
      code: selectedCode.code
    });
    setUpdateMode(true);
  };

  return (
    <Container>
       
      <Row>
        <Col md={8} className="mx-auto">
          <div style={{ 
            backgroundColor: '#5B99C2', 
            borderRadius: '20px', 
            padding: '20px', 
            boxShadow: '0px 8px 20px rgba(0,0,0,0.15)', 
            transform: 'translateZ(0)'
          }}>
            <Card className="border-0 mb-4" style={{ 
              borderRadius: '20px', 
              backgroundColor: '#D1E9F6', 
              boxShadow: '0px 4px 15px rgba(0,0,0,0.2)' 
            }}>
              <Card.Header className="text-center" style={{ 
                backgroundColor: '#1A4870', 
                color: '#fff', 
                borderRadius: '20px 20px 0 0', 
                boxShadow: '0px 4px 10px rgba(0,0,0,0.2)' 
              }}>
                <h2>{updateMode ? "Update Code" : "Analyze Code"}</h2>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={updateMode ? handleUpdateCode : handleAddCode}>
                  <Form.Group controlId="fileName" className="mb-4">
                    <Form.Label>File Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter file name (.js)"
                      name="fileName"
                      value={newAnalyze.fileName}
                      onChange={(e) => setNewAnalyze({ ...newAnalyze, fileName: e.target.value })}
                      disabled={updateMode}
                      readOnly={updateMode}
                      style={{ 
                        borderRadius: '15px',
                        boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    {error && <p className="text-danger">{error}</p>} {/* Display errors */}
                  </Form.Group>
                  <Form.Group controlId="code" className="mb-4">
                    <Form.Label>Code</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={10}
                      placeholder="Paste your code here..."
                      name="code"
                      value={newAnalyze.code}
                      onChange={(e) => setNewAnalyze({ ...newAnalyze, code: e.target.value })}
                      style={{ 
                        borderRadius: '15px', 
                        fontFamily: 'monospace', 
                        fontSize: '16px', 
                        boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.1)' 
                      }}
                    />
                    {error && <p className="text-danger">{error1}</p>}
                  </Form.Group>
                  <Button
                    type="submit"
                    variant={updateMode ? "success" : "primary"}
                    style={{ 
                      width: '100%', 
                      borderRadius: '15px', 
                      boxShadow: '0px 4px 8px rgba(0,0,0,0.2)' 
                    }}
                  >
                    {updateMode ? "Update Code" : "Analyze Code"}
                  </Button>

 
                 <Link to="/manage-rules">
                 <Button
                    type="submit"
                    variant={"primary"}
                    style={{ 
                      width: '100%', 
                      borderRadius: '15px', 
                      boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                      marginTop:"20px",
                      
                    }}
                  >
                    Manage Rules
                  </Button>
                 </Link>
                  
                </Form>
                {analysisResult && (
                  <Card className="mt-4" style={{ borderRadius: '15px', boxShadow: '0px 4px 10px rgba(0,0,0,0.15)' }}>
                    <Card.Body>
                      <h5 className="text-dark">Analysis Result</h5>
                      <p><strong>File Name:</strong> {analysisResult.fileName}</p>
                      <p><strong>Lines of Code (LOC):</strong> {analysisResult.loc}</p>
                      <p><strong>Logical Lines of Code (LLOC):</strong> {analysisResult.lloc}</p>
                      <p><strong>Source Lines of Code (SLOC):</strong> {analysisResult.sloc}</p>
                      <p><strong>Comment Lines:</strong> {analysisResult.comments}</p>
                      <p><strong>Comment Percentage:</strong> {analysisResult.commentPercentage}%</p>

                      <p>
                        <strong>Code to Comment Ratio:</strong> {analysisResult.codeToCommentRatio}
                      </p>

                      {/* Tooltip for Cyclomatic Complexity */}
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip(null, "Cyclomatic complexity measures the number of independent paths through a program's source code. It represents the number of decision points, such as if statements and loops. This metric helps assess the complexity of the code, guiding how many test cases are needed and indicating the potential difficulty in maintaining and understanding the code.\n\n1–10: Simple code, easy to maintain.\n11–20: Moderate complexity, may need some additional testing or refactoring.\n21–50: High complexity, code is becoming harder to maintain and test.\n50+: Very complex, likely to be error-prone and challenging to work with.")}
                      >
                        <p>
                          <strong>Cyclomatic Complexity:</strong> {analysisResult.cyclomaticComplexity}
                        </p>
                      </OverlayTrigger>

                      {/* Tooltip for Maintainability Index */}
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip(null, "The maintainability index is a score ranging from 0 to 100 that quantifies how easy it is to maintain a piece of code. It combines various factors including cyclomatic complexity, lines of code, and other code metrics to provide an overall measure of code maintainability.\n\n0-20: Very difficult to maintain. Code is likely to be complex, poorly structured, and challenging to understand.\n21-40: Difficult to maintain. Code may require significant effort to modify or extend.\n41-60: Moderate maintainability. Code is manageable but could benefit from refactoring.\n61-80: Easy to maintain. Code is well-structured and should be relatively straightforward to work with.\n81-100: Very easy to maintain. Code is clear, well-organized, and easy to understand. Higher scores indicate better maintainability, meaning that the code is less likely to contain hidden bugs and is easier for developers to work with.")}
                      >
                        <p>
                          <strong>Maintainability Index:</strong> {analysisResult.maintainabilityIndex}
                        </p>
                      </OverlayTrigger>

                      <Button
                        onClick={() => window.location.reload()}
                        variant={updateMode ? "success" : "primary"}
                        style={{
                          width: '100%',
                          borderRadius: '15px',
                          boxShadow: '0px 4px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        Ok
                      </Button>
                    </Card.Body>
                  </Card>
                )}
              </Card.Body>
            </Card>
          </div>
        </Col>

        <Col md={4}>
          <div style={{ 
            backgroundColor: '#5B99C2', 
            borderRadius: '20px', 
            padding: '20px', 
            boxShadow: '0px 8px 20px rgba(0,0,0,0.15)', 
            transform: 'translateZ(0)'
          }}>
            <Card className="border-0" style={{ 
              borderRadius: '20px', 
              backgroundColor: '#D1E9F6', 
              boxShadow: '0px 4px 15px rgba(0,0,0,0.2)' 
            }}>
              <Card.Header className="text-center" style={{ 
                backgroundColor: '#1A4870', 
                color: '#fff', 
                borderRadius: '20px 20px 0 0', 
                boxShadow: '0px 4px 10px rgba(0,0,0,0.2)' 
              }}>
                <h2>History</h2>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {history.map((item) => (
                    <ListGroup.Item
                      key={item._id}
                      style={{ 
                        cursor: 'pointer', 
                        borderRadius: '15px', 
                        backgroundColor: '#ffefef', 
                        marginBottom: '10px', 
                        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' 
                      }}
                      onClick={() => handleFileClick(item._id)}
                    >
                      {item.fileName}
                      <Button
                        variant="danger"
                        size="sm"
                        className="float-end"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id);
                        }}
                        style={{ borderRadius: '15px' }}
                      >
                        Delete
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Code Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>File Name:</strong> {selectedCode?.fileName}</p>
          <Form.Control
            as="textarea"
            rows={10}
            readOnly
            value={selectedCode?.code}
            style={{ 
              fontFamily: 'monospace', 
              fontSize: '16px', 
              backgroundColor: '#f7f7f7',
              borderRadius: '15px', 
              boxShadow: 'inset 0px 2px 4px rgba(0,0,0,0.1)' 
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="success" 
            onClick={handleUpdateClick}
            style={{ borderRadius: '15px' }}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Home;
