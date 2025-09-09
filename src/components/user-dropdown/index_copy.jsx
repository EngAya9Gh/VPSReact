import PropTypes from 'prop-types';
import Image from 'next/image';
import Anchor from '@ui/anchor';
import { useState, useEffect } from 'react';
import LogoutButton from '@components/logout-button';
import axios from 'axios';
import { BellIcon } from '@heroicons/react/24/outline'; // استيراد أيقونة الجرس

const UserDropdown = ({ ethBalance, auth ,debts}) => {
	const [notificationsCount, setNotificationsCount] = useState(2);

  return (
    <div className="icon-box">

      {/* أيقونة الإشعارات */}
      <div className="icon-box notification-icon">
        <Anchor path="#">
          <div className="notification-bell">
            <BellIcon className="w-7 h-7 text-red-600 my-notification" />
            {notificationsCount > 0 && (
              <span className="notification-count">
                {notificationsCount}
              </span>
            )}
          </div>
        </Anchor>
      </div>

      {/* القائمة المنسدلة */}
      <div className="rn-dropdown">
        <div className="rn-inner-top">
          111111
        </div>
            <div className="rn-inner-top">
          22222
        </div>

        {/* 
        <div className="rn-product-inner">
          <ul className="product-list">
          </ul>
        </div>

        <div className="add-fund-button mt--20 pb--20">
          <Anchor className="btn btn-primary-alta w-100" path="https://api.its-server.online/login">
            ادارة العملاء
          </Anchor>
        </div>

        <ul className="list-inner">
          <li>
            <Anchor path="/edit-profile">المعلومات الشخصية</Anchor>
          </li>
          <li>
            <LogoutButton />
          </li>
        </ul>
        */}
      </div>
    </div>
  );
};

UserDropdown.propTypes = {
  ethBalance: PropTypes.string,
  auth: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
  }),
  debts: PropTypes.string,
};

export default UserDropdown;
