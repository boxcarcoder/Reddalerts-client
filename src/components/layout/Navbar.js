import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';

const Navbar = ({ authState: { isAuthenticated, loggedInUser }, logout }) => {
  const handleLogout = (e) => {
    logout();
  };

  const displayLinkToSubreddits = () => {
    if (!loggedInUser.phone_num) {
      return <span>Subreddits</span>;
    } else {
      return <Link to='/dashboard'>Subreddits</Link>;
    }
  };

  return (
    <Fragment>
      {isAuthenticated ? (
        <div className='navbar'>
          <Fragment>
            {displayLinkToSubreddits()}
            <Link to='/settings'>Settings</Link>
            <a onClick={(e) => handleLogout(e)} href='/register'>
              Logout
            </a>
          </Fragment>
        </div>
      ) : null}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  authState: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
