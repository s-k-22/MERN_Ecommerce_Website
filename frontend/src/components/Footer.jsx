import React from "react";
import "../componentStyles/Footer.css";
import {
  Phone,
  Mail,
  GitHub,
  LinkedIn,
  YouTube,
  Instagram,
} from "@mui/icons-material";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* section 1 */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>
            <Phone fontSize="small" />
            Phone: +8329371573
          </p>
          <p>
            <Mail fontSize="small" />
            Email: swar.khatale@gmail.com
          </p>
        </div>

        {/* section 2 */}
        <div className="footer-section social">
          <h3>Follow Me</h3>
          <div className="social-links">
            <a href="" target="_blank">
              <GitHub className="social-icon" />
            </a>
            <a href="" target="_blank">
              <LinkedIn className="social-icon" />
            </a>
            <a href="" target="_blank">
              <YouTube className="social-icon" />
            </a>
            <a href="" target="_blank">
              <Instagram className="social-icon" />
            </a>
          </div>
        </div>

        {/* section 3 */}
        <div className="footer-section about">
          <h3>About</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio,
            tempore! Optio deserunt iusto omnis officia iste accusantium sequi
            aliquid suscipit?
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; Swarali Khatale - All rights reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
