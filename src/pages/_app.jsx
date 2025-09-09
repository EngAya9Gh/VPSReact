import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import sal from 'sal.js';
import { ThemeProvider } from 'next-themes';
import { MobileProvider } from '../context/MobileContext';  // استيراد MobileProvider

import '../assets/css/bootstrap.min.css';
import '../assets/css/feather.css';
import '../assets/css/modal-video.css';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/scss/style.scss';

const MyApp = ({ Component, pageProps }) => {
	const router = useRouter();

	useEffect(() => {
		sal({ threshold: 0.1, once: true });
	}, [router.asPath]);

	useEffect(() => {
		sal();
	}, []);

	useEffect(() => {
		document.body.className = `${pageProps.className}`;
	});

	return (
		<ThemeProvider defaultTheme="dark">
			{/* إضافة MobileProvider هنا لتغليف كل التطبيق */}
			<MobileProvider>
				<Component {...pageProps} />
			</MobileProvider>
		</ThemeProvider>
	);
};

MyApp.propTypes = {
	Component: PropTypes.elementType,
	pageProps: PropTypes.shape({
		className: PropTypes.string
	})
};

export default MyApp;
