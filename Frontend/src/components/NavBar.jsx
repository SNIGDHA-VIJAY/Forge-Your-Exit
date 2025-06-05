import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <h2 style={styles.logo}>Forge Your Exit</h2>

      {/* Links (Desktop and Mobile) */}
      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/alert" style={styles.link}>Alert</Link>
        <Link to="/volunteer" style={styles.link}>Volunteer</Link>
      </div>

      {/* Mobile Menu Icon */}
      <div style={styles.menuIcon} id="menuIcon">&#9776;</div>

      {/* Mobile Menu */}
      <div style={styles.mobileMenu} id="mobileMenu">
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/alert" style={styles.link}>Alert</Link>
        <Link to="/volunteer" style={styles.link}>Volunteer</Link>
      </div>
    </nav>
  );
};


const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: '0',
    zIndex: '1000',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#d32f2f',
    textDecoration: 'none',
    letterSpacing: '1px',
  },
  navLinks: {
    display: 'flex',
    gap: '25px',
  },
  link: {
    fontSize: '1.1rem',
    fontWeight: '500',
    color: '#333',
    textDecoration: 'none',
    transition: 'color 0.3s ease, transform 0.2s ease',
  },
  menuIcon: {
    display: 'none',
    fontSize: '2rem',
    cursor: 'pointer',
    color: '#333',
  },
  mobileMenu: {
    display: 'none',
    position: 'absolute',
    top: '70px',
    right: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    width: '200px',
    padding: '20px',
    textAlign: 'center',
  },
  mobileMenuActive: {
    display: 'block',
  },
};

const toggleMenu = () => {
  const mobileMenu = document.getElementById('mobileMenu');
  mobileMenu.classList.toggle('mobileMenuActive');
};

export default NavBar;
