import { Link } from "react-router-dom";

const Footer = () => {
    return (
      <footer className="text-white text-center py-4 mt-5" style={{ backgroundColor: '#5B99C2' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-3 text-left">
              <p>At Code Analyzer Pro, we value your feedback and strive to provide the best tools for analyzing your code. Let us know how our platform is working for you, and feel free to suggest new features or report any issues.</p>
            </div>
            <div className="col-md-3">
              <p>Code Analyzer Pro</p>
              <ul className="list-unstyled">
                <li><Link to="/" className="text-white">Home</Link></li>
                <li><Link to="/features" className="text-white">Features</Link></li>
                <li><Link to="/pricing" className="text-white">Pricing</Link></li>
                <li><Link to="/about" className="text-white">About Us</Link></li>
                <li><Link to="/contact" className="text-white">Contact</Link></li>
                <li><Link to="/blog" className="text-white">Blog</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <p>Services</p>
              <ul className="list-unstyled">
                <li><Link to="/code-analysis" className="text-white">Code Analysis</Link></li>
                <li><Link to="/security-check" className="text-white">Security Check</Link></li>
                <li><Link to="/performance-review" className="text-white">Performance Review</Link></li>
                <li><Link to="/custom-reports" className="text-white">Custom Reports</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <p>Contact Us</p>
              <p>+1 (800) 123-4567</p>
              <p>support@codeanalyzerpro.com</p>
              <p>Code Analyzer Pro, 1234 Tech Avenue, Suite 100, San Francisco, CA 94107</p>
            </div>
          </div>
          <p>&copy; {new Date().getFullYear()} Code Analyzer Pro. All rights reserved.</p>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  