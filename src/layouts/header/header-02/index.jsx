import { useEffect, useState } from 'react';
import Logo from '@components/logo';
import SideMenu from '@components/menu/side-menu';
import Tools from '@components/sign-in-tools';
import axios from 'axios';
import Link from 'next/link';
import sideMenuData from '../../../data/general/menu-02.json';
import sideMenuDataLogout from '../../../data/general/menu-02_1.json';
import helpMenuData from '../../../data/general/menu-03.json';

const Header = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [auth, setAuth] = useState(true);
	const [logo, setLogoSrc] = useState('');
    const [mydata, setMyData] = useState({ financials: {} });
	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [currency, setCurrency] = useState('TL');

        useEffect(() => {
          if (typeof window !== 'undefined') {
            const savedCurrency = localStorage.getItem('currency') || 'TL';
            setCurrency(savedCurrency.toUpperCase());
          }
        }, []);


	useEffect(() => {
		const storedToken = localStorage.getItem('token');

		if (!storedToken) {
			setIsAuthenticated(false);
		} else {
			setIsAuthenticated(true);
		}
      const fetchData = async () => {
            try {

                const result = await axios.get(`${apiBaseUrl}/myWallet`, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                     },
                });
                setMyData(result.data);
            } catch (error) {
            }
        };

        fetchData();

		const fetchauth = async () => {
			try {
				const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
				if (typeof window !== 'undefined') {
					const storedToken = localStorage.getItem('token');
		
					if (storedToken) {
						
						const result = await axios.get(`${apiBaseUrl}/logged-in-user`, {
							headers: {
								Authorization: `Bearer ${storedToken}` // Pass token in Authorization header
							}
						});
						setAuth(result.data);
					}
				}

    
			} catch (error) {
				console.log('Error fetching auth:', error);
			}
		};
		fetchauth();
		const fetchLogo = async () => {
			try {
				const result = await axios.get(`${apiBaseUrl}/about-us`);
				setLogoSrc(
					`https://api.its-server.online/assets/images/setting/${result.data.setting.logo}`
				);
			} catch (error) {}
		};
		fetchLogo();
	}, []);

	return (
		<div className="d-none d-lg-block">
			<div className="header-area left-header-style d-flex">
				<Logo logo={logo} />
               	{isAuthenticated ? (
              <>
              <p className="name-style ">{auth.name}</p>
              <p className="price align-txt-center">{auth.balance}<span className="debts">( {`${mydata?.financials?.debts || 0} `} ){currency} </span></p>
			    <Tools/>	
              </>	) : null}

				<div className="sidebar-nav-wrapper">
					{isAuthenticated ? (
						<SideMenu menu={sideMenuData} />
					) : (
						<SideMenu menu={sideMenuDataLogout} />
					)}

					{isAuthenticated ? <SideMenu menu={helpMenuData} /> : null}
				</div>
				{/*    {isAuthenticated ? (
          <AuthorProfile
            name={auth.name}
            image={auth.image}
            balance={auth.balance}
          />
        ) : null}*/}
			</div>
		</div>
	);
};

export default Header;
