import Head from 'next/head';
import PropTypes from 'prop-types';

const SEO = ({ pageTitle }) => {
	const title = `${pageTitle} || ITS`;
	return (
		<Head>
			<title>{title}</title>
			<meta httpEquiv="x-ua-compatible" content="ie=edge" />
			<meta name="description" content="سرفر التكنولوجيا الدولي" />
			<meta name="robots" content="noindex, follow" />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1, shrink-to-fit=no"
			/>
			<link rel="icon" href="/images/logo/logo-white2.png" />
		</Head>
	);
};

SEO.propTypes = {
	pageTitle: PropTypes.string.isRequired
};

export default SEO;
