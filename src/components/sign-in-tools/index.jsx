import Logo from '@components/logo';
import axios from 'axios';
import Link from 'next/link';

const Header = () => {  
	return (
<div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '10px',
  width: '100%',
}}>
  <div style={{
    display: 'flex',
    gap: '8px', // مسافة بسيطة بين الأيقونات
    alignItems: 'center',
  }}>
    {/* معلومات المستخدم */}
    <Link href="/edit-profile" title="الملف الشخصي">
      <button
        type="button"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <i className="feather feather-user" style={{ fontSize: '15px' }}></i>
      </button>
    </Link>
        <Link href="/myFavorites" title="المفضلة  ">
      <button
        type="button"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <i className="feather feather-heart" style={{ fontSize: '15px' }}></i>
      </button>
    </Link>

    {/* تسجيل الخروج */}
    <button
      type="button"
      title="تسجيل الخروج"
      onClick={() => {
        localStorage.removeItem('token');
        window.location.reload();
      }}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <i className="feather feather-log-out" style={{ fontSize: '15px' }}></i>
    </button>
  </div>
</div>


	);
};

export default Header;

 