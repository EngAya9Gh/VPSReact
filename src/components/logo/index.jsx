import Image from 'next/image';
import Anchor from '@ui/anchor';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Logo = ({ className, logo }) => (
	<div className={clsx('logo-thumbnail logo-custom-css', className)}>
		{logo && (
			<Anchor  path="/">
				<Image
					src={logo}
					alt="nft-logo"
					width={106}
					height={35}
					priority
					unoptimized
				/>
			</Anchor>
		)}
	</div>
);

Logo.propTypes = {
	className: PropTypes.string,
	logo: PropTypes.arrayOf(
		PropTypes.shape({
			src: PropTypes.string,
			alt: PropTypes.string
		})
	)
};

export default Logo;
