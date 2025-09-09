/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import web3 from 'web3';
import Link from 'next/link';
import SearchForm from '@components/search-form/layout-03';
import ColorSwitcher from '@components/color-switcher';
import BurgerButton from '@ui/burger-button';
import FlyoutSearchForm from '@components/search-form/layout-02';
import MobileMenu from '@components/menu/mobile-menu-02';
import UserDropdown from '@components/user-dropdown';
import RateDropdown from '@components/rate-dropdown';
import { useOffcanvas, useFlyoutSearch } from '@hooks';
import axios from 'axios';
import sideMenuData from '../../data/general/menu-02.json';
import sideMenuDataLogout from '../../data/general/menu-02_1.json';

const TopBarArea = () => {

    const [mydata, setMyData] = useState({ financials: {} });

	const [logo, setLogoSrc] = useState('');

	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

	useEffect(() => {


		const fetchLogo = async () => {
			try {
				const result = await axios.get(`${apiBaseUrl}/about-us`);
				setLogoSrc(
					`http://localhost:8082/assets/images/setting/${result.data.setting.logo}`
				);
			} catch (error) {}
		};
		fetchLogo();
	}, []);
 useEffect(() => {
        const fetchData = async () => {
            try {
                const storedToken = localStorage.getItem('token');

                const result = await axios.get(`${apiBaseUrl}/myWallet`, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                     },
                });
                setMyData(result.data);
            } catch (error) {
                console.error("Error fetching wallet data:", error);
            }
        };

        fetchData();
    }, []);


	const { search, searchHandler } = useFlyoutSearch();
	const { offcanvas, offcanvasHandler } = useOffcanvas();

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [ethBalance, setEthBalance] = useState('');
    const [notifications, setNotifications] = useState([]);
	const [_, setLoading] = useState(true); // Suppressed unused loading variable warning
	const [auth, setAuth] = useState(true);

	useEffect(() => {
		const storedToken = localStorage.getItem('token');

		if (!storedToken) {
			setIsAuthenticated(false);
		} else {
			setIsAuthenticated(true);
			setLoading(false);
		}


		const fetchauth = async () => {
			try {
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
	}, []);




	const detectCurrentProvider = () => {
		let provider;
		if (window.ethereum) {
			provider = window.ethereum;
		} else if (window.web3) {
			provider = window.web3.currentProvider;
		} else {
			console.log(
				'Non-ethereum browser detected. You should install Metamask'
			);
		}
		return provider;
	};


	const onDisconnect = () => {
		setIsAuthenticated(false);
	};

	return (
		<>
			<div className="rn-top-bar-area">
				<div className="d-none d-lg-block">
					<SearchForm />
				</div>

				<div className="contact-area">
					<div className="rn-icon-list setting-option d-block d-lg-none">
						<div className="icon-box search-mobile-icon">
							<button
								type="button"
								aria-label="Click here to open search form"
								onClick={searchHandler}
							>
								<i className="feather-search" />
							</button>
						</div>
						<FlyoutSearchForm isOpen={search} />
					</div>
					{isAuthenticated && (

						<div className="setting-option rn-icon-list user-account">
							<UserDropdown
								onDisconnect={onDisconnect}
								ethBalance={ethBalance}
								auth={auth}
                                debts={`${mydata?.financials?.debts || 0} `}
							/>
						</div>



					)}
                    <div className="setting-option rn-icon-list user-account">
							<RateDropdown baseCurrency="USD" />
						</div>
						{isAuthenticated && (
						<div
						id="my_switcher"
						className="my_switcher setting-option"
					>
							<Link href="/myFavorites"><i className='feather feather-heart favorite_Feather'></i></Link>

						</div>


					)}

					<div className="setting-option mobile-menu-bar ml--5 d-block d-lg-none">
						<div className="hamberger icon-box">
							<BurgerButton onClick={offcanvasHandler} />
						</div>
					</div>
                  	<div className="setting-option">
                        <div className="icon-box">
							<a href="https://api.whatsapp.com/send/?phone=905392065497&text&type=phone_number&app_absent=0"
							   target="_blank" rel="noopener noreferrer">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="#25D366"
                              >
                                <path d="M12.004 2.004c-5.523 0-10 4.477-10 10 0 1.793.479 3.492 1.386 4.996l-1.48 5.481 5.634-1.471c1.452.826 3.104 1.292 4.88 1.292 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10zm.041 18c-1.583 0-3.129-.407-4.496-1.172l-.321-.185-3.343.873.891-3.301-.209-.338c-.84-1.367-1.287-2.937-1.287-4.545 0-4.411 3.589-8 8-8 4.411 0 8 3.589 8 8 0 4.411-3.589 8-8 8zm4.45-5.714c-.247-.124-1.469-.726-1.698-.808-.229-.082-.396-.124-.564.123s-.647.808-.793.975c-.146.165-.29.185-.537.061-.247-.124-1.041-.383-1.981-1.22-.732-.652-1.227-1.457-1.37-1.705-.145-.248-.015-.383.109-.506.111-.11.247-.29.371-.435.124-.145.165-.248.248-.413.082-.165.041-.31-.021-.435-.061-.124-.564-1.353-.772-1.854-.204-.493-.411-.428-.564-.428-.146-.015-.311-.015-.478-.015-.166 0-.435.062-.663.31-.227.248-.863.841-.863 2.048s.884 2.372 1.008 2.537c.124.165 1.736 2.63 4.211 3.689.589.254 1.049.405 1.406.518.591.187 1.128.16 1.553.096.474-.071 1.468-.601 1.676-1.18.207-.579.207-1.075.145-1.18-.061-.103-.227-.165-.474-.289z" />
                              </svg>
                            </a>
                        </div>
                    </div>
					<div
						id="my_switcher"
						className="my_switcher setting-option"
					>
						<ColorSwitcher />
					</div>

				</div>
			</div>
		{isAuthenticated ?
			<MobileMenu
				menu={sideMenuData}
				isOpen={offcanvas}
				onClick={offcanvasHandler}
				logo={logo}
                auth={auth}
                debts={`${mydata?.financials?.debts || 0} `}
                isAuthenticated={isAuthenticated}
			/> : 	<MobileMenu
			menu={sideMenuDataLogout}
			isOpen={offcanvas}
			onClick={offcanvasHandler}
			logo={logo}
            isAuthenticated={isAuthenticated}

		/> }
		</>
	);
};

export default TopBarArea;
