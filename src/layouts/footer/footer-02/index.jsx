import PropTypes from 'prop-types';
import clsx from 'clsx';
import Logo from '@components/logo';
import { useEffect, useState } from 'react';
import axios from 'axios';
 

// Demo data
import footerData from '../../../data/general/footer-02.json';

const Footer = ({ className }) => {

	const [logo, setLogoSrc] = useState('');

	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	const currentYear = new Date().getFullYear(); // الحصول على السنة الحالية

	useEffect(() => {
		

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
	<div
		className={clsx(
			'rn-footer-area footer-for-left-sticky-header my-footer',
			className
		)}
	>
		<div className="container">
			<div className="row">
				<div className="col-lg-12">
					<div className="inner text-center">
						<Logo logo={logo} />
 
    <p className="description mt--30">
      Copyright © {currentYear} [ITC] | Designed by [ITC] Powered by [ITC]
    </p>
					</div>
				</div>
			</div>
		</div>
	</div>
);};

Footer.propTypes = {
	className: PropTypes.string
};

export default Footer;
